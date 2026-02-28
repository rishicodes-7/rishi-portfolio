import { useState, useEffect, useRef } from "react";

const SKILLS = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 88 },
  { name: "Express", level: 82 },
  { name: "MongoDB", level: 80 },
  { name: "PostgreSQL", level: 78 },
];

const NAV_LINKS = ["about", "skills", "contact"];

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
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

function Navbar({ scrolled }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "14px 48px" : "24px 48px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: scrolled ? "rgba(6,6,6,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(138,43,226,0.15)" : "none",
      transition: "all 0.4s ease",
    }}>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "1.1rem", fontWeight: 700,
        color: "#fff", letterSpacing: "0.05em",
        cursor: "pointer"
      }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <span style={{ color: "#9333ea" }}>{"<"}</span>
        RishiCodes
        <span style={{ color: "#9333ea" }}>{"/>"}</span>
      </span>
      <div style={{ display: "flex", gap: "36px" }}>
        {NAV_LINKS.map(l => (
          <button key={l} onClick={() => scrollTo(l)} style={{
            background: "none", border: "none", color: "#aaa",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.8rem", letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = "#9333ea"}
            onMouseLeave={e => e.target.style.color = "#aaa"}
          >{l}</button>
        ))}
      </div>
    </nav>
  );
}

function Hero() {
  const typed = useTypewriter(["Full Stack Developer.", "MERN Stack Engineer.", "TypeScript Enthusiast.", "Problem Solver."]);
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 200); }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "0 48px", position: "relative", overflow: "hidden",
    }}>
      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(147,51,234,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(147,51,234,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />
      {/* Glow blob */}
      <div style={{
        position: "absolute", top: "20%", right: "10%",
        width: "420px", height: "420px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(147,51,234,0.18) 0%, transparent 70%)",
        filter: "blur(60px)", zIndex: 0,
      }} />

      <div style={{
        position: "relative", zIndex: 1, maxWidth: "800px",
        opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.78rem", letterSpacing: "0.25em",
          color: "#9333ea", textTransform: "uppercase",
          marginBottom: "20px",
        }}>Hello, I'm</p>

        <h1 style={{
          fontFamily: "'Clash Display', 'Bebas Neue', sans-serif",
          fontSize: "clamp(3.5rem, 9vw, 8rem)",
          fontWeight: 700, lineHeight: 1,
          color: "#fff", margin: "0 0 24px",
          letterSpacing: "-0.02em",
        }}>
          RISHI<br />
          <span style={{ WebkitTextStroke: "2px rgba(255,255,255,0.25)", color: "transparent" }}>
            CODES
          </span>
        </h1>

        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
          color: "#9333ea", marginBottom: "40px",
          minHeight: "1.6em",
        }}>
          {typed}<span style={{ animation: "blink 1s step-end infinite" }}>|</span>
        </div>

        <p style={{
          fontSize: "1.05rem", color: "#888", lineHeight: 1.8,
          maxWidth: "520px", marginBottom: "48px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Building scalable, performant web applications from database to UI.
          I turn complex problems into elegant, maintainable solutions.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <button onClick={() => scrollTo("contact")} style={{
            padding: "14px 36px",
            background: "linear-gradient(135deg, #7c3aed, #9333ea)",
            border: "none", color: "#fff",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.8rem", letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer",
            borderRadius: "2px",
            boxShadow: "0 0 30px rgba(147,51,234,0.4)",
            transition: "all 0.3s ease",
          }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 50px rgba(147,51,234,0.6)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 30px rgba(147,51,234,0.4)"; }}
          >
            Get in Touch
          </button>
          <button onClick={() => scrollTo("skills")} style={{
            padding: "14px 36px",
            background: "transparent",
            border: "1px solid rgba(147,51,234,0.4)",
            color: "#ccc",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.8rem", letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer",
            borderRadius: "2px",
            transition: "all 0.3s ease",
          }}
            onMouseEnter={e => { e.target.style.borderColor = "#9333ea"; e.target.style.color = "#9333ea"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(147,51,234,0.4)"; e.target.style.color = "#ccc"; }}
          >
            View Skills
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "40px", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        opacity: 0.4,
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#fff" }}>SCROLL</span>
        <div style={{
          width: "1px", height: "50px",
          background: "linear-gradient(to bottom, #9333ea, transparent)",
          animation: "scrollPulse 2s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
}

function About() {
  const [ref, inView] = useInView();
  return (
    <section id="about" ref={ref} style={{
      padding: "120px 48px",
      position: "relative",
    }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "80px",
        alignItems: "center",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Left: avatar placeholder */}
        <div style={{ position: "relative" }}>
          <div style={{
            width: "100%", paddingBottom: "100%",
            background: "linear-gradient(135deg, #1a1a1a, #0d0d0d)",
            border: "1px solid rgba(147,51,234,0.2)",
            borderRadius: "4px", position: "relative", overflow: "hidden",
          }}>
            {/* Corner accents */}
            {[
              { top: -1, left: -1, borderTop: "2px solid #9333ea", borderLeft: "2px solid #9333ea" },
              { top: -1, right: -1, borderTop: "2px solid #9333ea", borderRight: "2px solid #9333ea" },
              { bottom: -1, left: -1, borderBottom: "2px solid #9333ea", borderLeft: "2px solid #9333ea" },
              { bottom: -1, right: -1, borderBottom: "2px solid #9333ea", borderRight: "2px solid #9333ea" },
            ].map((s, i) => (
              <div key={i} style={{ position: "absolute", width: "20px", height: "20px", ...s }} />
            ))}
            {/* Initials */}
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontFamily: "'Space Mono', monospace",
              fontSize: "5rem", fontWeight: 700,
              color: "rgba(147,51,234,0.2)",
              letterSpacing: "0.05em",
            }}>RC</div>
          </div>
          {/* Floating badge */}
          <div style={{
            position: "absolute", bottom: "-20px", right: "-20px",
            background: "#9333ea", padding: "12px 20px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.7rem", color: "#fff",
            letterSpacing: "0.1em",
            borderRadius: "2px",
          }}>FULL STACK</div>
        </div>

        {/* Right: text */}
        <div>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.75rem", letterSpacing: "0.25em",
            color: "#9333ea", textTransform: "uppercase",
            marginBottom: "16px",
          }}>// about me</p>
          <h2 style={{
            fontFamily: "'Clash Display', 'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "#fff", lineHeight: 1.1,
            marginBottom: "28px", letterSpacing: "-0.02em",
          }}>
            Crafting Digital<br />
            <span style={{ color: "#9333ea" }}>Experiences</span>
          </h2>
          <p style={{
            color: "#888", lineHeight: 1.9,
            fontSize: "1rem", marginBottom: "20px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            I'm a Full Stack Developer passionate about crafting clean, efficient, and user-friendly web applications. I specialize in the MERN stack along with TypeScript and PostgreSQL, turning complex problems into elegant solutions.
          </p>
          <p style={{
            color: "#888", lineHeight: 1.9,
            fontSize: "1rem",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            When I'm not coding, I'm exploring new technologies and pushing the boundaries of what the web can do — always curious, always building.
          </p>

          <div style={{
            marginTop: "40px", display: "flex", gap: "40px",
          }}>
            {[["3+", "Years Exp."], ["20+", "Projects"], ["10+", "Technologies"]].map(([n, l]) => (
              <div key={l}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "2rem", fontWeight: 700,
                  color: "#9333ea",
                }}>{n}</div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem", color: "#666",
                  letterSpacing: "0.05em",
                }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const [ref, inView] = useInView();
  return (
    <section id="skills" ref={ref} style={{ padding: "120px 48px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(40px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.75rem", letterSpacing: "0.25em",
            color: "#9333ea", textTransform: "uppercase",
            marginBottom: "16px",
          }}>// skills</p>
          <h2 style={{
            fontFamily: "'Clash Display', 'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "#fff", lineHeight: 1.1,
            marginBottom: "60px", letterSpacing: "-0.02em",
          }}>
            My Tech <span style={{ color: "#9333ea" }}>Arsenal</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}>
          {SKILLS.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} delay={i * 100} inView={inView} />
          ))}
        </div>

        {/* Tag cloud */}
        <div style={{
          marginTop: "60px", display: "flex", flexWrap: "wrap", gap: "12px",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.8s ease 0.5s",
        }}>
          {["REST APIs", "GraphQL", "Docker", "Git", "Linux", "AWS", "Redis", "JWT", "WebSockets", "CI/CD"].map(tag => (
            <span key={tag} style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.72rem", letterSpacing: "0.08em",
              color: "#666", padding: "6px 14px",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "2px",
              transition: "all 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => { e.target.style.color = "#9333ea"; e.target.style.borderColor = "rgba(147,51,234,0.4)"; }}
              onMouseLeave={e => { e.target.style.color = "#666"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
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
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px",
        background: hovered ? "rgba(147,51,234,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(147,51,234,0.4)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "4px",
        transition: "all 0.3s ease",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
        transitionDuration: "0.7s",
        cursor: "default",
      }}
    >
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "16px",
      }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.85rem", color: "#fff",
          letterSpacing: "0.05em",
        }}>{skill.name}</span>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.75rem", color: "#9333ea",
        }}>{skill.level}%</span>
      </div>
      {/* Bar */}
      <div style={{
        height: "2px", background: "rgba(255,255,255,0.06)",
        borderRadius: "2px", overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: inView ? `${skill.level}%` : "0%",
          background: "linear-gradient(90deg, #7c3aed, #c084fc)",
          transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay + 300}ms`,
          borderRadius: "2px",
        }} />
      </div>
    </div>
  );
}

function Contact() {
  const [ref, inView] = useInView();
  return (
    <section id="contact" ref={ref} style={{ padding: "120px 48px 160px" }}>
      <div style={{
        maxWidth: "700px", margin: "0 auto", textAlign: "center",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.75rem", letterSpacing: "0.25em",
          color: "#9333ea", textTransform: "uppercase",
          marginBottom: "16px",
        }}>// contact</p>
        <h2 style={{
          fontFamily: "'Clash Display', 'Bebas Neue', sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          color: "#fff", lineHeight: 1,
          marginBottom: "20px", letterSpacing: "-0.02em",
        }}>
          LET'S BUILD<br />
          <span style={{ color: "#9333ea" }}>SOMETHING</span>
        </h2>
        <p style={{
          color: "#666", fontSize: "1rem", lineHeight: 1.8,
          marginBottom: "48px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Have a project in mind or just want to say hi? My inbox is always open.
          I'll get back to you as soon as possible.
        </p>

        <a href="mailto:rishi.codes.dev@gmail.com" style={{
          display: "inline-block",
          padding: "16px 48px",
          background: "linear-gradient(135deg, #7c3aed, #9333ea)",
          color: "#fff", textDecoration: "none",
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.8rem", letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderRadius: "2px",
          boxShadow: "0 0 40px rgba(147,51,234,0.4)",
          transition: "all 0.3s ease",
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 0 60px rgba(147,51,234,0.6)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 40px rgba(147,51,234,0.4)"; }}
        >
          Say Hello →
        </a>

        {/* Social links */}
        <div style={{
          marginTop: "48px", display: "flex",
          justifyContent: "center", gap: "32px",
        }}>
          {[
            { label: "GitHub", href: "https://github.com/rishicodes" },
            { label: "LinkedIn", href: "https://linkedin.com/in/rishicodes" },
            { label: "Email", href: "mailto:rishi.codes.dev@gmail.com" },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.75rem", letterSpacing: "0.1em",
              color: "#555", textDecoration: "none",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#9333ea"}
              onMouseLeave={e => e.target.style.color = "#555"}
            >{label}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "24px 48px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.7rem", color: "#444",
        letterSpacing: "0.05em",
      }}>
        <span style={{ color: "#9333ea" }}>{"<"}</span>RishiCodes<span style={{ color: "#9333ea" }}>{"/>"}</span>
      </span>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.65rem", color: "#333",
        letterSpacing: "0.1em",
      }}>BUILT WITH REACT © 2025</span>
    </footer>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          background: #060606;
          color: #fff;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
        }

        /* Grain overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 9999;
          opacity: 0.6;
        }

        /* Divider lines */
        section + section {
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 0.9; transform: scaleY(1.2); }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060606; }
        ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 2px; }
      `}</style>

      <Navbar scrolled={scrolled} />
      <Hero />
      <About />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}