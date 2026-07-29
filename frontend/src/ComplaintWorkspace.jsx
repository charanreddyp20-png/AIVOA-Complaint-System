import React, { useState } from "react";
import "./ComplaintWorkspace.css";

function ComplaintWorkspace() {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [complaint, setComplaint] = useState("");

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyseComplaint = () => {
    if (!category || !name || !email || !complaint) {
      alert("Please fill in all complaint details.");
      return;
    }

    setLoading(true);

    // Temporary analysis.
    // We will connect this to your backend/AI later.
    setTimeout(() => {
      setAnalysis({
        priority: "Medium",
        department: category,
        recommendation:
          "The complaint should be reviewed by the concerned department.",
      });

      setLoading(false);
    }, 700);
  };

  return (
    <div className="workspace">

      {/* HEADER */}
      <header className="workspace-header">
        <div>
          <div className="workspace-brand">AIVOA</div>
          <h1>Complaint Workspace</h1>
          <p>
            Submit a complaint and get an intelligent preliminary analysis.
          </p>
        </div>

        <div className="workspace-badge">
          AI Complaint Assistant
        </div>
      </header>

      {/* MAIN AREA */}
      <main className="workspace-grid">

        {/* LEFT SIDE */}
        <section className="complaint-panel">

          <div className="panel-title">
            <span>01</span>
            <div>
              <h2>Complaint Details</h2>
              <p>Enter the information below.</p>
            </div>
          </div>

          <div className="form-row">

            <div className="field">
              <label>Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                <option value="Public Services">Public Services</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Transport">Transport</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Other">Other</option>
              </select>
            </div>

          </div>

          <div className="form-row two-columns">

            <div className="field">
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

          </div>

          <div className="field">
            <label>Complaint</label>

            <textarea
              rows="8"
              placeholder="Describe your complaint clearly..."
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />
          </div>

          <button
            className="analyse-button"
            onClick={analyseComplaint}
            disabled={loading}
          >
            {loading ? "Analysing..." : "Analyse Complaint"}
          </button>

        </section>

        {/* RIGHT SIDE */}
        <section className="assistant-panel">

          <div className="assistant-top">
            <div className="assistant-icon">✦</div>

            <div>
              <div className="assistant-label">AIVOA AI</div>
              <h2>Complaint Assistant</h2>
            </div>

            <span className="online-dot"></span>
          </div>

          {!analysis ? (
            <div className="assistant-empty">

              <div className="empty-symbol">✦</div>

              <h3>Ready to analyse</h3>

              <p>
                Fill in the complaint details and select
                <strong> Analyse Complaint </strong>
                to generate a preliminary assessment.
              </p>

            </div>
          ) : (
            <div className="analysis-result">

              <div className="result-heading">
                Analysis Result
              </div>

              <div className="result-card">
                <span>Priority</span>
                <strong className="priority-medium">
                  {analysis.priority}
                </strong>
              </div>

              <div className="result-card">
                <span>Department</span>
                <strong>{analysis.department}</strong>
              </div>

              <div className="recommendation">
                <span>Recommendation</span>
                <p>{analysis.recommendation}</p>
              </div>

              <button className="submit-review-button">
                Send for Review
              </button>

            </div>
          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="workspace-footer">
        <strong>AIVOA</strong>
        <span>AI-powered Complaint Management System</span>
      </footer>

    </div>
  );
}

export default ComplaintWorkspace;