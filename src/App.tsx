import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import Games from "./pages/Games"

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/games">Games</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:slug" element={<Games />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App