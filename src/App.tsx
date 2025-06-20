import { useState } from "react"
import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import Games from "./pages/Games"
import Blog from "./pages/Blog"
import BlogPost from "./pages/BlogPost"
import './styles/main.scss'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div>
      <header id="header">
        <div className="site-title">
          <Link to="/">Home</Link>
        </div>
        <button 
          className="mobile-nav-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Menu</span>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <nav className={isMenuOpen ? 'is-open' : ''}>
          <Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
          <Link to="/games" onClick={() => setIsMenuOpen(false)}>Games</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </nav>
      </header>
      <div className="container">
        <aside id="sidebar">
          <h2>Recently Updated</h2>
          {/* Add recent updates here */}
        </aside>
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:slug" element={<Games />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App