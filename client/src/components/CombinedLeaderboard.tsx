
import { useState } from "react"
import LeaderBoard from "./LeaderBoard"
import AdjudicatorLeaderboard from "./AdjudicatorLeaderboard"
import { Users, Gavel } from "lucide-react"

export default function CombinedLeaderboard() {
  const [activeTab, setActiveTab] = useState<"debaters" | "adjudicators">("debaters")

  return (
    <div className="container">
      <div className="text-center mb-8">
        <h2 className="title">Rankings</h2>
        <p className="description">Track and compare performance with our dynamic rating system.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-[rgba(143, 25, 111, 0.05)] backdrop-blur-sm rounded-lg p-1">
          <button
            onClick={() => setActiveTab("debaters")}
            className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all font-semibold ${
              activeTab === "debaters"
                ? "bg-[var(--accent-color)] text-[var(--button-text)] shadow-lg"
                : "text-[var(--text-color)] hover:bg-[rgba(141, 39, 134, 0.1)]"
            }`}
          >
            <Users size={20} />
            <span>Debaters</span>
          </button>
          <button
            onClick={() => setActiveTab("adjudicators")}
            className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all font-semibold ${
              activeTab === "adjudicators"
                ? "bg-[var(--accent-color)] text-[var(--button-text)] shadow-lg"
                : "text-[var(--text-color)] hover:bg-[rgba(255,255,255,0.1)]"
            }`}
          >
            <Gavel size={20} />
            <span>Adjudicators</span>
          </button>
        </div>
      </div>

      {activeTab === "debaters" ? <LeaderBoard /> : <AdjudicatorLeaderboard />}
    </div>
  )
}
