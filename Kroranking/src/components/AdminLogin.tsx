import React, { useState } from "react"
import { Lock } from "lucide-react"
import Alert from "./Alert"

interface AdminLoginProps {
  onAuthenticate: (value: boolean) => void
}
const AdminLogin: React.FC<AdminLoginProps> = ({ onAuthenticate }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
         credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      localStorage.setItem("authToken", data.token)
      onAuthenticate(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="icon-container">
          <div className="icon-circle">
            <Lock size={32} className="icon" />
          </div>
        </div>

        <h2 className="login-title">Admin Login</h2>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
