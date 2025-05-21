import Navbar from "../components/Navbar"

export default function Blog() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#132A13] to-[#31572C]">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
          <h1 className="text-[#FF9E00] mb-6">Blog</h1>

          <div className="space-y-12">
            <article className="border-b border-[#4F772D] pb-8">
              <h2 className="text-[#ECF39E] mb-2">Understanding the Debating Rating System</h2>
              <p className="text-sm text-[#ECF39E]/70 mb-4">Published on May 6, 2023</p>
              <p className="text-[#ECF39E]/90 mb-4">
                Our rating system is designed to accurately reflect debating skill and performance over time. Learn how
                the ELO-based system works and how you can improve your rating.
              </p>
              <a href="#" className="text-[#FF9E00] hover:underline">
                Read more →
              </a>
            </article>

            <article className="border-b border-[#4F772D] pb-8">
              <h2 className="text-[#ECF39E] mb-2">Tips for Improving Your Speaker Score</h2>
              <p className="text-sm text-[#ECF39E]/70 mb-4">Published on April 15, 2023</p>
              <p className="text-[#ECF39E]/90 mb-4">
                Speaker scores are a crucial component of your overall rating. This article provides practical advice
                for improving your delivery, structure, and argumentation.
              </p>
              <a href="#" className="text-[#FF9E00] hover:underline">
                Read more →
              </a>
            </article>

            <article>
              <h2 className="text-[#ECF39E] mb-2">The History of Competitive Debating</h2>
              <p className="text-sm text-[#ECF39E]/70 mb-4">Published on March 22, 2023</p>
              <p className="text-[#ECF39E]/90 mb-4">
                Explore the rich history of competitive debating, from ancient Greece to modern international
                competitions. Learn how debate formats have evolved over time.
              </p>
              <a href="#" className="text-[#FF9E00] hover:underline">
                Read more →
              </a>
            </article>
          </div>
        </div>
      </div>
    </main>
  )
}