import Navbar from "../components/Navbar"

export default function Docs() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#132A13] to-[#31572C]">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
          <h1 className="text-[#FF9E00] mb-6">Documentation</h1>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-[#ECF39E]">Debating Leaderboard System</h2>
            <p className="text-[#ECF39E]/90">
              The Debating Leaderboard is a feature used to dynamically update Individual Ratings post each mock session
              based on their performance & outcome of the room, taking into account the strength of the debate.
            </p>

            <h3 className="text-[#ECF39E]">Rating System</h3>
            <p className="text-[#ECF39E]/90">
              Each Individual gets assigned a Base Score of 1200 at the beginning of the season. After each debate,
              ratings are updated based on:
            </p>
            <ul className="list-disc pl-6 text-[#ECF39E]/90">
              <li>Total Government Bench & Opposition Bench Ratings</li>
              <li>Individual Speaker Scores</li>
              <li>Debate Verdict (Win/Loss)</li>
              <li>Expected Win Probability</li>
            </ul>

            <h3 className="text-[#ECF39E]">Formula</h3>
            <p className="text-[#ECF39E]/90">The rating update formula is:</p>
            <pre className="bg-[#132A13] p-4 rounded-md overflow-x-auto">
              <code className="text-[#FF9E00]">
                updated_rating = rating + K * (result - expwin) + 1.5 * (speaker_score - exp_speaker_score)
              </code>
            </pre>
            <p className="text-[#ECF39E]/90">Where:</p>
            <ul className="list-disc pl-6 text-[#ECF39E]/90">
              <li>K = Volatility Coefficient (set to 20)</li>
              <li>result = 1 for win, 0 for loss</li>
              <li>expwin = Expected Win Probability</li>
              <li>speaker_score = Actual Speaker Score</li>
              <li>exp_speaker_score = Expected Speaker Score based on current rating</li>
            </ul>

            <h3 className="text-[#ECF39E]">Expected Win Probability</h3>
            <p className="text-[#ECF39E]/90">The expected win probability is calculated using:</p>
            <pre className="bg-[#132A13] p-4 rounded-md overflow-x-auto">
              <code className="text-[#FF9E00]">
                gov_expwin = 1 / (1 + 10**((opp_totalrating - gov_totalrating)/400))
              </code>
            </pre>
          </div>
        </div>
      </div>
    </main>
  )
}