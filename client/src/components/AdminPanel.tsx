import { useState, useEffect } from "react";
import { Plus, RefreshCw, Edit, Trash2, X, Check, Gavel } from "lucide-react";
import Alert from "./Alert";

interface Debater {
  _id: string;
  name: string;
  rating: number;
}

interface Adjudicator {
  _id: string;
  name: string;
  rating: number;
  verdictAccuracy: number;
  feedbackScore: number;
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

const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : 'https://kroranking.onrender.com';

export default function AdminPanel() {
  // Debater states
  const [debaters, setDebaters] = useState<Debater[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDebater, setNewDebater] = useState({ name: "", rating: 69.0 });
  const [editingDebater, setEditingDebater] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", rating: 69.0 });

  // Adjudicator states
  const [adjudicators, setAdjudicators] = useState<Adjudicator[]>([]);
  const [adjudicatorLoading, setAdjudicatorLoading] = useState(true);
  const [newAdjudicator, setNewAdjudicator] = useState({
    name: "",
    rating: 5.0,
    verdictAccuracy: 0.8,
    feedbackScore: 7.5
  });
  const [editingAdjudicator, setEditingAdjudicator] = useState<string | null>(null);
  const [editAdjudicatorForm, setEditAdjudicatorForm] = useState({
    name: "",
    rating: 5.0,
    verdictAccuracy: 0.8,
    feedbackScore: 7.5
  });

  // Common states
  const [activeTab, setActiveTab] = useState<"debaters" | "adjudicators" | "results">("debaters");
  const [debateResult, setDebateResult] = useState<DebateResult>({
    govTeam: ["", "", ""],
    oppTeam: ["", "", ""],
    govScores: [75, 75, 75],
    oppScores: [75, 75, 75],
    verdict: "gov",
  });
  const [alert, setAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    fetchDebaters();
    fetchAdjudicators();
  }, []);

  // Fetch functions
  const fetchDebaters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/debaters`);
      if (!response.ok) throw new Error("Failed to fetch debaters");
      setDebaters(await response.json());
    } catch (err) {
      console.error("Error fetching debaters:", err);
      showAlert("error", "Failed to load debaters. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdjudicators = async () => {
    try {
      setAdjudicatorLoading(true);
      const response = await fetch(`${BACKEND_URL}/adjudicators`);
      if (!response.ok) throw new Error("Failed to fetch adjudicators");
      setAdjudicators(await response.json());
    } catch (err) {
      console.error("Error fetching adjudicators:", err);
      showAlert("error", "Failed to load adjudicators. Please try again later.");
    } finally {
      setAdjudicatorLoading(false);
    }
  };

  const showAlert = (type: AlertState["type"], message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Debater CRUD operations


  const handleAddDebater = async () => {
    if (newDebater.name.trim() === "") {
      showAlert("error", "Debater name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/debaters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDebater),
      });

      if (!response.ok) {
        throw new Error("Failed to add debater");
      }

      await fetchDebaters();
      setNewDebater({ name: "", rating: 69.0});
      showAlert("success", "Debater added successfully");
    } catch (err) {
      console.error("Error adding debater:", err);
      showAlert("error", "Failed to add debater. Please try again.");
    }
  };

  const handleUpdateRating = async (id: string, newRating: number) => {
    try {
      const debater = debaters.find((d) => d._id === id);
      if (!debater) return;

      const response = await fetch(`${BACKEND_URL}/debaters/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: debater.name, rating: newRating }),
      });

      if (!response.ok) {
        throw new Error("Failed to update debater");
      }

      await fetchDebaters();
      showAlert("success", "Rating updated successfully");
    } catch (err) {
      console.error("Error updating debater:", err);
      showAlert("error", "Failed to update rating. Please try again.");
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
      const response = await fetch(`${BACKEND_URL}/debaters/${editingDebater}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Update failed");
      }

      await fetchDebaters();
      setEditingDebater(null);
      showAlert("success", "Debater updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      showAlert("error", "Failed to update debater. Please try again.");
    }
  };

  const handleDeleteDebater = async (id: string) => {
    if (!confirm("Are you sure you want to delete this debater? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/debaters/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete debater");
      }

      await fetchDebaters();
      showAlert("success", "Debater deleted successfully");
    } catch (err) {
      console.error("Error deleting debater:", err);
      showAlert("error", "Failed to delete debater. Please try again.");
    }
  };

  const handleDebateResultChange = (field: keyof DebateResult, index: number | null, value: any) => {
    if (index !== null && Array.isArray(debateResult[field])) {
      const newArray = [...(debateResult[field] as any[])];
      newArray[index] = value;
      setDebateResult({ ...debateResult, [field]: newArray });
    } else {
      setDebateResult({ ...debateResult, [field]: value });
    }
  };

  const calculateNewRatings = async () => {
    const govTeamValid = debateResult.govTeam.every((id) => id !== "");
    const oppTeamValid = debateResult.oppTeam.every((id) => id !== "");

    if (!govTeamValid || !oppTeamValid) {
      showAlert("error", "Please select all debaters for both teams");
      return;
    }

    const K = 5;
    const govDebaters = debateResult.govTeam
      .map((id) => debaters.find((d) => d._id === id))
      .filter(Boolean) as Debater[];
    const oppDebaters = debateResult.oppTeam
      .map((id) => debaters.find((d) => d._id === id))
      .filter(Boolean) as Debater[];

const govAvg = govDebaters.reduce((sum, d) => sum + d.rating, 0) / govDebaters.length;
const oppAvg = oppDebaters.reduce((sum, d) => sum + d.rating, 0) / oppDebaters.length;

    try {
      // Update government team
      for (let i = 0; i < govDebaters.length; i++) {
        const debater = govDebaters[i];
        const expected = 1 / (1 + 10 ** ((oppAvg - debater.rating) / 20));
        const scoreDiff = debateResult.govScores[i] - 75;
        const newRating = parseFloat(
          (debater.rating + K * ((debateResult.verdict === 'gov' ? 1 : 0) - expected) + scoreDiff * 0.3).toFixed(1)
        );

        await fetch(`${BACKEND_URL}/debaters/${debater._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: debater.name, rating: newRating }),
        });
      }

      // Update opposition team
      for (let i = 0; i < oppDebaters.length; i++) {
        const debater = oppDebaters[i];
        const expected = 1 / (1 + 10 ** ((govAvg - debater.rating) / 400));
        const scoreDiff = debateResult.oppScores[i] - 75;
        const newRating = Math.round(
          debater.rating + K * ((debateResult.verdict === 'opp' ? 1 : 0) - expected) + scoreDiff * 0.3
        );

        await fetch(`${BACKEND_URL}/debaters/${debater._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: debater.name, rating: newRating }),
        });
      }

      await fetchDebaters();
      showAlert("success", "Ratings updated successfully");
    } catch (err) {
      console.error("Error updating ratings:", err);
      showAlert("error", "Failed to update ratings. Please try again.");
    }
  }; 




  // Adjudicator CRUD operations
  const handleAddAdjudicator = async () => {
    if (newAdjudicator.name.trim() === "") {
      showAlert("error", "Adjudicator name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/adjudicators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdjudicator),
      });

      if (!response.ok) throw new Error("Failed to add adjudicator");
      
      await fetchAdjudicators();
      setNewAdjudicator({
        name: "",
        rating: 5.0,
        verdictAccuracy: 0.8,
        feedbackScore: 7.5
      });
      showAlert("success", "Adjudicator added successfully");
    } catch (err) {
      console.error("Error adding adjudicator:", err);
      showAlert("error", "Failed to add adjudicator. Please try again.");
    }
  };

  const startAdjudicatorEditing = (adj: Adjudicator) => {
    setEditingAdjudicator(adj._id);
    setEditAdjudicatorForm({
      name: adj.name,
      rating: adj.rating,
      verdictAccuracy: adj.verdictAccuracy,
      feedbackScore: adj.feedbackScore
    });
  };

  const cancelAdjudicatorEditing = () => {
    setEditingAdjudicator(null);
  };

  const saveAdjudicatorEditing = async () => {
    if (!editingAdjudicator) return;
    if (editAdjudicatorForm.name.trim() === "") {
      showAlert("error", "Adjudicator name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/adjudicators/${editingAdjudicator}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAdjudicatorForm),
      });

      if (!response.ok) throw new Error("Update failed");
      
      await fetchAdjudicators();
      setEditingAdjudicator(null);
      showAlert("success", "Adjudicator updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      showAlert("error", "Failed to update adjudicator. Please try again.");
    }
  };

  const handleDeleteAdjudicator = async (id: string) => {
    if (!confirm("Are you sure you want to delete this adjudicator? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/adjudicators/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete adjudicator");
      
      await fetchAdjudicators();
      showAlert("success", "Adjudicator deleted successfully");
    } catch (err) {
      console.error("Error deleting adjudicator:", err);
      showAlert("error", "Failed to delete adjudicator. Please try again.");
    }
  };


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
          className={`tab-button ${activeTab === "adjudicators" ? "active" : ""}`}
          onClick={() => setActiveTab("adjudicators")}
        >
          <Gavel size={16} className="inline mr-1" />
          Manage Adjudicators
        </button>
        <button
          className={`tab-button ${activeTab === "results" ? "active" : ""}`}
          onClick={() => setActiveTab("results")}
        >
          Enter Results
        </button>
      </div>

      {activeTab === "debaters" ? (
        // Your existing debaters UI remains exactly the same
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
                  onChange={(e) => setNewDebater({ ...newDebater, rating: parseInt(e.target.value) || 69.0 })}
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
                            onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) || 69.0 })}
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
      ) : activeTab === "adjudicators" ? (
        <div>
          <div className="add-debater-section">
            <h3 className="section-title">Add New Adjudicator</h3>
            <div className="add-debater-form">
              <div className="form-input-wrapper">
                <input
                  type="text"
                  placeholder="Adjudicator Name"
                  className="form-input"
                  value={newAdjudicator.name}
                  onChange={(e) => setNewAdjudicator({ ...newAdjudicator, name: e.target.value })}
                />
              </div>
              <div className="rating-input-wrapper">
                <input
                  type="number"
                  placeholder="Rating (1-10)"
                  className="form-input"
                  min="1"
                  max="10"
                  step="0.1"
                  value={newAdjudicator.rating}
                  onChange={(e) => setNewAdjudicator({ ...newAdjudicator, rating: parseFloat(e.target.value) || 5.0 })}
                />
              </div>
              <button className="add-button" onClick={handleAddAdjudicator}>
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>

          {adjudicatorLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading adjudicators...</p>
            </div>
          ) : adjudicators.length === 0 ? (
            <div className="empty-message">No adjudicators found. Add some using the form above!</div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr className="table-header">
                    <th>Name</th>
                    <th className="text-right">Rating</th>
                    <th className="text-right">Accuracy</th>
                    <th className="text-right">Feedback</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adjudicators.map((adj) => (
                    <tr key={adj._id} className="table-row">
                      <td className="name-cell">
                        {editingAdjudicator === adj._id ? (
                          <input
                            type="text"
                            className="edit-input"
                            value={editAdjudicatorForm.name}
                            onChange={(e) => setEditAdjudicatorForm({ ...editAdjudicatorForm, name: e.target.value })}
                          />
                        ) : (
                          adj.name
                        )}
                      </td>
                      <td className="rating-cell">
                        {editingAdjudicator === adj._id ? (
                          <input
                            type="number"
                            className="rating-edit-input"
                            min="1"
                            max="10"
                            step="0.1"
                            value={editAdjudicatorForm.rating}
                            onChange={(e) => setEditAdjudicatorForm({ ...editAdjudicatorForm, rating: parseFloat(e.target.value) || 5.0 })}
                          />
                        ) : (
                          <span className="rating-value">{adj.rating.toFixed(1)}</span>
                        )}
                      </td>
                      <td className="rating-cell">
                        {editingAdjudicator === adj._id ? (
                          <input
                            type="number"
                            className="rating-edit-input"
                            min="0"
                            max="1"
                            step="0.01"
                            value={editAdjudicatorForm.verdictAccuracy}
                            onChange={(e) => setEditAdjudicatorForm({ ...editAdjudicatorForm, verdictAccuracy: parseFloat(e.target.value) || 0.8 })}
                          />
                        ) : (
                          <span className="rating-value">{(adj.verdictAccuracy * 100).toFixed(1)}%</span>
                        )}
                      </td>
                      <td className="rating-cell">
                        {editingAdjudicator === adj._id ? (
                          <input
                            type="number"
                            className="rating-edit-input"
                            min="1"
                            max="10"
                            step="0.1"
                            value={editAdjudicatorForm.feedbackScore}
                            onChange={(e) => setEditAdjudicatorForm({ ...editAdjudicatorForm, feedbackScore: parseFloat(e.target.value) || 7.5 })}
                          />
                        ) : (
                          <span className="rating-value">{adj.feedbackScore.toFixed(1)}</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        {editingAdjudicator === adj._id ? (
                          <div className="action-buttons">
                            <button className="save-button" onClick={saveAdjudicatorEditing} title="Save">
                              <Check size={16} />
                            </button>
                            <button className="cancel-button" onClick={cancelAdjudicatorEditing} title="Cancel">
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button className="edit-button" onClick={() => startAdjudicatorEditing(adj)} title="Edit">
                              <Edit size={16} />
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteAdjudicator(adj._id)}
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
        // Your existing results UI remains exactly the same
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
  );
}