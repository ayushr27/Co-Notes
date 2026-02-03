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
      description: 'Notion-style block editor with markdown support, embedded media, code blocks, and beautiful typography.',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <Users size={28} />,
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly with live cursors, presence indicators, and instant sync across all devices.',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <Share2 size={28} />,
      title: 'Community Publishing',
      description: 'Transform your notes into blog posts. Build an audience and share knowledge with the community.',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: <Layers size={28} />,
      title: 'Smart Collections',
      description: 'Organize with nested folders, tags, and smart views. Find anything instantly with powerful search.',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      icon: <Shield size={28} />,
      title: 'Version History',
      description: 'Never lose your work. Git-like version control with full history, diffs, and instant rollback.',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: <Zap size={28} />,
      title: 'Lightning Fast',
      description: 'Built for speed with optimistic updates, offline support, and near-instant page loads.',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
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

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for personal use',
      features: [
        'Unlimited notes',
        '5GB storage',
        'Basic collaboration',
        'Community access',
        'Mobile apps'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      description: 'For power users and creators',
      features: [
        'Everything in Free',
        'Unlimited storage',
        'Version history',
        'Priority support',
        'Custom domains',
        'Advanced analytics'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Team',
      price: '$29',
      period: '/user/month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team workspaces',
        'Admin controls',
        'SSO & SAML',
        'API access',
        'Dedicated support'
      ],
      cta: 'Contact Sales',
      highlighted: false
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
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">📝</span>
            <span className="logo-text">Co-Notes</span>
          </Link>

          <div className="nav-links-desktop">
            <a href="#features" className="nav-link-hover">Features</a>
            <a href="#how-it-works" className="nav-link-hover">How it Works</a>
            <a href="#pricing" className="nav-link-hover">Pricing</a>
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
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
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
          <div className="hero-badge animate-bounce-in">
            <Sparkles size={14} />
            <span>Now with AI-powered writing assistance</span>
          </div>

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
            <a href="#demo" className="btn-hero-secondary hover-lift">
              <Play size={18} />
              <span>Watch Demo</span>
            </a>
          </div>

          <div className="hero-social-proof animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="avatar-stack">
              <div className="stack-avatar hover-pop" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>JD</div>
              <div className="stack-avatar hover-pop" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', animationDelay: '0.1s' }}>SK</div>
              <div className="stack-avatar hover-pop" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)', animationDelay: '0.2s' }}>MR</div>
              <div className="stack-avatar hover-pop" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)', animationDelay: '0.3s' }}>AL</div>
              <div className="stack-avatar more hover-pop" style={{ animationDelay: '0.4s' }}>+2K</div>
            </div>
            <p>Trusted by <strong>2,000+</strong> creators and teams</p>
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
            <div className="preview-collab-cursor" style={{ top: '45%', left: '60%' }}>
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
            <TextReveal>
              <span className="section-tag">Features</span>
            </TextReveal>
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
                <div className="feature-icon-v2" style={{ background: feature.gradient }}>
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
            <TextReveal>
              <span className="section-tag">How It Works</span>
            </TextReveal>
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
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <TextReveal>
              <span className="section-tag">Testimonials</span>
            </TextReveal>
            <TextReveal delay={100}>
              <h2 className="section-title">Loved by <span className="gradient-text">creators worldwide</span></h2>
            </TextReveal>
          </div>

          <div className="testimonials-carousel">
            <div className={`testimonial-card slide-transition`}>
              <div className="quote-mark">"</div>
              <p className="testimonial-quote">{testimonials[activeTestimonial].quote}</p>
              <div className="testimonial-author">
                <div className="author-avatar pulse-soft">{testimonials[activeTestimonial].avatar}</div>
                <div className="author-info">
                  <strong>{testimonials[activeTestimonial].author}</strong>
                  <span>{testimonials[activeTestimonial].role}</span>
                </div>
              </div>
            </div>

            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <TextReveal>
              <span className="section-tag">Pricing</span>
            </TextReveal>
            <TextReveal delay={100}>
              <h2 className="section-title">Simple, <span className="gradient-text">transparent pricing</span></h2>
            </TextReveal>
            <TextReveal delay={200}>
              <p className="section-subtitle">
                Start for free and upgrade when you need more power.
              </p>
            </TextReveal>
          </div>

          <StaggerContainer className="pricing-grid" staggerDelay={150}>
            {pricingPlans.map((plan, index) => (
              <TiltCard
                key={index}
                className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
                intensity={8}
              >
                {plan.highlighted && <div className="popular-badge shimmer">Most Popular</div>}
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                <p className="plan-description">{plan.description}</p>
                <ul className="plan-features">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="feature-check-in" style={{ animationDelay: `${fIndex * 0.1}s` }}>
                      <CheckCircle size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <MagneticButton>
                  <Link
                    to="/signup"
                    className={`btn-pricing ${plan.highlighted ? 'primary' : 'secondary'} ripple-effect`}
                  >
                    {plan.cta}
                  </Link>
                </MagneticButton>
              </TiltCard>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container hover-glow-soft">
          <div className="cta-background">
            <div className="cta-orb orb-1 animate-pulse-slow"></div>
            <div className="cta-orb orb-2 animate-pulse-slow" style={{ animationDelay: '-2s' }}></div>
          </div>
          <div className="cta-content">
            <TextReveal>
              <h2>Ready to transform your workflow?</h2>
            </TextReveal>
            <TextReveal delay={100}>
              <p>Join thousands of creators and teams using Co-Notes to build their second brain.</p>
            </TextReveal>
            <div className="cta-actions animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <MagneticButton>
                <Link to="/signup" className="btn-cta-primary pulse-glow">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
              </MagneticButton>
              <Link to="/community" className="btn-cta-secondary hover-lift">
                Explore Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer-v2">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand-v2">
              <Link to="/" className="footer-logo">
                <span className="logo-icon">📝</span>
                <span className="logo-text">Co-Notes</span>
              </Link>
              <p>Build your second brain with the modern workspace for notes, docs, and collaboration.</p>
              <div className="footer-social">
                <a href="#" className="social-btn hover-pop" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
                <a href="#" className="social-btn hover-pop" aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a href="#" className="social-btn hover-pop" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="social-btn hover-pop" aria-label="Website">
                  <Globe size={18} />
                </a>
              </div>
            </div>

            <div className="footer-links-grid">
              <div className="footer-col">
                <h4>Product</h4>
                <ul>
                  <li><a href="#features" className="link-underline">Features</a></li>
                  <li><Link to="/community" className="link-underline">Community</Link></li>
                  <li><a href="#pricing" className="link-underline">Pricing</a></li>
                  <li><a href="#" className="link-underline">Changelog</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#" className="link-underline">Documentation</a></li>
                  <li><a href="#" className="link-underline">Help Center</a></li>
                  <li><a href="#" className="link-underline">API Reference</a></li>
                  <li><a href="#" className="link-underline">Templates</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li><a href="#" className="link-underline">About</a></li>
                  <li><a href="#" className="link-underline">Careers</a></li>
                  <li><a href="#" className="link-underline">Blog</a></li>
                  <li><a href="#" className="link-underline">Contact</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#" className="link-underline">Privacy</a></li>
                  <li><a href="#" className="link-underline">Terms</a></li>
                  <li><a href="#" className="link-underline">Security</a></li>
                  <li><a href="#" className="link-underline">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom-v2">
            <p>© {new Date().getFullYear()} Co-Notes. All rights reserved.</p>
            <p className="made-with">
              Made with <Heart size={14} className="heart-icon" /> for creators everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
