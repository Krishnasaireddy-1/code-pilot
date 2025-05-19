"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  const [code, setCode] = useState("// Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [summary, setSummary] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [savedCodes, setSavedCodes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  const runCode = async () => {
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, input, language }),
      });

      const result = await res.json();
      setOutput(result.output || "No output");
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };

  const summariseCode = async () => {
    try {
      const res = await fetch("/api/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(code),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Something went wrong");
      }

      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary(`Error: ${err.message}`);
    }
  };

  const saveCode = async () => {
    const title = prompt("Enter a title for your code:");
    if (!title) return;

    const res = await fetch("/api/save-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: code, language }),
    });

    if (res.ok) {
      alert("Code saved!");
    } else {
      alert("Failed to save code.");
    }
  };

  const loadMyCodes = async () => {
    const res = await fetch("/api/get-my-codes");
    const data = await res.json();
    setSavedCodes(data.codes);
    setShowPopup(!showPopup);
  };

  const loadCodeToEditor = (savedCode) => {
    setCode(savedCode.content);
    setLanguage(savedCode.language);
    setShowPopup(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white font-mono">
      {/* Top bar with language select and buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[#1e293b] text-white border border-gray-600 shadow-inner focus:outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <button
          onClick={saveCode}
          className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg font-semibold shadow-md"
        >
          💾 Save
        </button>

        <div className="relative">
          <button
            onClick={loadMyCodes}
            className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-semibold shadow-md"
          >
            📁 My Codes
          </button>

          {showPopup && (
            <div
              ref={popupRef}
              className="absolute top-12 left-0 w-72 max-h-64 overflow-y-auto bg-white/10 backdrop-blur-md text-white border border-gray-600 rounded-lg shadow-xl p-3 z-50"
            >
              <h3 className="font-bold mb-2">📚 Saved Codes</h3>
              <ul className="space-y-1">
                {savedCodes.map((c) => (
                  <li
                    key={c.id}
                    onClick={() => loadCodeToEditor(c)}
                    className="cursor-pointer px-3 py-1 rounded hover:bg-white/20"
                  >
                    {c.title}{" "}
                    <span className="text-xs text-gray-300">
                      ({c.language})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div><h1 className="absolute right-20 top-38 text-2xl font-bold-i">Code Editor</h1></div>
      </div>

      {/* Code Editor Section */}
      <div className="rounded-xl overflow-hidden shadow-xl border border-gray-700 bg-black/40 backdrop-blur-sm">
        <Editor
          height="50vh"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value ?? "")}
        />
      </div>

      {/* Run Code and Summarize Section */}
      <div className="mt-10 flex gap-6 items-center">
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-2">▶ Run Code</h2>
          <button
            onClick={runCode}
            className="mb-3 bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-lg font-semibold shadow-md"
          >
            Run
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-2">🧠 Summarise Code</h2>
          <button
            onClick={summariseCode}
            className="mb-1 bg-yellow-500 hover:bg-yellow-600 text-black transition px-6 py-2 rounded-lg font-semibold shadow-md"
          >
            Summarise
          </button>
        </div>
      </div>

      {/* Input and Summarize/Output Section */}
      <div className="mt-10 flex gap-6 items-center">
        {/* Input Section */}
        <div className="flex-1">
          <textarea
            placeholder="💬 Enter input..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow-inner h-48 overflow-auto w-full"
            rows={4}
          />
        </div>

        {/* Summary/Output Section */}
        <div className="flex-1 space-y-4">
          {/* Summary Section */}
          {summary && (
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow-inner h-48 overflow-auto">
              <h4 className="font-semibold text-yellow-300">📝 Summary:</h4>
              <p className="mt-1 text-yellow-100">{summary}</p>
            </div>
          )}

          {/* Output Section */}
          {output && (
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow-inner h-48 overflow-auto">
              <h4 className="font-semibold text-green-400">💡 Output:</h4>
              <pre className="mt-1 whitespace-pre-wrap text-green-300">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// "use client";

// import { useState, useRef, useEffect } from "react";
// import Editor from "@monaco-editor/react";

// export default function CodeEditor() {
//   const [code, setCode] = useState("// Write your code here");
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [summary, setSummary] = useState("");
//   const [language, setLanguage] = useState("javascript");
//   const [savedCodes, setSavedCodes] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const popupRef = useRef(null);

//   const runCode = async () => {
//     const res = await fetch("/api/execute", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ code, input, language }),
//     });
//     const result = await res.json();
//     setOutput(result.output);
//   };

//   const summariseCode = async () => {
//     console.log(code);
//     const res = await fetch('/api/summarise', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(code),
//     });
    
//     if (!res.ok) {
//       const error = await res.json(); // still parse to extract error
//       throw new Error(error?.error || 'Something went wrong');
//     }
    
//     const data = await res.json(); // safe now
    
//     setSummary(data.summary);
//   };

//   const saveCode = async () => {
//     const title = prompt("Enter a title for your code:");
//     if (!title) return;

//     const res = await fetch("/api/save-code", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, content: code, language }),
//     });

//     if (res.ok) {
//       alert("Code saved!");
//     } else {
//       alert("Failed to save code.");
//     }
//   };

//   const loadMyCodes = async () => {
//     const res = await fetch("/api/get-my-codes");
//     const data = await res.json();
//     setSavedCodes(data.codes);
//     setShowPopup(!showPopup);
//   };

//   const loadCodeToEditor = (savedCode) => {
//     setCode(savedCode.content);
//     setLanguage(savedCode.language);
//     setShowPopup(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setShowPopup(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="flex flex-col gap-4 relative">
//       <div className="flex gap-2 relative">
//         <select
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//           className="border p-2 bg-gray-800 text-white"
//         >
//           <option value="javascript">JavaScript</option>
//           <option value="python">Python</option>
//           <option value="cpp">C++</option>
//           <option value="java">Java</option>
//         </select>

//         <button onClick={saveCode} className="bg-green-600 text-white px-4 py-2">
//           💾 Save Code
//         </button>

//         <button onClick={summariseCode} className="bg-yellow-500 text-white px-4 py-2">
//           🧠 Summarise
//         </button>

//         <div className="relative">
//           <button
//             onClick={loadMyCodes}
//             className="bg-purple-600 text-white px-4 py-2"
//           >
//             📁 My Codes
//           </button>

//           {showPopup && (
//             <div
//               ref={popupRef}
//               className="absolute z-10 top-12 left-0 w-64 bg-blue border shadow-lg rounded-md p-2"
//             >
//               <h3 className="font-semibold mb-2">📚 Saved Codes</h3>
//               <ul className="max-h-60 overflow-y-auto space-y-1">
//                 {savedCodes.map((c) => (
//                   <li
//                     key={c.id}
//                     onClick={() => loadCodeToEditor(c)}
//                     className="cursor-pointer px-2 py-1 rounded hover:bg-blue-200"
//                   >
//                     {c.title} ({c.language})
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       <Editor
//         height="50vh"
//         language={language}
//         theme="vs-dark"
//         value={code}
//         onChange={setCode}
//       />

//       <textarea
//         placeholder="Enter input..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         className="border p-2"
//       />

//       <button onClick={runCode} className="bg-blue-500 text-white px-4 py-2">
//         ▶️ Run
//       </button>

//       <pre className="bg-gray-900 text-white p-2">{output}</pre>

//       {summary && (
//         <div className="bg-yellow-100 text-black p-2 rounded">
//           <h4 className="font-bold mb-1">Summary:</h4>
//           <p>{summary}</p>
//         </div>
//       )}
//     </div>
//   );
// }



