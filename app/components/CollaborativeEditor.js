"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";

let socket;

export default function CollaborativeEditor({ onClose, roomId }) {
  const [code, setCode] = useState("// Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    // Connect only on client
    socket = io("http://localhost:4000");

    socket.emit("joinRoom", roomId);

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("codeUpdate");
      socket.disconnect(); // Clean up on unmount
    };
  }, [roomId]);

  const handleCodeChange = (value) => {
    setCode(value);
    if (socket) {
      socket.emit("codeUpdate", { roomId, code: value });
    }
  };

  const runCode = async () => {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, input, language }),
    });
    const result = await response.json();
    setOutput(result.output);
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4 bg-gray-900 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Collaborative Code Editor</h2>
        <button onClick={onClose} className="text-red-500 hover:underline">Close</button>
      </div>

      <select 
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border p-2 bg-gray-800 text-white"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <Editor
        height="50vh"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange}
      />

      <textarea
        placeholder="Enter input..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 bg-gray-800 text-white"
      />
      <button onClick={runCode} className="bg-blue-600 px-4 py-2 rounded">Run</button>
      <pre className="bg-gray-800 p-2">{output}</pre>
    </div>
  );
}
