import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import "./App.css";

const defaultTemplates = {
  Python: `# Online Python interpreter to run Python programs: simply write, execute, and see results instantly.
print('Hello World')`,
  JS: `// Online JavaScript interpreter to run JS programs: simply write, execute, and see results instantly.
console.log('Hello World');`,
};

function App() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState(defaultTemplates["Python"]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const terminalRef = useRef(null);
  const handleLanguageChange = (newLang) => {
    if (newLang === language) return;
    // If the user has typed something, ask before clearing
    if (code && code !== defaultTemplates[language]) {
      const confirmSwitch = window.confirm(
        "You have unsaved changes. Switching languages will reset the editor. Continue?"
      );
      if (!confirmSwitch) return; // User cancelled, stay on current language
    }
    // 3. ✅ THE FIX: Clear the terminal output before switching
    setOutput("");
    // 4. Update the language
    setLanguage(newLang);
  };

  // 2. NEW: This effect handles the automatic template switching
  useEffect(() => {
    setCode(defaultTemplates[language]);
  }, [language]);

  // Terminal auto-scroll effect
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const runCode = async () => {
    setLoading(true);
    setOutput(`> Initializing ${language} runtime...\n`);

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${API_BASE_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          // Ensure "JS" is sent as "javascript" if your backend expects that
          language: language === "JS" ? "javascript" : language.toLowerCase()
        })
      });

      const data = await response.json();

      if (data.stderr) {
        setOutput("Error:\n" + data.stderr);
      } else {
        setOutput(data.output);
      }
    } catch (error) {
      setOutput(`> Error: ${language} execution server unreachable.`);
      console.error("API Error:", error);
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
          <div
            className={`icon ${language === 'Python' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('Python')}
          >
            🐍
          </div>
          <div
            className={`icon ${language === 'JS' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('JS')}
          >
            📜
          </div>
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
                width="100%" // Force 100% width
                defaultLanguage={language.toLowerCase()}
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{
                  automaticLayout: true, // Forces editor to resize with the container
                  wordWrap: "on",        // Essential for mobile
                  fontSize: window.innerWidth < 768 ? 12 : 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbersMinChars: 3,
                  padding: { top: 10 }
                }}
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