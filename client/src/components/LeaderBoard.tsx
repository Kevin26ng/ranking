import { useState, useEffect } from "react";
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Download } from "lucide-react";

interface Debater {
  _id: string;
  name: string;
  rating: number;
  change?: number;
}

export default function LeaderBoard() {
  const [rankings, setRankings] = useState<Debater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const fetchDebaters = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/debaters");
        
        if (!response.ok) {
          throw new Error("Failed to fetch debaters");
        }

        const data = await response.json();
        
        // Add simulated changes for demonstration
        const dataWithChanges = data.map((debater: Debater, index: number) => ({
          ...debater,
          change: [15, 8, 5, 20, 10, 12][index % 6] // Sample changes
        }));
        
        setRankings(dataWithChanges);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } catch (err) {
        console.error("Error fetching debaters:", err);
        setError("Failed to load debaters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDebaters();
    const intervalId = setInterval(fetchDebaters, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const getRankIcon = (rank: number) => {
    const icons = ['🍀', '🍁', '🍂', '🌤', '🌦', '🌧'];
    return icons[rank - 1] || '🌟';
  };

  const getChangeDisplay = (change: number | undefined) => {
    if (change === undefined) return null;
    return <span className={`change-${change >= 0 ? 'positive' : 'negative'}`}>🟠{change}</span>;
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch("http://localhost:3000/debaters/export");
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "debater-rankings.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export data. Please try again.");
    }
  };

  return (
    <section className="leaderboard-section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="title">Top Debaters</h2>
          <p className="description">
            Our leaderboard showcases the top performers based on their debate outcomes, 
            speaker scores, and the strength of their competitions.
          </p>
        </div>

        <div className="leaderboard-card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h3 className="card-title">CURRENT RANKINGS</h3>
              <div className="flex items-center gap-4">
                {lastUpdated && (
                  <span className="text-sm text-gray-500">
                    Last updated: {lastUpdated}
                  </span>
                )}
                <button 
                  onClick={handleExportCSV}
                  className="export-button"
                  disabled={loading || rankings.length === 0}
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading rankings...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : rankings.length === 0 ? (
            <div className="empty-message">No debaters found</div>
          ) : (
            <div className="table-container">
              <table className="leaderboard-table">
                <thead>
                  <tr className="table-header">
                    <th>RANK</th>
                    <th>NAME</th>
                    <th>RATING</th>
                    <th>CHANGE</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((debater, index) => (
                    <tr key={debater._id} className="table-row">
                      <td className="rank-cell">
                        <span className="rank-icon">{getRankIcon(index + 1)}</span>
                      </td>
                      <td className="name-cell">{debater.name}</td>
                      <td className="rating-cell">{debater.rating}</td>
                      <td className="change-cell">
                        {getChangeDisplay(debater.change)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}