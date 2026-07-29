 import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

// ======================================================
// HOME PAGE
// ======================================================

function Home() {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const [statusEmail, setStatusEmail] = useState("");
  const [statusResult, setStatusResult] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // ======================================================
  // ANALYSE COMPLAINT
  // ======================================================

  const analyseComplaint = () => {
    if (!category || !name || !email || !description) {
      setAnalysis(null);
      setMessage("Please fill in all complaint details.");
      return;
    }

    let priority = "Low";

    const text = description.toLowerCase();

    if (
      text.includes("danger") ||
      text.includes("emergency") ||
      text.includes("threat") ||
      text.includes("harassment") ||
      text.includes("violence")
    ) {
      priority = "High";
    } else if (
      text.includes("problem") ||
      text.includes("issue") ||
      text.includes("delay") ||
      text.includes("poor")
    ) {
      priority = "Medium";
    }

    setAnalysis({
      priority,
      summary: `Your complaint has been analysed under the ${category} category. The submitted information indicates a ${priority.toLowerCase()} priority issue that should be reviewed.`,
      recommendation:
        priority === "High"
          ? "This complaint should be reviewed as soon as possible."
          : priority === "Medium"
          ? "The complaint should be reviewed and appropriate action should be taken."
          : "The complaint should be reviewed and resolved through the normal process.",
    });

    setMessage("");
  };

  // ======================================================
  // SUBMIT COMPLAINT
  // ======================================================

  const submitComplaint = async (e) => {
    e.preventDefault();

    if (!category || !name || !email || !description) {
      setMessage("Please fill in all complaint details.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          category,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      const data = await response.json();

      setMessage(
        `Complaint submitted successfully! Complaint #${data.complaint.id}`
      );

      setCategory("");
      setName("");
      setEmail("");
      setDescription("");
      setAnalysis(null);

      setTimeout(() => {
        document
          .getElementById("status")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend. Please make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CHECK COMPLAINT STATUS
  // ======================================================

  const checkStatus = async () => {
    if (!statusEmail.trim()) {
      setStatusResult(null);
      return;
    }

    setStatusLoading(true);
    setStatusResult(null);

    try {
      const response = await fetch(`${API_URL}/complaints`);

      if (!response.ok) {
        throw new Error("Failed to load complaints");
      }

      const complaints = await response.json();

      const matchingComplaints = complaints.filter(
        (complaint) =>
          complaint.email.toLowerCase() === statusEmail.trim().toLowerCase()
      );

      if (matchingComplaints.length === 0) {
        setStatusResult({
          notFound: true,
          message: "No complaint found with this email address.",
        });
      } else {
        setStatusResult({
          complaints: matchingComplaints,
        });
      }
    } catch (error) {
      console.error(error);

      setStatusResult({
        notFound: true,
        message: "Could not connect to backend.",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="app">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="header">
        <div className="logo">
          <div className="logo-icon">A</div>

          <div>
            <h1>AIVOA</h1>
            <span>AI Complaint Resolution Platform</span>
          </div>
        </div>

        <nav>
          <a href="#complaint">Submit Complaint</a>
          <a href="#status">Complaint Status</a>
          <a href="/admin">Admin Panel</a>
        </nav>
      </header>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="hero">
        <div className="small-title">
          AI COMPLAINT RESOLUTION PLATFORM
        </div>

        <h1>Tell us what happened.</h1>

        <h2>We'll help you understand what to do next.</h2>

        <p>
          Submit your complaint and let AIVOA analyse the issue,
          identify its priority, and suggest the next steps.
        </p>

        <div className="ai-badge">
          ✦ AI Powered Smart Complaint Analysis
        </div>
      </section>

      {/* ==================================================
          COMPLAINT FORM
      ================================================== */}

      <main id="complaint" className="complaint-section">

        <div className="section-number">01</div>

        <h2>Complaint information</h2>

        <p className="section-description">
          Provide the details of your complaint below.
        </p>

        <form onSubmit={submitComplaint}>

          {/* Category */}

          <label>Complaint category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Government Services">
              Government Services
            </option>
            <option value="Transport">Transport</option>
            <option value="Public Safety">Public Safety</option>
            <option value="Other">Other</option>
          </select>

          {/* Name + Email */}

          <div className="form-row">

            <div>
              <label>Your name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label>Email address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

          </div>

          {/* Description */}

          <label>Describe your complaint</label>

          <div className="character-count">
            {description.length}/1000
          </div>

          <textarea
            maxLength="1000"
            placeholder="Explain your problem clearly. Include important details such as location, date, people involved, or what you expect to be resolved."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Message */}

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          {/* Analyse */}

          <button
            type="button"
            className="analyse-button"
            onClick={analyseComplaint}
          >
            ✦ Analyse Complaint
          </button>

          {/* Submit */}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Complaint →"}
          </button>

          <p className="privacy">
            🔒 Your information is used only for complaint processing.
          </p>

        </form>

      </main>

      {/* ==================================================
          AI ASSISTANT
      ================================================== */}

      <section className="assistant-section">

        <div className="assistant-icon">✦</div>

        <div className="small-title">AIVOA AI</div>

        <h2>Complaint Assistant</h2>

        <div className="live">LIVE</div>

        {analysis ? (

          <div className="analysis-result">

            <div className="section-number">✓</div>

            <h2>Complaint Analysis</h2>

            <p>
              <strong>Priority:</strong>{" "}
              {analysis.priority}
            </p>

            <p>
              <strong>Summary</strong>
            </p>

            <p>{analysis.summary}</p>

            <p>
              <strong>Recommended action</strong>
            </p>

            <p>{analysis.recommendation}</p>

          </div>

        ) : (

          <div className="ready-message">

            <h2>Ready when you are</h2>

            <p>
              Complete the complaint details and select
              <strong> Analyse Complaint </strong>
              to receive an intelligent preliminary assessment.
            </p>

            <div className="steps">

              <div>
                <span>01</span>
                <p>Describe the issue clearly</p>
              </div>

              <div>
                <span>02</span>
                <p>Let AI review the complaint</p>
              </div>

              <div>
                <span>03</span>
                <p>Get recommended next steps</p>
              </div>

            </div>

          </div>

        )}

      </section>

      {/* ==================================================
          COMPLAINT STATUS
      ================================================== */}

      <section id="status" className="status-section">

        <div className="section-number">02</div>

        <div className="small-title">
          COMPLAINT STATUS
        </div>

        <h2>Track your complaint</h2>

        <p>
          Enter the email address used when submitting your
          complaint to check its current status.
        </p>

        <div className="status-search">

          <input
            type="email"
            placeholder="Enter your email address"
            value={statusEmail}
            onChange={(e) => setStatusEmail(e.target.value)}
          />

          <button
            onClick={checkStatus}
            disabled={statusLoading}
          >
            {statusLoading ? "Checking..." : "Check Status"}
          </button>

        </div>

        {/* Status Results */}

        {statusResult?.notFound && (
          <div className="status-message">
            {statusResult.message}
          </div>
        )}

        {statusResult?.complaints && (

          <div className="status-results">

            {statusResult.complaints.map((complaint) => (

              <div
                className="status-card"
                key={complaint.id}
              >

                <div className="status-card-header">

                  <span>
                    COMPLAINT #{complaint.id}
                  </span>

                  <span
                    className={`status-badge ${complaint.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {complaint.status}
                  </span>

                </div>

                <h3>{complaint.category}</h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {complaint.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {complaint.email}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {complaint.date}
                </p>

                <p>
                  <strong>Complaint:</strong>{" "}
                  {complaint.description}
                </p>

                {/* Status Progress */}

                <div className="status-progress">

                  <div
                    className={
                      complaint.status === "Submitted" ||
                      complaint.status === "Under Review" ||
                      complaint.status === "In Progress" ||
                      complaint.status === "Resolved"
                        ? "active"
                        : ""
                    }
                  >
                    <span>1</span>
                    <small>Submitted</small>
                  </div>

                  <div
                    className={
                      complaint.status === "Under Review" ||
                      complaint.status === "In Progress" ||
                      complaint.status === "Resolved"
                        ? "active"
                        : ""
                    }
                  >
                    <span>2</span>
                    <small>Under Review</small>
                  </div>

                  <div
                    className={
                      complaint.status === "In Progress" ||
                      complaint.status === "Resolved"
                        ? "active"
                        : ""
                    }
                  >
                    <span>3</span>
                    <small>In Progress</small>
                  </div>

                  <div
                    className={
                      complaint.status === "Resolved"
                        ? "active"
                        : ""
                    }
                  >
                    <span>4</span>
                    <small>Resolved</small>
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer>

        <div className="footer-logo">
          AIVOA
        </div>

        <p>
          AI-powered Complaint Resolution
        </p>

        <p className="copyright">
          © 2026 AIVOA. Built to make complaint resolution simpler.
        </p>

      </footer>

    </div>
  );
}


// ======================================================
// ADMIN PANEL
// ======================================================

function Admin() {

  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");

  // ======================================================
  // LOAD COMPLAINTS
  // ======================================================

  const loadComplaints = async () => {

    try {

      const response = await fetch(
        `${API_URL}/complaints`
      );

      if (!response.ok) {
        throw new Error("Failed to load complaints");
      }

      const data = await response.json();

      setComplaints(data);

    } catch (error) {

      console.error(error);

      setMessage(
        "Could not connect to backend."
      );
    }
  };


  useEffect(() => {
    loadComplaints();
  }, []);


  // ======================================================
  // UPDATE STATUS
  // ======================================================

  const updateStatus = async (
    id,
    newStatus
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/complaints/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update status"
        );
      }

      await loadComplaints();

      setMessage(
        "Complaint status updated successfully!"
      );

    } catch (error) {

      console.error(error);

      setMessage(
        "Failed to update complaint."
      );
    }
  };


  // ======================================================
  // DELETE COMPLAINT
  // ======================================================

  const deleteComplaint = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/complaints/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete complaint"
        );
      }

      await loadComplaints();

      setMessage(
        "Complaint deleted successfully!"
      );

    } catch (error) {

      console.error(error);

      setMessage(
        "Failed to delete complaint."
      );
    }
  };


  // ======================================================
  // STATISTICS
  // ======================================================

  const totalComplaints =
    complaints.length;

  const submitted =
    complaints.filter(
      (complaint) =>
        complaint.status === "Submitted"
    ).length;

  const underReview =
    complaints.filter(
      (complaint) =>
        complaint.status === "Under Review"
    ).length;

  const inProgress =
    complaints.filter(
      (complaint) =>
        complaint.status === "In Progress"
    ).length;

  const resolved =
    complaints.filter(
      (complaint) =>
        complaint.status === "Resolved"
    ).length;


  // ======================================================
  // ADMIN PAGE
  // ======================================================

  return (

    <div className="app">

      {/* Header */}

      <header className="header">

        <div className="logo">

          <div className="logo-icon">
            A
          </div>

          <div>
            <h1>AIVOA</h1>
            <span>Admin Dashboard</span>
          </div>

        </div>

        <nav>

          <a href="/">
            Home
          </a>

          <a href="/#complaint">
            Submit Complaint
          </a>

          <a href="/#status">
            Complaint Status
          </a>

        </nav>

      </header>


      {/* Dashboard */}

      <main className="admin-dashboard">

        <div className="section-heading">

          <span className="small-title">
            ADMIN PANEL
          </span>

          <h2>
            Complaint Dashboard
          </h2>

          <p>
            Manage, review and update submitted complaints.
          </p>

        </div>


        {/* Statistics */}

        <div className="admin-stats">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              📋
            </div>

            <h3>
              Total Complaints
            </h3>

            <strong>
              {totalComplaints}
            </strong>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🟡
            </div>

            <h3>
              Submitted
            </h3>

            <strong>
              {submitted}
            </strong>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🔎
            </div>

            <h3>
              Under Review
            </h3>

            <strong>
              {underReview}
            </strong>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🔵
            </div>

            <h3>
              In Progress
            </h3>

            <strong>
              {inProgress}
            </strong>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ✅
            </div>

            <h3>
              Resolved
            </h3>

            <strong>
              {resolved}
            </strong>

          </div>

        </div>


        {/* Message */}

        {message && (

          <div className="message">
            {message}
          </div>

        )}


        {/* Complaints */}

        <section className="admin-complaints">

          <div className="admin-section-title">

            <h2>
              All Complaints
            </h2>

            <span>
              {totalComplaints} complaint
              {totalComplaints !== 1
                ? "s"
                : ""}
            </span>

          </div>


          {complaints.length === 0 ? (

            <div className="empty-status">

              <div>📋</div>

              <h3>
                No complaints available
              </h3>

              <p>
                New complaints will appear here.
              </p>

            </div>

          ) : (

            <div className="admin-complaint-list">

              {complaints.map(
                (complaint) => (

                  <div
                    className="admin-complaint-card"
                    key={complaint.id}
                  >

                    <div className="admin-complaint-top">

                      <div>

                        <span className="complaint-id">
                          Complaint #{complaint.id}
                        </span>

                        <h3>
                          {complaint.category}
                        </h3>

                      </div>

                      <span className="status-badge">
                        {complaint.status}
                      </span>

                    </div>


                    <div className="admin-details">

                      <p>
                        <strong>
                          Name:
                        </strong>{" "}
                        {complaint.name}
                      </p>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {complaint.email}
                      </p>

                      <p>
                        <strong>
                          Date:
                        </strong>{" "}
                        {complaint.date}
                      </p>

                    </div>


                    <div className="admin-description">

                      <strong>
                        Complaint:
                      </strong>

                      <p>
                        {complaint.description}
                      </p>

                    </div>


                    {/* Admin Controls */}

                    <div className="admin-actions">

                      <label>
                        Update Status
                      </label>

                      <select
                        value={
                          complaint.status
                        }
                        onChange={(e) =>
                          updateStatus(
                            complaint.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="Submitted">
                          Submitted
                        </option>

                        <option value="Under Review">
                          Under Review
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>

                      </select>


                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteComplaint(
                            complaint.id
                          )
                        }
                      >
                        Delete Complaint
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>


      {/* Footer */}

      <footer>

        <div className="footer-logo">
          AIVOA
        </div>

        <p>
          AI-powered Complaint Management System
        </p>

        <p className="copyright">
          © 2026 AIVOA. All rights reserved.
        </p>

      </footer>

    </div>
  );
}


// ======================================================
// APP ROUTER
// ======================================================

function App() {

  const path =
    window.location.pathname;

  if (path === "/admin") {
    return <Admin />;
  }

  return <Home />;
}

export default App;