import { useState, useEffect, useRef, createContext, useContext } from "react";

const ThemeContext = createContext();

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

const SKILLS = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 88 },
  { name: "Express", level: 82 },
  { name: "MongoDB", level: 80 },
  { name: "PostgreSQL", level: 78 },
];

const NAV_LINKS = ["about", "skills", "projects", "contact"];

// ── ADD MORE PROJECTS HERE IN THE FUTURE ──────────────────────────────────────
const PROJECTS = [
  {
    title: "AI Resume Analyzer",
    desc: "Full stack AI SaaS app that analyzes your resume against a job description, returns a match score, skill gaps, keyword analysis, and an AI-rewritten summary powered by LLaMA 3.3.",
    tech: ["Next.js", "Groq API", "LLaMA 3.3", "Tailwind CSS", "Vercel"],
    live: "https://my-resume-ai-rishicodes-7s-projects.vercel.app",
    github: "https://github.com/rishicodes-7/my-resume-ai",
    image: "/resume-ai.png",
    badge: "LIVE",
  },

{
    title: "SnapLink",
    desc: "A full stack URL shortener with click analytics. Paste any long URL, get a short link instantly, and track clicks over time with a bar chart dashboard.",
    tech: ["Next.js", "Supabase", "Recharts", "Vercel"],
    live: "https://snaplink-wine.vercel.app/",
    github: "https://github.com/rishicodes-7/snaplink",
    image: "/snaplink.png",
    badge: "LIVE",
  },

  // ── PROJECT 3 — uncomment and fill in when ready ──
  // {
  //   title: "Your Next Project",
  //   desc: "Description of your project goes here.",
  //   tech: ["React", "Node.js"],
  //   live: "#",
  //   github: "https://github.com/rishicodes-7",
  //   image: null,
  //   badge: null,
  // },
];
// ─────────────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length)
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    else if (!deleting && charIdx === current.length)
      timeout = setTimeout(() => setDeleting(true), pause);
    else if (deleting && charIdx > 0)
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    else if (deleting && charIdx === 0) {
      timeout = setTimeout(() => { setDeleting(false); setWordIdx(i => (i + 1) % words.length); }, 50);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return display;
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ scrolled }) {
  const width = useWindowSize();
  const isMobile = width <= 768;
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrolled || menuOpen ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(138,43,226,0.15)" : "none",
        transition: "all 0.4s ease",
        boxSizing: "border-box", width: "100%",
      }}>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: "1rem", fontWeight: 700,
          color: "var(--text-primary)", letterSpacing: "0.05em", cursor: "pointer", flexShrink: 0,
        }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span style={{ color: "var(--accent)" }}>{"<"}</span>RishiCodes<span style={{ color: "var(--accent)" }}>{">"}</span>
        </span>

        {!isMobile && (
          <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l)} style={{
                background: "none", border: "none", color: "var(--text-secondary)",
                fontFamily: "'Space Mono', monospace", fontSize: "0.78rem",
                letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s",
              }}
                onMouseEnter={e => e.target.style.color = "var(--accent)"}
                onMouseLeave={e => e.target.style.color = "var(--text-secondary)"}
              >{l}</button>
            ))}
            <button onClick={toggleTheme} style={{
              background: "none", border: "1px solid var(--border)", borderRadius: "20px",
              padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              fontSize: "0.8rem", fontFamily: "'Space Mono', monospace",
              color: theme === 'dark' ? "#fbbf24" : "#1f2937",
              backgroundColor: theme === 'dark' ? "rgba(251,191,36,0.1)" : "rgba(31,41,55,0.1)",
              transition: "all 0.2s",
            }}>
              {theme === 'dark' ? '☀️' : '🌙'} {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        )}

        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={toggleTheme} style={{
              background: "none", border: "1px solid var(--border)", borderRadius: "20px",
              padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
              fontSize: "0.7rem", fontFamily: "'Space Mono', monospace",
              color: theme === 'dark' ? "#fbbf24" : "#1f2937",
              backgroundColor: theme === 'dark' ? "rgba(251,191,36,0.1)" : "rgba(31,41,55,0.1)",
            }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setMenuOpen(o => !o)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "4px",
              display: "flex", flexDirection: "column", gap: "5px",
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: "block", width: "22px", height: "2px",
                  background: menuOpen ? "var(--accent)" : "var(--text-primary)",
                  borderRadius: "2px", transition: "all 0.3s ease",
                  transform: menuOpen
                    ? i === 0 ? "rotate(45deg) translate(5px,5px)"
                    : i === 2 ? "rotate(-45deg) translate(5px,-5px)"
                    : "scaleX(0)"
                    : "none",
                }} />
              ))}
            </button>
          </div>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: "var(--nav-bg)", backdropFilter: "blur(20px)",
          paddingTop: "80px", paddingBottom: "32px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
          borderBottom: "1px solid rgba(147,51,234,0.2)",
        }}>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: "none", border: "none", color: "var(--text-secondary)",
              fontFamily: "'Space Mono', monospace", fontSize: "1rem",
              letterSpacing: "0.15em", textTransform: "uppercase",
              cursor: "pointer", padding: "16px 0", width: "100%", textAlign: "center",
            }}>{l}</button>
          ))}
        </div>
      )}
    </>
  );
}

// ── Particles ─────────────────────────────────────────────────────────────────
function ParticlesCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147,51,234,${p.alpha})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(147,51,234,${0.1 * (1 - dist / 110)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, display: "block" }} />;
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const width = useWindowSize();
  const isMobile = width <= 768;
  const isSmall = width <= 480;
  const typed = useTypewriter(["Full Stack Developer.", "MERN Stack Engineer.", "TypeScript Enthusiast.", "Problem Solver."], 40, 1000);
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 200); }, []);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: isMobile ? "0 20px" : "0 48px",
      position: "relative", overflow: "hidden",
      boxSizing: "border-box", width: "100%",
    }}>
      <ParticlesCanvas />
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(147,51,234,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      <div style={{
        position: "absolute", top: "10%",
        right: isMobile ? "-100px" : "5%",
        width: isMobile ? "250px" : "400px",
        height: isMobile ? "250px" : "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%)",
        filter: "blur(60px)", zIndex: 0, pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1, width: "100%",
        maxWidth: isMobile ? "100%" : "800px",
        paddingTop: isMobile ? "90px" : "0",
        paddingBottom: isMobile ? "60px" : "0",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <p style={{
          fontFamily: "'Space Mono', monospace", fontSize: "0.72rem",
          letterSpacing: "0.2em", color: "#9333ea", textTransform: "uppercase", marginBottom: "14px",
        }}>Hello, I'm</p>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isSmall ? "3.4rem" : isMobile ? "4.5rem" : "clamp(3.5rem, 9vw, 8rem)",
          fontWeight: 700, lineHeight: 1,
          color: "var(--text-primary)", margin: "0 0 18px", letterSpacing: "-0.02em",
        }}>
          RISHI<br />
          <span style={{ WebkitTextStroke: "2px rgba(147,51,234,0.4)", color: "transparent" }}>CODES</span>
        </h1>

        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: isSmall ? "0.8rem" : isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1.2rem)",
          color: "#9333ea", marginBottom: "20px", minHeight: "1.6em",
        }}>
          {typed}<span style={{ animation: "blink 1s step-end infinite" }}>|</span>
        </div>

        <p style={{
          fontSize: isMobile ? "0.9rem" : "1rem",
          color: "var(--text-muted)", lineHeight: 1.8,
          maxWidth: isMobile ? "100%" : "520px",
          marginBottom: "32px", fontFamily: "'DM Sans', sans-serif",
        }}>
          Building scalable, performant web applications from database to UI.
          I turn complex problems into elegant, maintainable solutions.
        </p>

        <div style={{
          display: "flex", flexDirection: isMobile ? "column" : "row",
          gap: "12px", width: isMobile ? "100%" : "auto",
        }}>
          <button onClick={() => scrollTo("contact")} style={{
            padding: "13px 28px",
            background: "linear-gradient(135deg, #7c3aed, #9333ea)",
            border: "none", color: "#fff",
            fontFamily: "'Space Mono', monospace", fontSize: "0.75rem",
            letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
            borderRadius: "2px", width: isMobile ? "100%" : "auto",
            boxShadow: "0 0 30px rgba(147,51,234,0.4)", transition: "all 0.3s ease",
          }}>Get in Touch</button>
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  const width = useWindowSize();
  const isMobile = width <= 768;
  const [ref, inView] = useInView();

  return (
    <section id="about" ref={ref} style={{ padding: isMobile ? "80px 20px" : "120px 48px", boxSizing: "border-box", width: "100%" }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr",
        gap: isMobile ? "48px" : "80px", alignItems: "center",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ position: "relative", width: isMobile ? "200px" : "100%", margin: isMobile ? "0 auto" : "0" }}>
          <div style={{ width: "100%", paddingBottom: "100%", borderRadius: "4px", position: "relative", overflow: "hidden" }}>
            {[
              { top: -1, left: -1, borderTop: "2px solid #9333ea", borderLeft: "2px solid #9333ea" },
              { top: -1, right: -1, borderTop: "2px solid #9333ea", borderRight: "2px solid #9333ea" },
              { bottom: -1, left: -1, borderBottom: "2px solid #9333ea", borderLeft: "2px solid #9333ea" },
              { bottom: -1, right: -1, borderBottom: "2px solid #9333ea", borderRight: "2px solid #9333ea" },
            ].map((s, i) => <div key={i} style={{ position: "absolute", width: "18px", height: "18px", zIndex: 2, ...s }} />)}
            <img src="/profile.png" alt="Rishi Codes" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
              background: "linear-gradient(to top, rgba(147,51,234,0.25), transparent)", zIndex: 1,
            }} />
          </div>
          <div style={{
            position: "absolute", bottom: "-14px", right: "-10px",
            background: "#9333ea", padding: "8px 14px",
            fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "#fff",
            letterSpacing: "0.1em", borderRadius: "2px",
          }}>FULL STACK</div>
        </div>

        <div style={{ paddingTop: isMobile ? "20px" : "0" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.25em", color: "#9333ea", textTransform: "uppercase", marginBottom: "12px" }}>// about me</p>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? "2.2rem" : "clamp(2rem, 4vw, 3.5rem)",
            color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "20px",
          }}>
            Crafting Digital <span style={{ color: "#9333ea" }}>Experiences</span>
          </h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.9, fontSize: "0.92rem", marginBottom: "14px", fontFamily: "'DM Sans', sans-serif" }}>
            I'm a Full Stack Developer passionate about crafting clean, efficient, and user-friendly web applications. I specialize in the MERN stack along with TypeScript and PostgreSQL, turning complex problems into elegant solutions.
          </p>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.9, fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif" }}>
            When I'm not coding, I'm exploring new technologies and pushing the boundaries of what the web can do — always curious, always building.
          </p>
          <div style={{ marginTop: "32px", display: "flex", gap: isMobile ? "20px" : "40px", flexWrap: "wrap" }}>
            {[["3+", "Years Exp."], ["20+", "Projects"], ["10+", "Technologies"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "1.8rem", fontWeight: 700, color: "#9333ea" }}>{n}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────
function Skills() {
  const width = useWindowSize();
  const isMobile = width <= 768;
  const [ref, inView] = useInView();

  return (
    <section id="skills" ref={ref} style={{ padding: isMobile ? "80px 20px" : "120px 48px", boxSizing: "border-box", width: "100%" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.25em", color: "#9333ea", textTransform: "uppercase", marginBottom: "12px" }}>// skills</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? "2.2rem" : "clamp(2rem, 4vw, 3.5rem)", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "40px" }}>
            My Tech <span style={{ color: "#9333ea" }}>Arsenal</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
          {SKILLS.map((skill, i) => <SkillCard key={skill.name} skill={skill} delay={i * 100} inView={inView} />)}
        </div>

        <div style={{ marginTop: "40px", display: "flex", flexWrap: "wrap", gap: "8px", opacity: inView ? 1 : 0, transition: "opacity 0.8s ease 0.5s" }}>
          {["REST APIs", "GraphQL", "Docker", "Git", "Linux", "AWS", "Redis", "JWT", "WebSockets", "CI/CD"].map(tag => (
            <span key={tag} style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
              color: "var(--text-secondary)", padding: "5px 10px",
              border: "1px solid var(--border)", borderRadius: "2px", cursor: "default", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.color = "#9333ea"; e.target.style.borderColor = "rgba(147,51,234,0.4)"; }}
              onMouseLeave={e => { e.target.style.color = "var(--text-secondary)"; e.target.style.borderColor = "var(--border)"; }}
            >{tag}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, delay, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      padding: "22px",
      background: hovered ? "rgba(147,51,234,0.06)" : "var(--card-bg)",
      border: `1px solid ${hovered ? "rgba(147,51,234,0.4)" : "var(--border)"}`,
      borderRadius: "4px", transition: "all 0.3s ease",
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
      transitionDelay: `${delay}ms`, transitionDuration: "0.7s", width: "100%", boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", color: "var(--text-primary)" }}>{skill.name}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#9333ea" }}>{skill.level}%</span>
      </div>
      <div style={{ height: "2px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: inView ? `${skill.level}%` : "0%",
          background: "linear-gradient(90deg, #7c3aed, #c084fc)",
          transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay + 300}ms`, borderRadius: "2px",
        }} />
      </div>
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
function Projects() {
  const width = useWindowSize();
  const isMobile = width <= 768;
  const [ref, inView] = useInView();

  return (
    <section id="projects" ref={ref} style={{ padding: isMobile ? "80px 20px" : "120px 48px", boxSizing: "border-box", width: "100%" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.25em", color: "#9333ea", textTransform: "uppercase", marginBottom: "12px" }}>// projects</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? "2.2rem" : "clamp(2rem, 4vw, 3.5rem)", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "8px" }}>
            Things I've <span style={{ color: "#9333ea" }}>Built</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "40px" }}>
            More projects coming soon — building in public 🚀
          </p>
        </div>

        {/* Project cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : PROJECTS.length === 1 ? "minmax(300px, 480px)" : "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
        }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} delay={i * 120} inView={inView} />
          ))}

          {/* Coming Soon placeholder card */}
          <ComingSoonCard delay={PROJECTS.length * 120} inView={inView} />
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, delay, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: hovered ? "rgba(147,51,234,0.07)" : "var(--card-bg)",
      border: `1px solid ${hovered ? "rgba(147,51,234,0.5)" : "var(--border)"}`,
      borderRadius: "4px", transition: "all 0.3s ease",
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
      transitionDelay: `${delay}ms`, transitionDuration: "0.7s",
      display: "flex", flexDirection: "column",
      width: "100%", boxSizing: "border-box", overflow: "hidden",
    }}>
      {/* Project screenshot */}
      {project.image && (
        <div style={{
          width: "100%", height: "190px", overflow: "hidden",
          borderBottom: `1px solid ${hovered ? "rgba(147,51,234,0.4)" : "var(--border)"}`,
          position: "relative",
        }}>
          <img src={project.image} alt={project.title} style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "top",
            transition: "transform 0.5s ease",
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.55))",
          }} />
          {project.badge && (
            <span style={{
              position: "absolute", top: 10, right: 10,
              background: "rgba(147,51,234,0.9)", color: "#fff",
              fontFamily: "'Space Mono', monospace", fontSize: "0.55rem",
              padding: "3px 10px", borderRadius: "2px", letterSpacing: "0.12em",
            }}>{project.badge}</span>
          )}
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.92rem", color: "var(--text-primary)" }}>{project.title}</h3>
          <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
            {[{ label: "GitHub", href: project.github }, { label: "Live", href: project.live }].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" style={{
                fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "var(--text-secondary)",
                textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s",
              }}
                onMouseEnter={e => e.target.style.color = "#9333ea"}
                onMouseLeave={e => e.target.style.color = "var(--text-secondary)"}
              >{label} ↗</a>
            ))}
          </div>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.7, flex: 1 }}>{project.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {project.tech.map(t => (
            <span key={t} style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#9333ea",
              padding: "3px 9px", border: "1px solid rgba(147,51,234,0.3)", borderRadius: "2px",
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Coming Soon placeholder ───────────────────────────────────────────────────
function ComingSoonCard({ delay, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: hovered ? "rgba(147,51,234,0.04)" : "transparent",
      border: `1px dashed ${hovered ? "rgba(147,51,234,0.4)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: "4px", transition: "all 0.3s ease",
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
      transitionDelay: `${delay}ms`, transitionDuration: "0.7s",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "240px", width: "100%", boxSizing: "border-box", padding: "32px",
      cursor: "default",
    }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "50%",
        border: "1px dashed rgba(147,51,234,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "16px", fontSize: "1.2rem",
        color: "rgba(147,51,234,0.4)",
      }}>+</div>
      <p style={{
        fontFamily: "'Space Mono', monospace", fontSize: "0.7rem",
        color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em",
        textTransform: "uppercase", textAlign: "center",
      }}>Next Project<br />Coming Soon</p>
    </div>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const width = useWindowSize();
  const isMobile = width <= 768;
  const [ref, inView] = useInView();

  return (
    <section id="contact" ref={ref} style={{ padding: isMobile ? "80px 20px 100px" : "120px 48px 160px", boxSizing: "border-box", width: "100%" }}>
      <div style={{
        maxWidth: "700px", margin: "0 auto", textAlign: "center",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.25em", color: "#9333ea", textTransform: "uppercase", marginBottom: "12px" }}>// contact</p>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isMobile ? "2.8rem" : "clamp(2.5rem, 6vw, 5rem)",
          color: "var(--text-primary)", lineHeight: 1, marginBottom: "18px",
        }}>
          LET'S BUILD<br /><span style={{ color: "#9333ea" }}>SOMETHING</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: isMobile ? "0.88rem" : "1rem", lineHeight: 1.8, marginBottom: "36px", fontFamily: "'DM Sans', sans-serif" }}>
          Have a project in mind or just want to say hi? My inbox is always open. I'll get back to you as soon as possible.
        </p>

        <a href="https://mail.google.com/mail/u/0/?to=rishicodes7@gmail.com&fs=1&tf=cm" style={{
          display: isMobile ? "block" : "inline-block",
          padding: "13px 36px",
          background: "linear-gradient(135deg, #7c3aed, #9333ea)",
          color: "#fff", textDecoration: "none",
          fontFamily: "'Space Mono', monospace", fontSize: "0.75rem",
          letterSpacing: "0.1em", textTransform: "uppercase",
          borderRadius: "2px", boxShadow: "0 0 40px rgba(147,51,234,0.4)",
          boxSizing: "border-box", transition: "all 0.3s ease",
        }}>Say Hello →</a>

        <div style={{ marginTop: "36px", display: "flex", justifyContent: "center", gap: isMobile ? "20px" : "32px", flexWrap: "wrap" }}>
          {[
            { label: "GitHub", href: "https://github.com/rishicodes-7" },
            { label: "LinkedIn", href: "https://linkedin.com/in/rishicodes" },
            { label: "Email", href: "https://mail.google.com/mail/u/0/?to=rishicodes7@gmail.com&fs=1&tf=cm" },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: "var(--text-secondary)",
              textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em", transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#9333ea"}
              onMouseLeave={e => e.target.style.color = "var(--text-secondary)"}
            >{label}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const width = useWindowSize();
  const isMobile = width <= 768;
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      padding: isMobile ? "20px" : "24px 48px",
      display: "flex", flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between", alignItems: "center",
      gap: isMobile ? "6px" : "0", textAlign: isMobile ? "center" : "left",
      boxSizing: "border-box", width: "100%",
    }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
        <span style={{ color: "#9333ea" }}>{"<"}</span>RishiCodes<span style={{ color: "#9333ea" }}>{"/>"}</span>
      </span>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "var(--text-secondary)", letterSpacing: "0.1em" }}>
        BUILT WITH REACT © 2026
      </span>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ThemeProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html {
          scroll-behavior: smooth;
          overflow-x: hidden;
          max-width: 100%;
        }

        :root {
          --bg-primary: #060606; --bg-secondary: #111;
          --text-primary: #fff; --text-secondary: #aaa; --text-muted: #888;
          --accent: #9333ea; --border: rgba(255,255,255,0.1);
          --nav-bg: rgba(6,6,6,0.97); --card-bg: rgba(255,255,255,0.03);
        }

        [data-theme="light"] {
          --bg-primary: #ffffff; --bg-secondary: #f8fafc;
          --text-primary: #1a1a1a; --text-secondary: #4b5563; --text-muted: #6b7280;
          --accent: #9333ea; --border: rgba(0,0,0,0.1);
          --nav-bg: rgba(255,255,255,0.97); --card-bg: rgba(0,0,0,0.03);
        }

        body {
          background: var(--bg-primary);
          color: var(--text-primary);
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          max-width: 100vw;
          position: relative;
          transition: background 0.3s ease, color 0.3s ease;
        }

        body::before {
          content: ''; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 9999; opacity: 0.5;
        }

        section + section { border-top: 1px solid var(--border); }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060606; }
        ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 2px; }
      `}</style>

      <Navbar scrolled={scrolled} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </ThemeProvider>
  );
}