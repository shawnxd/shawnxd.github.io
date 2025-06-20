import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import Blog from "./pages/Blog"
import Projects from "./pages/Projects"
import Contact from "./pages/Contact"
import Publications from "./pages/Publications"
import Talks from "./pages/Talks"
import Teaching from "./pages/Teaching"
import BlogPost from "./pages/BlogPost"
import Publication from "./pages/Publication"
import Talk from "./pages/Talk"
import TeachingPage from "./pages/TeachingPage"

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/publications">Publications</Link>
        <Link to="/talks">Talks</Link>
        <Link to="/teaching">Teaching</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/publications/:slug" element={<Publication />} />
        <Route path="/talks" element={<Talks />} />
        <Route path="/talks/:slug" element={<Talk />} />
        <Route path="/teaching" element={<Teaching />} />
        <Route path="/teaching/:slug" element={<TeachingPage />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App