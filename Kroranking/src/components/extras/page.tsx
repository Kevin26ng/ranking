import Hero from "../components/Hero"
import LeaderBoard from "../components/LeaderBoard"
import Navbar from "../components/Navbar"

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0f2910] to-[#1a3a1a]">
            <Navbar />
            <Hero />
            <LeaderBoard />
            <footer className="py-8 text-center text-sm text-[#ecf39e] opacity-80">
                <div className="container">
                    <p>© {new Date().getFullYear()} KroRanking. All rights reserved.</p>
                </div>
            </footer>
        </main>
    )
}
