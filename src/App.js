import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // 1. Add state for the dynamic language name
  const [language, setLanguage] = useState("Python"); 
  const [code, setCode] = useState("for i in range(50):\n    print(f'Line {i}: Hello World')");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const runCode = async () => {
    setLoading(true);
    setOutput(`> Initializing ${language} runtime...\n`);
    try {
      const response = await fetch("https://online-compiler-backend-t5k9.onrender.com/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: language.toLowerCase() })
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput(`> Error: ${language} execution server unreachable.`);
    }
    setLoading(false);
  };

  return (
    <div className="ide-shell">
      <nav className="navbar">
        <div className="brand">
          <div className="logo">D</div>
          {/* 2. Dynamic Compiler Name in Header */}
          <h1><span>{language.toUpperCase()} COMPILER</span></h1>
        </div>
        <div className="session-info">
          <span className="status-dot"></span> Active Session: {language}_Runtime_01
        </div>
      </nav>

      <main className="ide-body">
        <aside className="activity-bar">
          {/* These icons could be used to switch languages in the future */}
          <div className={`icon ${language === 'Python' ? 'active' : ''}`} onClick={() => setLanguage('Python')}>🐍</div>
          <div className={`icon ${language === 'JS' ? 'active' : ''}`} onClick={() => setLanguage('JS')}>📜</div>
        </aside>

        <section className="workspace">
          <div className="editor-container">
            <div className="panel-header">
              {/* 3. Dynamic filename based on language */}
              <div className="tab active">main.{language === 'Python' ? 'py' : 'js'}</div>
              <button className="run-btn" onClick={runCode} disabled={loading}>
                {loading ? "..." : "▶ RUN"}
              </button>
            </div>
            <div className="editor-frame">
              <Editor 
                height="100%" 
                defaultLanguage={language.toLowerCase()} 
                theme="vs-dark" 
                value={code} 
                onChange={setCode} 
              />
            </div>
          </div>

          <div className="terminal-container">
            <div className="panel-header">
              <div className="tab">Terminal Output</div>
              <button className="clear-btn" onClick={() => setOutput("")}>Clear</button>
            </div>
            <div className="terminal-content" ref={terminalRef}>
              <pre>{output || `system@deepak:~$`}</pre>
            </div>
          </div>
        </section>
      </main>

      <footer className="ide-status-bar">
        <span>UTF-8</span>
        {/* 4. Dynamic version info */}
        <span>{language} 3.x Engine</span>
        <span>© 2026 DEEPAK KUMAR</span>
      </footer>
    </div>
  );
}

export default App;