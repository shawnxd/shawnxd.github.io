import { useState } from "react"
import { Routes, Route, Link } from "react-router-dom"
import { FaLinkedin, FaGithub } from "react-icons/fa"
import { SiGooglescholar } from "react-icons/si"
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
          <div className="profile-photo" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <img 
              src="https://scholar.googleusercontent.com/citations?view_op=medium_photo&user=vJbvaGcAAAAJ&citpid=5" 
              alt="Shawn X. Dong" 
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #e9ecef',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
          </div>
          <h2 className="self-intro">About Me</h2>
          <div className="self-intro" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            <strong>Shawn X. Dong</strong><br/>
            Sunnyvale, California, United States<br/>
            <br/>
            <span>
              Shawn is a seasoned software engineer specializing in large-scale software systems, with experience at Uber and a strong academic background from the University of Pennsylvania. His expertise spans backend, frontend, and data platforms, and he is passionate about building impactful products and mentoring others.<br/><br/>
              <br/>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                <a 
                  href="https://www.linkedin.com/in/shawn-x-dong/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: '1.5rem', 
                    color: '#0077b5',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <FaLinkedin />
                </a>
                <a 
                  href="https://github.com/shawnxd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: '1.5rem', 
                    color: '#333',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <FaGithub />
                </a>
                <a 
                  href="https://scholar.google.com/citations?user=vJbvaGcAAAAJ&hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: '1.5rem', 
                    color: '#4285f4',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <SiGooglescholar />
                </a>
              </div>
            </span>
          </div>
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