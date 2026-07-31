import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://aivoa-complaint-system-29dn.onrender.com";

function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");

  // Load complaints from backend
  const loadComplaints = async () => {
    try {
      const response = await fetch(`${API_URL}/complaints`);

      if (!response.ok) {
        throw new Error("Failed to load complaints");
      }

      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend.");
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // Update complaint status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/complaints/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await loadComplaints();
      setMessage("Complaint status updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update complaint.");
    }
  };

  // Delete complaint
  const deleteComplaint = async (id) => {
    try {
      const response = await fetch(`${API_URL}/complaints/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete complaint");
      }

      await loadComplaints();
      setMessage("Complaint deleted successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete complaint.");
    }
  };

  const totalComplaints = complaints.length;

  const submitted = complaints.filter(
    (complaint) => complaint.status === "Submitted"
  ).length;

  const resolved = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">A</div>

          <div>
            <h1>AIVOA</h1>
            <span>Admin Dashboard</span>
          </div>
        </div>

        <nav>
          <a href="/">Home</a>
          <a href="/#complaint">Submit Complaint</a>
          <a href="/#status">Complaint Status</a>
        </nav>
      </header>

      {/* Dashboard */}
      <main className="admin-dashboard">

        <div className="section-heading">
          <span className="small-title">ADMIN PANEL</span>

          <h2>Complaint Dashboard</h2>

          <p>
            Manage, review and update submitted complaints.
          </p>
        </div>

        {/* Statistics */}
        <div className="admin-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-icon">📋</div>
            <h3>Total Complaints</h3>
            <strong>{totalComplaints}</strong>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">🟡</div>
            <h3>Submitted</h3>
            <strong>{submitted}</strong>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">✅</div>
            <h3>Resolved</h3>
            <strong>{resolved}</strong>
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
            <h2>All Complaints</h2>

            <span>
              {totalComplaints} complaint
              {totalComplaints !== 1 ? "s" : ""}
            </span>
          </div>

          {complaints.length === 0 ? (

            <div className="empty-status">
              <div>📋</div>

              <h3>No complaints available</h3>

              <p>
                New complaints will appear here.
              </p>
            </div>

          ) : (

            <div className="admin-complaint-list">

              {complaints.map((complaint) => (

                <div
                  className="admin-complaint-card"
                  key={complaint.id}
                >

                  <div className="admin-complaint-top">

                    <div>
                      <span className="complaint-id">
                        Complaint #{complaint.id}
                      </span>

                      <h3>{complaint.category}</h3>
                    </div>

                    <span className="status-badge">
                      {complaint.status}
                    </span>

                  </div>

                  <div className="admin-details">

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

                  </div>

                  <div className="admin-description">

                    <strong>Complaint:</strong>

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
                      value={complaint.status}
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
                        deleteComplaint(complaint.id)
                      }
                    >
                      Delete Complaint
                    </button>

                  </div>

                </div>

              ))}

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

export default Admin;
