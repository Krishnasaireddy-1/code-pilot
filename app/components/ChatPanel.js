
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import io from "socket.io-client";
import CollaborativeEditor from "./CollaborativeEditor";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";

const socket = io("http://localhost:4000");

export default function ChatPanel({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [code, setCode] = useState("");
  const [user, setUser] = useState(null);
  const [collabMode, setCollabMode] = useState(false);

  useEffect(() => {
    function handleReceiveMessage(msg) {
      const isSender = msg.senderId === user?.id;
      const isReceiver = msg.receiverId === user?.id;
  
      // Add if the message is part of this conversation
      const isCurrentChat =
        (msg.senderId === selectedUser?.id && msg.receiverId === user?.id) ||
        (msg.senderId === user?.id && msg.receiverId === selectedUser?.id);
  
      if (isCurrentChat && (isSender || isReceiver)) {
        setMessages((prev) => [...prev, msg]);
      }
    }
  
    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [selectedUser, user]);
  
  useEffect(() => {
    const session = localStorage.getItem("user");
    if (session) {
      const parsed = JSON.parse(session);
      setUser(parsed.user); // Extract the actual user object
    }
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    async function fetchChat() {
      const res = await fetch(`/api/chat/${selectedUser.id}`);
      const data = await res.json();
      setMessages(data);
    }

    fetchChat();
    setShowEditor(false);
  }, [selectedUser]);

  useEffect(() => {
    socket.on("codeUpdate", setCode);
    return () => socket.off("codeUpdate");
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() === "" || !user) return;

    const msgObj = {
      text: messageInput,
      senderId: user.id,
      receiverId: selectedUser.id,
    };

    // setMessages((prev) => [...prev, { sender: "me", text: messageInput }]);
    setMessageInput("");
    socket.emit("sendMessage", msgObj);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const handleDeleteMessage = async (id) => {
    try {
      const res = await fetch(`/api/delete-message/${id}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeUpdate", newCode);
  };

  if (!selectedUser)
    return (
      <p className="w-2/3 p-4 text-gray-500 text-center">
        Select a user to chat
      </p>
    );
    if (collabMode && user && selectedUser) {
      const roomId = [user.id, selectedUser.id].sort().join("-");
      return <CollaborativeEditor onClose={() => setCollabMode(false)} roomId={roomId} />;
    }

  return (
    <div className="w-2/3 flex flex-col p-4">
      <h2 className="text-xl font-bold">{selectedUser.name}</h2>

      <div className="flex-1 overflow-y-auto border rounded-lg p-3 bg-gray-200">
      {messages.map((msg, i) => {
  const isMe = msg.senderId === user?.id;

  return (
    <div
      key={i}
      className={`group relative p-2 ${isMe ? "text-right" : "text-left"}`}
    >
      <span
        className={`inline-block p-2 rounded-lg ${isMe ? "bg-blue-500 text-white" : "bg-gray-900 text-white"}`}
      >
        {msg.text}
      </span>

      {isMe && (
        <button
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
          onClick={() => handleDeleteMessage(msg.id)}
          title="Delete"
        >
          🗑️
        </button>
      )}
    </div>
          );
      })}


      </div>

      <div className="mt-3 flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          className="p-2 bg-green-500 text-white rounded-lg"
          onClick={() => alert("Display user's saved code files here")}
        >
          View Codes
        </button>
        <button
          className="p-2 bg-purple-500 text-white rounded-lg"
          onClick={() => setCollabMode(true)}
        >
          Code Together
        </button>
      </div>

      
    </div>
  );
}
