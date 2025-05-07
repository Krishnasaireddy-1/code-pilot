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
    const res = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, input, language }),
    });
    const result = await res.json();
    setOutput(result.output);
  };

  const summariseCode = async () => {
    console.log(code);
    const res = await fetch('/api/summarise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(code),
    });
    
    if (!res.ok) {
      const error = await res.json(); // still parse to extract error
      throw new Error(error?.error || 'Something went wrong');
    }
    
    const data = await res.json(); // safe now
    
    setSummary(data.summary);
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
    <div className="flex flex-col gap-4 relative">
      <div className="flex gap-2 relative">
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

        <button onClick={saveCode} className="bg-green-600 text-white px-4 py-2">
          💾 Save Code
        </button>

        <button onClick={summariseCode} className="bg-yellow-500 text-white px-4 py-2">
          🧠 Summarise
        </button>

        <div className="relative">
          <button
            onClick={loadMyCodes}
            className="bg-purple-600 text-white px-4 py-2"
          >
            📁 My Codes
          </button>

          {showPopup && (
            <div
              ref={popupRef}
              className="absolute z-10 top-12 left-0 w-64 bg-blue border shadow-lg rounded-md p-2"
            >
              <h3 className="font-semibold mb-2">📚 Saved Codes</h3>
              <ul className="max-h-60 overflow-y-auto space-y-1">
                {savedCodes.map((c) => (
                  <li
                    key={c.id}
                    onClick={() => loadCodeToEditor(c)}
                    className="cursor-pointer px-2 py-1 rounded hover:bg-blue-200"
                  >
                    {c.title} ({c.language})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Editor
        height="50vh"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={setCode}
      />

      <textarea
        placeholder="Enter input..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2"
      />

      <button onClick={runCode} className="bg-blue-500 text-white px-4 py-2">
        ▶️ Run
      </button>

      <pre className="bg-gray-900 text-white p-2">{output}</pre>

      {summary && (
        <div className="bg-yellow-100 text-black p-2 rounded">
          <h4 className="font-bold mb-1">Summary:</h4>
          <p>{summary}</p>
        </div>
      )}
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
//     setShowPopup(!showPopup); // toggle popup
//   };

//   const loadCodeToEditor = (savedCode) => {
//     setCode(savedCode.content);
//     setLanguage(savedCode.language);
//     setShowPopup(false); // close popup after loading
//   };

//   // Close popup if clicked outside
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
//     </div>
//   );
// }
