import { Suspense, lazy, useState } from "react"
import { Routes, Route, Link, NavLink } from "react-router-dom"
import { FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import { SiGooglescholar } from "react-icons/si"
import VisitorCounter from "./components/VisitorCounter"
import ThemeToggle from "./components/ThemeToggle"
import ScrollToTop from "./components/ScrollToTop"
import BackToTop from "./components/BackToTop"
import CommandPalette from "./components/CommandPalette"
import './styles/main.scss'

// Code-split route components so the initial bundle stays small
const Home = lazy(() => import("./pages/Home"))
const Contact = lazy(() => import("./pages/Contact"))
const Games = lazy(() => import("./pages/Games"))
const Blog = lazy(() => import("./pages/Blog"))
const BlogPost = lazy(() => import("./pages/BlogPost"))
const News = lazy(() => import("./pages/News"))
const Now = lazy(() => import("./pages/Now"))
const NotFound = lazy(() => import("./pages/NotFound"))

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/blog", label: "Writing" },
  { to: "/now", label: "Now" },
  { to: "/games", label: "Games" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
]

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="app">
      <ScrollToTop />
      <header id="header">
        <div className="site-title">
          <Link to="/">Shawn X. Dong</Link>
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
        <nav id="primary-navigation" className={isMenuOpen ? 'is-open' : ''}>
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {label}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </header>
      <div className="container">
        <aside id="sidebar">
          <div className="profile-card">
            <div className="profile-photo">
              <img
                src="https://scholar.googleusercontent.com/citations?view_op=medium_photo&user=vJbvaGcAAAAJ&citpid=5"
                alt="Shawn X. Dong"
                loading="lazy"
              />
            </div>
            <h2 className="profile-name">Shawn X. Dong</h2>
            <div className="profile-role">Staff Software Engineer</div>
            <div className="profile-location">
              <FaMapMarkerAlt aria-hidden="true" />
              <span>Sunnyvale, CA</span>
            </div>
            <p className="profile-bio">
              I build large-scale distributed systems and the data platforms that
              support them. Currently at Uber, previously at Penn. I care about
              clean abstractions, durable systems, and helping other engineers grow.
            </p>
            <div className="profile-skills">
              <div className="profile-skills-label">Currently working with</div>
              <div className="profile-skills-list">
                {['Go', 'Java', 'TypeScript', 'Kafka', 'Spark'].map(skill => (
                  <span key={skill} className="tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="profile-socials">
              <a
                href="https://www.linkedin.com/in/shawn-x-dong/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com/shawnxd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://scholar.google.com/citations?user=vJbvaGcAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Scholar"
              >
                <SiGooglescholar />
              </a>
              <a
                href="mailto:shawnxd@alumni.upenn.edu"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            </div>
            <VisitorCounter />
          </div>
        </aside>
        <main id="main">
          <Suspense fallback={<div className="loading-state">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:slug" element={<Games />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/news" element={<News />} />
              <Route path="/now" element={<Now />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <footer className="site-footer">
        <div>© {new Date().getFullYear()} Shawn X. Dong. Crafted in Sunnyvale.</div>
        <div className="footer-meta">
          <a href="https://github.com/shawnxd" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/shawn-x-dong/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://scholar.google.com/citations?user=vJbvaGcAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Scholar</a>
        </div>
      </footer>
      <BackToTop />
      <CommandPalette />
    </div>
  )
}

export default App
