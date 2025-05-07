"use client";

import { useState } from "react";
import UserList from "../components/UserList";
import ChatPanel from "../components/ChatPanel";

export default function SocialChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen">
      <UserList currentUser={{ id: "me" }} onSelectUser={setSelectedUser} />
      <ChatPanel selectedUser={selectedUser} />
    </div>
  );
}
// "use client";

// import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import io from "socket.io-client";

// // CodeMirror Dynamic Import (for SSR handling)
// const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });
// import { javascript } from "@codemirror/lang-javascript";
// import { dracula } from "@uiw/codemirror-theme-dracula";

// const socket = io("http://localhost:4000"); // Adjust backend URL

// export default function SocialChat() {
//   const [users, setUsers] = useState([]); // List of users
//   const [selectedUser, setSelectedUser] = useState(null); // Chat with selected user
//   const [messages, setMessages] = useState([]); // Chat messages
//   const [messageInput, setMessageInput] = useState(""); // New message input
//   const [showEditor, setShowEditor] = useState(false); // Show/hide CodeMirror
//   const [code, setCode] = useState(""); // Shared code content

//   // Fetch users from the database
//   useEffect(() => {
//     async function fetchUsers() {
//       const res = await fetch("/api/users"); // API route to get users
//       const data = await res.json();
//       setUsers(data);
//     }
//     fetchUsers();
//   }, []);

//   // Handle user selection and fetch chat history
//   const openChat = async (user) => {
//     setSelectedUser(user);
//     setShowEditor(false); // Hide editor when opening new chat

//     // Fetch chat history (Optional)
//     const res = await fetch(`/api/chat/${user.id}`);
//     const data = await res.json();
//     setMessages(data);
//   };

//   // Send message
//   const sendMessage = () => {
//     if (messageInput.trim() === "") return;

//     const newMessage = { sender: "me", text: messageInput };
//     setMessages([...messages, newMessage]);
//     setMessageInput("");

//     socket.emit("sendMessage", {
//       to: selectedUser.id,
//       text: messageInput,
//     });
//   };

//   // Handle collaborative coding (real-time updates)
//   useEffect(() => {
//     socket.on("codeUpdate", (newCode) => {
//       setCode(newCode);
//     });

//     return () => {
//       socket.off("codeUpdate");
//     };
//   }, []);

//   const handleCodeChange = (newCode) => {
//     setCode(newCode);
//     socket.emit("codeUpdate", newCode);
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Left Panel - Users List */}
//       <div className="w-1/3 bg-gray-900 text-white p-4">
//         <h2 className="text-xl font-bold mb-4">Users</h2>
//         {users.map((user) => (
//           <div
//             key={user.id}
//             className="p-3 bg-gray-700 mb-2 rounded-lg cursor-pointer hover:bg-gray-600"
//             onClick={() => openChat(user)}
//           >
//             {user.name}
//           </div>
//         ))}
//       </div>

//       {/* Right Panel - Chat & Code Collaboration */}
//       <div className="w-2/3 flex flex-col p-4">
//         {selectedUser ? (
//           <>
//             <h2 className="text-xl font-bold">{selectedUser.name}</h2>

//             {/* Chat Messages */}
//             <div className="flex-1 overflow-y-auto border rounded-lg p-3 bg-gray-200">
//               {messages.map((msg, index) => (
//                 <div key={index} className={`p-2 ${msg.sender === "me" ? "text-right" : ""}`}>
//                   <span className={`inline-block p-2 rounded-lg ${msg.sender === "me" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
//                     {msg.text}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Message Input */}
//             <div className="mt-3 flex">
//               <input
//                 type="text"
//                 className="flex-1 p-2 border rounded-lg"
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 placeholder="Type a message..."
//               />
//               <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
//                 Send
//               </button>
//             </div>

//             {/* Code Collaboration Options */}
//             <div className="mt-4 flex space-x-4">
//               <button
//                 className="p-2 bg-green-500 text-white rounded-lg"
//                 onClick={() => alert("Display user's saved code files here")}
//               >
//                 View Codes
//               </button>
//               <button
//                 className="p-2 bg-purple-500 text-white rounded-lg"
//                 onClick={() => setShowEditor(!showEditor)}
//               >
//                 {showEditor ? "Close Editor" : "Code Together"}
//               </button>
//             </div>

//             {/* CodeMirror Editor (Appears only when "Code Together" is clicked) */}
//             {showEditor && (
//               <div className="mt-4 border p-2 rounded-lg bg-gray-100">
//                 <CodeMirror
//                   value={code}
//                   height="300px"
//                   theme={dracula}
//                   extensions={[javascript()]}
//                   onChange={handleCodeChange}
//                 />
//               </div>
//             )}
//           </>
//         ) : (
//           <p className="text-center text-gray-500">Select a user to start chatting</p>
//         )}
//       </div>
//     </div>
//   );
// }

