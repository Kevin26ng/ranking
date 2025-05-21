import { useState } from "react"
import AdminLogin from "../components/AdminLogin"
import AdminPanel from "../components/AdminPanel"
import Navbar from "../components/Navbar"


export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(()=>{
 return !!localStorage.getItem("authToken")})


  return (
    <main className="min-h-screen bg-gradient-to-br from-[#132A13] to-[#31572C]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {!isAuthenticated ? (<AdminLogin onAuthenticate={setIsAuthenticated} />) :( <AdminPanel />)}
      </div>
    </main>
  )
}