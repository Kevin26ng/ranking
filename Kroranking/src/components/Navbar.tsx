import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Award } from "lucide-react"
import React from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? "glass-card" : ""}`}>
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <span className="flex items-center gap-2">
              <Award size={24} />
              KroRanking
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/docs" className="nav-link">
              Docs
            </Link>
            <Link to="/blog" className="nav-link">
              Blog
            </Link>
            <Link to="/admin" className="admin-button">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-button"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-nav">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/docs" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Docs
              </Link>
              <Link to="/blog" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Blog
              </Link>
              <Link
                to="/admin"
                className="mobile-admin-button"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
