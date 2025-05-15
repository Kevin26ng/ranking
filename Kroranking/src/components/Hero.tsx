import { useState, useEffect } from "react"
import { Crown, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom" // Assuming you're using React Router

interface TopDebater {
  _id: string
  name: string
  rating: number
}

export default function Hero() {
  const [topDebater, setTopDebater] = useState<TopDebater | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopDebater = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3000/debaters") 

        if (!response.ok) {
          throw new Error("Failed to fetch debaters")
        }

        const data = await response.json()
        if (data.length > 0) {
          setTopDebater(data[0])
        }
      } catch (err) {
        console.error("Error fetching top debater:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopDebater()
  }, [])

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Debating <span>Leaderboard</span>
            </h1>
            <p className="hero-description">
              Track and compare debating performance with our dynamic rating system. See who rises to the top based on
              performance, outcomes, and the strength of debates.
            </p>
            <div className="button-container">
              <Link to="/leaderboard">
                <button className="primary-button">
                  View Rankings <ChevronRight size={16} />
                </button>
              </Link>
              <Link to="/docs">
                <button className="secondary-button">Learn More</button>
              </Link>
            </div>
          </div>
          <div className="hero-card">
            <div className="card-wrapper">
              <div className="card-inner">
                <h3 className="card-title">Top Debater</h3>
                <div className="badge-container">
                  <div className="badge">
                    <Crown size={32} />
                  </div>
                </div>
                {loading ? (
                  <p className="loading-text">Loading...</p>
                ) : topDebater ? (
                  <>
                    <p className="debater-name">{topDebater.name}</p>
                    <p className="debater-rating">Rating: {topDebater.rating}</p>
                  </>
                ) : (
                  <p className="loading-text">No debaters found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
