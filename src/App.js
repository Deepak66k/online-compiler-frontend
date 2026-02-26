import React, { useState } from "react";
import Editor from "@monaco-editor/react";

function App() {
  const [code, setCode] = useState("print('Hello Deepak')");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    const response = await fetch("https://online-compiler-backend-t5k9.onrender.com/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const result = await response.json();
    setOutput(result.output || result.error);
  };

  return (
    <div>
      <h2>Online Python Compiler</h2>

      <Editor
        height="400px"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value)}
      />

      <button onClick={runCode}>Run</button>

      <h3>Output:</h3>
      <pre>{output}</pre>
    </div>
  );
}

export default App;
