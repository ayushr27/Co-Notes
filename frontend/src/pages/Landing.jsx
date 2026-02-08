import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Github, Twitter, Linkedin, Globe, Mail, Menu, X,
  FileText, Users, Zap, Shield, Star, Clock,
  CheckCircle, ArrowRight, Play, Sparkles,
  BookOpen, Layers, Share2, TrendingUp, Heart
} from 'lucide-react';

// Custom hook for scroll animations
const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};

// Custom hook for parallax effect
const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        setOffset(scrolled * speed);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [ref, offset];
};

// 3D Tilt Card Component
const TiltCard = ({ children, className, intensity = 15 }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -intensity;
    const rotateY = (x - centerX) / centerX * intensity;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.1s ease-out' }}
    >
      <div
        className="tilt-card-glare"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
        }}
      />
      {children}
    </div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [ref, isVisible] = useScrollAnimation(0.5);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isVisible, end, duration, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={buttonRef}
      className="magnetic-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={className}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

// Text Reveal Animation Component
const TextReveal = ({ children, delay = 0 }) => {
  const [ref, isVisible] = useScrollAnimation(0.3);

  return (
    <div
      ref={ref}
      className={`text-reveal ${isVisible ? 'revealed' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-reveal-inner">
        {children}
      </div>
    </div>
  );
};

// Stagger Children Animation
const StaggerContainer = ({ children, className, staggerDelay = 100 }) => {
  const [ref, isVisible] = useScrollAnimation(0.2);

  return (
    <div ref={ref} className={`stagger-container ${className || ''}`}>
      {React.Children.map(children, (child, index) => (
        <div
          className={`stagger-item ${isVisible ? 'visible' : ''}`}
          style={{ transitionDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax refs
  const [heroParallaxRef, heroOffset] = useParallax(0.3);
  const [orbParallaxRef, orbOffset] = useParallax(0.15);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse for cursor glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FileText size={28} />,
      title: 'Rich Block Editor',
      description: 'Notion-style block editor with markdown support, embedded media, code blocks, and beautiful typography.'
    },
    {
      icon: <Users size={28} />,
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly with live cursors, presence indicators, and instant sync across all devices.'
    },
    {
      icon: <Share2 size={28} />,
      title: 'Community Publishing',
      description: 'Transform your notes into blog posts. Build an audience and share knowledge with the community.'
    },
    {
      icon: <Layers size={28} />,
      title: 'Smart Collections',
      description: 'Organize with nested folders, tags, and smart views. Find anything instantly with powerful search.'
    },
    {
      icon: <Shield size={28} />,
      title: 'Version History',
      description: 'Never lose your work. Git-like version control with full history, diffs, and instant rollback.'
    },
    {
      icon: <Zap size={28} />,
      title: 'Lightning Fast',
      description: 'Built for speed with optimistic updates, offline support, and near-instant page loads.'
    }
  ];

  const stats = [
    { value: 50, suffix: 'K+', label: 'Active Users', icon: <Users size={20} /> },
    { value: 2, suffix: 'M+', label: 'Notes Created', icon: <FileText size={20} /> },
    { value: 99.9, suffix: '%', label: 'Uptime', icon: <Zap size={20} /> },
    { value: 4.9, suffix: '/5', label: 'User Rating', icon: <Star size={20} /> }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Workspace',
      description: 'Sign up in seconds and set up your personal or team workspace with custom branding.',
      icon: <Sparkles size={24} />
    },
    {
      number: '02',
      title: 'Write & Organize',
      description: 'Use our powerful block editor to create beautiful documents, notes, and knowledge bases.',
      icon: <BookOpen size={24} />
    },
    {
      number: '03',
      title: 'Collaborate & Share',
      description: 'Invite teammates, share publicly, or publish to the community feed to grow your audience.',
      icon: <Share2 size={24} />
    }
  ];

  const testimonials = [
    {
      quote: "Co-Notes has completely transformed how our team documents and shares knowledge. The real-time collaboration is seamless!",
      author: "Sarah Chen",
      role: "Product Lead at TechCorp",
      avatar: "SC"
    },
    {
      quote: "Finally, a note-taking app that understands developers. The code blocks, version history, and markdown support are perfect.",
      author: "Mike Rodriguez",
      role: "Senior Engineer at StartupXYZ",
      avatar: "MR"
    },
    {
      quote: "I've tried Notion, Obsidian, and many others. Co-Notes gives me the best of all worlds with its community features.",
      author: "Emily Johnson",
      role: "Content Creator",
      avatar: "EJ"
    }
  ];

  return (
    <div className="landing-page-v2">
      {/* Cursor Glow Effect */}
      <div
        className="cursor-glow"
        style={{
          left: mousePosition.x,
          top: mousePosition.y
        }}
      />

      {/* Navigation */}
      <nav className={`landing-nav ${isMenuOpen ? 'menu-open' : ''} ${isScrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">📝</span>
            <span className="logo-text">Co-Notes</span>
          </Link>

          <div className="nav-links-desktop">
            <a href="#features" className="nav-link-hover">Features</a>
            <a href="#how-it-works" className="nav-link-hover">How it Works</a>
            <Link to="/community" className="nav-link-hover">Community</Link>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="nav-link-login">Log in</Link>
            <MagneticButton>
              <Link to="/signup" className="btn-nav-primary">
                Get Started Free
                <ArrowRight size={16} />
              </Link>
            </MagneticButton>
          </div>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} role="dialog" aria-label="Mobile menu">
          <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it Works</a>
          <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
          <Link to="/community" onClick={() => setIsMenuOpen(false)}>Community</Link>
          <div className="mobile-menu-actions">
            <Link to="/login" className="btn-mobile-secondary">Log in</Link>
            <Link to="/signup" className="btn-mobile-primary">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-v2" ref={heroParallaxRef}>
        <div className="hero-background" ref={orbParallaxRef}>
          <div
            className="gradient-orb orb-1"
            style={{ transform: `translate(${orbOffset * 0.5}px, ${orbOffset * 0.3}px)` }}
          />
          <div
            className="gradient-orb orb-2"
            style={{ transform: `translate(${-orbOffset * 0.3}px, ${orbOffset * 0.2}px)` }}
          />
          <div
            className="gradient-orb orb-3"
            style={{ transform: `translate(${orbOffset * 0.2}px, ${-orbOffset * 0.4}px)` }}
          />
          <div className="grid-pattern"></div>
        </div>

        <div
          className="hero-content-v2"
          style={{ transform: `translateY(${heroOffset * 0.5}px)` }}
        >

          <h1 className="hero-title">
            <TextReveal>Your Ideas Deserve</TextReveal>
            <TextReveal delay={150}>
              <span className="gradient-text"> a Better Home</span>
            </TextReveal>
          </h1>

          <p className="hero-description animate-fade-up" style={{ animationDelay: '0.3s' }}>
            The modern workspace for notes, docs, and wikis. Collaborate in real-time,
            publish to the community, and build your knowledge base with powerful tools.
          </p>

          <div className="hero-cta-group animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <MagneticButton>
              <Link to="/signup" className="btn-hero-primary pulse-glow">
                <span>Start for Free</span>
                <ArrowRight size={18} />
              </Link>
            </MagneticButton>
          </div>

          <div className="hero-social-proof animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="avatar-stack">
              <div className="stack-avatar hover-pop">JD</div>
              <div className="stack-avatar hover-pop" style={{ animationDelay: '0.1s' }}>SK</div>
              <div className="stack-avatar hover-pop" style={{ animationDelay: '0.2s' }}>MR</div>
              <div className="stack-avatar hover-pop" style={{ animationDelay: '0.3s' }}>AL</div>
              <div className="stack-avatar more hover-pop" style={{ animationDelay: '0.4s' }}>+2K</div>
            </div>
          </div>
        </div>

        {/* Floating UI Preview */}
        <div className="hero-preview animate-float-up">
          <div className="preview-window hover-glow">
            <div className="preview-header">
              <div className="window-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="window-title">My Workspace</div>
            </div>
            <div className="preview-content">
              <div className="preview-sidebar">
                <div className="sidebar-item-preview active">📄 Getting Started</div>
                <div className="sidebar-item-preview">📁 Projects</div>
                <div className="sidebar-item-preview">✨ Ideas</div>
                <div className="sidebar-item-preview">📚 Resources</div>
              </div>
              <div className="preview-editor">
                <h2 className="typewriter">Welcome to Co-Notes 👋</h2>
                <p>Start writing your thoughts here...</p>
                <div className="preview-block code">
                  <code>const ideas = await brain.think();</code>
                </div>
                <div className="preview-block callout">
                  💡 Pro tip: Use "/" to access quick commands
                </div>
              </div>
            </div>
            <div className="preview-collab-cursor">
              <div className="cursor-pointer"></div>
              <span className="cursor-label">Sarah</span>
            </div>
          </div>
          <div className="floating-card card-1 hover-float">
            <CheckCircle size={16} className="text-success" />
            <span>Auto-saved</span>
          </div>
          <div className="floating-card card-2 hover-float">
            <Users size={16} />
            <span>3 online</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <StaggerContainer className="stats-container" staggerDelay={150}>
          {stats.map((stat, index) => (
            <div key={index} className="stat-item hover-scale">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </StaggerContainer>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section-v2">
        <div className="section-container">
          <div className="section-header">
            <TextReveal delay={100}>
              <h2 className="section-title">Everything you need to <span className="gradient-text">capture ideas</span></h2>
            </TextReveal>
            <TextReveal delay={200}>
              <p className="section-subtitle">
                Powerful tools designed to help you write, organize, and share your best thinking.
              </p>
            </TextReveal>
          </div>

          <StaggerContainer className="features-grid" staggerDelay={100}>
            {features.map((feature, index) => (
              <TiltCard key={index} className="feature-card-v2">
                <div className="feature-icon-v2">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <a href="#" className="feature-link hover-arrow">
                  Learn more <ArrowRight size={14} />
                </a>
              </TiltCard>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <TextReveal delay={100}>
              <h2 className="section-title">Get started in <span className="gradient-text">3 simple steps</span></h2>
            </TextReveal>
            <TextReveal delay={200}>
              <p className="section-subtitle">
                From signup to sharing, we've made everything simple and intuitive.
              </p>
            </TextReveal>
          </div>

          <StaggerContainer className="steps-container" staggerDelay={200}>
            {steps.map((step, index) => (
              <div key={index} className="step-card hover-lift">
                <div className="step-number">{step.number}</div>
                <div className="step-icon pulse-ring">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < steps.length - 1 && <div className="step-connector animate-dash"></div>}
              </div>
            ))}
          </StaggerContainer>
        </div>
        <div className="hero-cta-group animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <MagneticButton>
            <Link to="/signup" className="btn-hero-primary pulse-glow">
              <span>Get Started</span>
              <ArrowRight size={18} />
            </Link>
          </MagneticButton>
        </div>
      </section>
    </div>
  );
};

export default Landing;
