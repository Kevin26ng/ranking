// will have to figure out the backend yourself
import { useState, useEffect } from "react";
import { Plus, RefreshCw, Edit, Trash2, X, Check } from "lucide-react";
import Alert from "./Alert";

interface Debater {
  _id: string;
  name: string;
  rating: number;
}

interface DebateResult {
  govTeam: string[];
  oppTeam: string[];
  govScores: number[];
  oppScores: number[];
  verdict: "gov" | "opp";
}

interface AlertState {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

// Add this authFetch utility function at the top level
async function authFetch(input: RequestInfo, init?: RequestInit) {
  const token = localStorage.getItem('authToken');
  
  try {
    // First attempt
    let response = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'
    });

    // If token expired (401), try to refresh
    if (response.status === 401) {
      const refreshResponse = await fetch('http://localhost:3000/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (!refreshResponse.ok) {
        throw new Error('Session expired. Please login again.');
      }

      const { token: newToken } = await refreshResponse.json();
      localStorage.setItem('authToken', newToken);

      // Retry with new token
      response = await fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
        },
        credentials: 'include'
      });
    }

    return response;
  } catch (err) {
    console.error('API call failed:', err);
    throw err;
  }
}

export default function AdminPanel() {
  const [debaters, setDebaters] = useState<Debater[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDebater, setNewDebater] = useState({ name: "", rating: 1200 });
  const [activeTab, setActiveTab] = useState<"debaters" | "results">("debaters");
  const [editingDebater, setEditingDebater] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", rating: 0 });
  const [debateResult, setDebateResult] = useState<DebateResult>({
    govTeam: ["", "", ""],
    oppTeam: ["", "", ""],
    govScores: [75, 75, 75],
    oppScores: [75, 75, 75],
    verdict: "gov",
  });
  const [alert, setAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    // Check token validity on mount
    const token = localStorage.getItem('authToken');
    if (!token) {
      showAlert('error', 'Please login first');
    }
    fetchDebaters();
  }, []);

  const fetchDebaters = async () => {
    try {
      setLoading(true);
      const response = await authFetch("http://localhost:3000/debaters");
      
      if (!response.ok) {
        throw new Error("Failed to fetch debaters");
      }

      const data = await response.json();
      setDebaters(data);
    } catch (err) {
      console.error("Error fetching debaters:", err);
      showAlert("error", err.message.includes("token") ? 
        "Session expired. Please login again." : 
        "Failed to load debaters. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: "success" | "error" | "warning" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleAddDebater = async () => {
    if (newDebater.name.trim() === "") {
      showAlert("error", "Debater name cannot be empty");
      return;
    }

    try {
      const response = await authFetch("http://localhost:3000/debaters", {
        method: "POST",
        body: JSON.stringify(newDebater),
      });

      if (!response.ok) {
        throw new Error("Failed to add debater");
      }

      await fetchDebaters();
      setNewDebater({ name: "", rating: 1200 });
      showAlert("success", "Debater added successfully");
    } catch (err) {
      console.error("Error adding debater:", err);
      showAlert("error", err.message.includes("token") ? 
        "Session expired. Please login again." : 
        "Failed to add debater. Please try again."
      );
    }
  };

  const handleUpdateRating = async (id: string, newRating: number) => {
    try {
      const debater = debaters.find((d) => d._id === id);
      if (!debater) return;

      const response = await authFetch(`http://localhost:3000/debaters/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: debater.name, rating: newRating }),
      });

      if (!response.ok) {
        throw new Error("Failed to update debater");
      }

      await fetchDebaters();
      showAlert("success", "Rating updated successfully");
    } catch (err) {
      console.error("Error updating debater:", err);
      showAlert("error", err.message.includes("token") ? 
        "Session expired. Please login again." : 
        "Failed to update rating. Please try again."
      );
    }
  };

  const startEditing = (debater: Debater) => {
    setEditingDebater(debater._id);
    setEditForm({ name: debater.name, rating: debater.rating });
  };

  const cancelEditing = () => {
    setEditingDebater(null);
  };

  const saveEditing = async () => {
    if (!editingDebater) return;
    if (editForm.name.trim() === "") {
      showAlert("error", "Debater name cannot be empty");
      return;
    }

    try {
      const response = await authFetch(`http://localhost:3000/debaters/${editingDebater}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      console.log("Response Status:", response.status);

      const data = await response.json();
       console.log("Response Data:", data);
       
      if (!response.ok) throw new Error(data.error || "Update failed");

      await fetchDebaters();
      setEditingDebater(null);
      showAlert("success", "Debater updated successfully");
    } catch (err) {
      console.error("Update error:", err);
       console.log("Error Details:", {
      message: err.message,
      stack: err.stack
    });


      showAlert("error", err.message.includes("token") ? 
        "Session expired. Please login again." : 
        "Failed to update debater. Please try again."
      );
    }
  };

  const handleDeleteDebater = async (id: string) => {
    if (!confirm("Are you sure you want to delete this debater? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await authFetch(`http://localhost:3000/debaters/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete debater");
      }

      await fetchDebaters();
      showAlert("success", "Debater deleted successfully");
    } catch (err) {
      console.error("Error deleting debater:", err);
      showAlert("error", err.message.includes("token") ? 
        "Session expired. Please login again." : 
        "Failed to delete debater. Please try again."
      );
    }
  };


   const handleDebateResultChange = (field: keyof DebateResult, index: number | null, value: any) => {
    if (index !== null && Array.isArray(debateResult[field])) {
      const newArray = [...(debateResult[field] as any[])]
      newArray[index] = value
      setDebateResult({ ...debateResult, [field]: newArray })
    } else {
      setDebateResult({ ...debateResult, [field]: value })
    }
     }

  const calculateNewRatings = async () => {
     const token = localStorage.getItem("authToken")
    // Validate that all debaters are selected
    const govTeamValid = debateResult.govTeam.every((id) => id !== "")
    const oppTeamValid = debateResult.oppTeam.every((id) => id !== "")

    if (!govTeamValid || !oppTeamValid) {
      showAlert("error", "Please select all debaters for both teams")
      return
    }

       // This is a simplified version of the ELO calculation
    const K = 20 // K-factor as specified in requirements

    // Get the debaters
    const govDebaters = debateResult.govTeam
        .map((id) => debaters.find((d) => d._id === id))
        .filter(Boolean) as Debater[]

    const oppDebaters = debateResult.oppTeam
        .map((id) => debaters.find((d) => d._id === id))
        .filter(Boolean) as Debater[]

    // Calculate team ratings
    const govTotalRating = govDebaters.reduce((sum, d) => sum + d.rating, 0)
    const oppTotalRating = oppDebaters.reduce((sum, d) => sum + d.rating, 0)

     // Calculate expected win probabilities
    const govExpWin = 1 / (1 + Math.pow(10, (oppTotalRating - govTotalRating) / 400))
    const oppExpWin = 1 / (1 + Math.pow(10, (govTotalRating - oppTotalRating) / 400))

    // Calculate result (1 for win, 0 for loss)
    const govResult = debateResult.verdict === "gov" ? 1 : 0
    const oppResult = debateResult.verdict === "opp" ? 1 : 0

    // Update ratings for each debater
    try {
      // Update government team ratings
      for (let i = 0; i < govDebaters.length; i++) {
        const debater = govDebaters[i]
        const expectedSpeakerScore = 75 + Math.floor((debater.rating - 1200) / 100)
        const actualSpeakerScore = debateResult.govScores[i]

           const newRating = Math.round(
            debater.rating + K * (govResult - govExpWin) + 1.5 * (actualSpeakerScore - expectedSpeakerScore),
        )

        await fetch(`http://localhost:3000/debaters/${debater._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ name: debater.name, rating: newRating }),

               })
      }

      // Update opposition team ratings
      for (let i = 0; i < oppDebaters.length; i++) {
        const debater = oppDebaters[i]
        const expectedSpeakerScore = 75 + Math.floor((debater.rating - 1200) / 100)
        const actualSpeakerScore = debateResult.oppScores[i]

           const newRating = Math.round(
            debater.rating + K * (oppResult - oppExpWin) + 1.5 * (actualSpeakerScore - expectedSpeakerScore),
        )

        await fetch(`http://localhost:3000/debaters/${debater._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ name: debater.name, rating: newRating }),
        })
      }

    await fetchDebaters()
      showAlert("success", "Ratings updated successfully")
    } catch (err) {
      console.error("Error updating ratings:", err)
      showAlert("error", "Failed to update ratings. Please try again.")
    }
  }


  return (
      <div className="admin-panel">
        <h2 className="panel-title">Admin Panel</h2>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <div className="tab-navigation">
          <button
              className={`tab-button ${activeTab === "debaters" ? "active" : ""}`}
              onClick={() => setActiveTab("debaters")}
          >
            Manage Debaters
          </button>
          <button
              className={`tab-button ${activeTab === "results" ? "active" : ""}`}
              onClick={() => setActiveTab("results")}
          >
            Enter Results
          </button>
        </div>

        {activeTab === "debaters" ? (
            <div>
              <div className="add-debater-section">
                <h3 className="section-title">Add New Debater</h3>
                <div className="add-debater-form">
                  <div className="form-input-wrapper">
                    <input
                        type="text"
                        placeholder="Debater Name"
                        className="form-input"
                        value={newDebater.name}
                        onChange={(e) => setNewDebater({ ...newDebater, name: e.target.value })}
                    />
                  </div>
                  <div className="rating-input-wrapper">
                    <input
                        type="number"
                        placeholder="Rating"
                        className="form-input"
                        value={newDebater.rating}
                        onChange={(e) => setNewDebater({ ...newDebater, rating: Number.parseInt(e.target.value) || 1200 })}
                    />
                  </div>
                  <button className="add-button" onClick={handleAddDebater}>
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </div>

              {loading ? (
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading debaters...</p>
                  </div>
              ) : debaters.length === 0 ? (
                  <div className="empty-message">No debaters found. Add some using the form above!</div>
              ) : (
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                      <tr className="table-header">
                        <th>Name</th>
                        <th className="text-right">Rating</th>
                        <th className="text-right">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {debaters.map((debater) => (
                          <tr key={debater._id} className="table-row">
                            <td className="name-cell">
                              {editingDebater === debater._id ? (
                                  <input
                                      type="text"
                                      className="edit-input"
                                      value={editForm.name}
                                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  />
                              ) : (
                                  debater.name
                              )}
                            </td>
                            <td className="rating-cell">
                              {editingDebater === debater._id ? (
                                  <input
                                      type="number"
                                      className="rating-edit-input"
                                      value={editForm.rating}
                                      onChange={(e) => setEditForm({ ...editForm, rating: Number.parseInt(e.target.value) || 0 })}
                                  />
                              ) : (
                                  <span className="rating-value">{debater.rating}</span>
                              )}
                            </td>
                            <td className="actions-cell">
                              {editingDebater === debater._id ? (
                                  <div className="action-buttons">
                                    <button className="save-button" onClick={saveEditing} title="Save">
                                      <Check size={16} />
                                    </button>
                                    <button className="cancel-button" onClick={cancelEditing} title="Cancel">
                                      <X size={16} />
                                    </button>
                                  </div>
                              ) : (
                                  <div className="action-buttons">
                                    <button className="edit-button" onClick={() => startEditing(debater)} title="Edit">
                                      <Edit size={16} />
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteDebater(debater._id)}
                                        title="Delete"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                              )}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              )}
            </div>
        ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="team-section">
                  <h3 className="section-title">Government Team</h3>

                  {[0, 1, 2].map((index) => (
                      <div key={`gov-${index}`} className="debater-select-group">
                        <label className="debater-label">Debater {index + 1}</label>
                        <div className="debater-select-container">
                          <select
                              className="debater-select"
                              value={debateResult.govTeam[index]}
                              onChange={(e) => handleDebateResultChange("govTeam", index, e.target.value)}
                          >
                            <option value="">Select Debater</option>
                            {debaters.map((debater) => (
                                <option key={debater._id} value={debater._id}>
                                  {debater.name} ({debater.rating})
                                </option>
                            ))}
                          </select>
                          <input
                              type="number"
                              placeholder="Score"
                              className="score-input"
                              min={60}
                              max={100}
                              value={debateResult.govScores[index]}
                              onChange={(e) =>
                                  handleDebateResultChange("govScores", index, Number.parseInt(e.target.value) || 75)
                              }
                          />
                        </div>
                      </div>
                  ))}
                </div>

                <div className="team-section">
                  <h3 className="section-title">Opposition Team</h3>

                  {[0, 1, 2].map((index) => (
                      <div key={`opp-${index}`} className="debater-select-group">
                        <label className="debater-label">Debater {index + 1}</label>
                        <div className="debater-select-container">
                          <select
                              className="debater-select"
                              value={debateResult.oppTeam[index]}
                              onChange={(e) => handleDebateResultChange("oppTeam", index, e.target.value)}
                          >
                            <option value="">Select Debater</option>
                            {debaters.map((debater) => (
                                <option key={debater._id} value={debater._id}>
                                  {debater.name} ({debater.rating})
                                </option>
                            ))}
                          </select>
                          <input
                              type="number"
                              placeholder="Score"
                              className="score-input"
                              min={60}
                              max={100}
                              value={debateResult.oppScores[index]}
                              onChange={(e) =>
                                  handleDebateResultChange("oppScores", index, Number.parseInt(e.target.value) || 75)
                              }
                          />
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              <div className="verdict-section">
                <h3 className="section-title">Debate Verdict</h3>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                        type="radio"
                        name="verdict"
                        checked={debateResult.verdict === "gov"}
                        onChange={() => handleDebateResultChange("verdict", null, "gov")}
                        className="radio-input"
                    />
                    <span>Government Win</span>
                  </label>
                  <label className="radio-label">
                    <input
                        type="radio"
                        name="verdict"
                        checked={debateResult.verdict === "opp"}
                        onChange={() => handleDebateResultChange("verdict", null, "opp")}
                        className="radio-input"
                    />
                    <span>Opposition Win</span>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="update-button" onClick={calculateNewRatings}>
                  <RefreshCw size={16} />
                  Update Ratings
                </button>
              </div>
            </div>
        )}
      </div>
  )
  }
