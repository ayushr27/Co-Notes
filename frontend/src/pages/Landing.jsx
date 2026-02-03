import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Globe, Mail } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-page">
      <header className="hero-section">
        <nav className="navbar">
          <div className="logo">Co-Notes</div>
          <div className="nav-links">
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
          </div>
        </nav>

        <div className="hero-content">
          <h1>Your Second Brain, <br /> <span className="highlight">Reimagined.</span></h1>
          <p className="hero-subtitle">
            A unified workspace for notes, tasks, and community knowledge.
            Blending the best of notion-style docs with GitHub-like collaboration.
          </p>
          <div className="cta-group">
            <Link to="/signup" className="btn btn-primary btn-lg">Start for free</Link>
            <a href="#features" className="btn btn-outline btn-lg">Explore Features</a>
          </div>
        </div>
      </header>

      <section id="features" className="features-section">
        <div className="container">
          <h2>Why Co-Notes?</h2>
          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Rich Docs</h3>
              <p>Block-based editor that feels intuitive and powerful. Support for markdown, images, and embedded media.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Community First</h3>
              <p>Publish your notes as blogs and build an audience directly. Share knowledge and discover insights from others.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>Real-time editing and version control for teams. Seamlessly work together on projects and documentation.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">Co-Notes</div>
              <p>Better notes for a better tomorrow. Built for thinkers, creators, and teams who want to build knowledge together.</p>
              <div className="social-links">
                <a href="#" className="social-icon"><Twitter size={20} /></a>
                <a href="#" className="social-icon"><Github size={20} /></a>
                <a href="#" className="social-icon"><Linkedin size={20} /></a>
                <a href="#" className="social-icon"><Globe size={20} /></a>
              </div>
            </div>

            <div className="footer-nav">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/community">Community</Link></li>
                  <li><Link to="/write">Write Article</Link></li>
                  <li><Link to="/search">Search</Link></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Security</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#">Documentation</a></li>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">API Reference</a></li>
                  <li><a href="#">Community Forum</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="copyright">
              © {new Date().getFullYear()} Co-Notes. All rights reserved.
            </div>
            <div className="footer-contact">
              <Mail size={16} /> <span>support@co-notes.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
