import { useState, useEffect } from "react";
import { Gavel, TrendingUp, TrendingDown, Download } from "lucide-react";

interface Adjudicator {
  _id: string;
  name: string;
  rating: number;
  change?: number;
  verdictAccuracy?: number;
  feedbackScore?: number;
}

export default function AdjudicatorLeaderboard() {
  const [rankings, setRankings] = useState<Adjudicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://kroranking.onrender.com';

  useEffect(() => {
    const fetchAdjudicators = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/adjudicators`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch adjudicators");
        }

        const data = await response.json();
        
        // Add simulated changes for demonstration (optional)
        const dataWithChanges = data.map((adj: Adjudicator, index: number) => ({
          ...adj,
          change: [0.15, 0.08, -0.05, 0.20, -0.10, 0.12, -0.08, 0.05][index % 8],
          verdictAccuracy: [0.92, 0.89, 0.85, 0.82, 0.80, 0.78, 0.75, 0.72][index % 8],
          feedbackScore: [9.2, 8.9, 8.5, 8.7, 8.0, 7.9, 7.5, 7.2][index % 8]
        }));
        
        setRankings(dataWithChanges);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } catch (err) {
        console.error("Error fetching adjudicators:", err);
        setError("Failed to load adjudicators. Please try again later.");
        setRankings([]); // Clear any previous data
      } finally {
        setLoading(false);
      }
    };

    fetchAdjudicators();
    const intervalId = setInterval(fetchAdjudicators, 30000);


    return () => clearInterval(intervalId);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Gavel className="icon-yellow" size={28} />
      case 2:
        return <Gavel className="icon-gray" size={28} />
      case 3:
        return <Gavel className="icon-amber" size={28} />
      default:
        return <span className="rank-number">{rank}</span>
    }
  }

  const getChangeDisplay = (change: number | undefined) => {
    if (change === undefined) return null

    if (change > 0) {
      return (
        <div className="flex items-center justify-end gap-1 change-positive">
          <TrendingUp size={16} />
          <span>+{change.toFixed(2)}</span>
        </div>
      )
    } else if (change < 0) {
      return (
        <div className="flex items-center justify-end gap-1 change-negative">
          <TrendingDown size={16} />
          <span>{change.toFixed(2)}</span>
        </div>
      )
    }
    return <span>0</span>
  }

  return (
    <div className="leaderboard-card">
      <div className="card-header">
        <h3 className="card-title">Adjudicator Rankings</h3>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading rankings...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : rankings.length === 0 ? (
        <div className="empty-message">No adjudicators found. Add some in the admin panel!</div>
      ) : (
        <div className="table-container">
          <table className="leaderboard-table">
            <thead>
              <tr className="table-header">
                <th>Rank</th>
                <th>Name</th>
                <th className="text-right">Rating</th>
                <th className="text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((adjudicator, index) => (
                <tr key={adjudicator._id} className={`table-row ${index < 3 ? "top-3" : ""}`}>
                  <td className="rank-cell">{getRankIcon(index + 1)}</td>
                  <td className="name-cell">{adjudicator.name}</td>
                  <td className="rating-cell">{adjudicator.rating.toFixed(1)}</td>
                  <td className="change-cell">{getChangeDisplay(adjudicator.change)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
