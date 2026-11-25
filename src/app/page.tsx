"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // 2. PARALLAX & ENTRANCE ANIMATIONS FOR SCENE 0 (LANDING STAGE)
      gsap.from(".landing-hero-text", {
        scale: 0.94,
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(".sticker-badge", {
        scale: 0.6,
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.9,
        ease: "back.out(1.7)",
        delay: 0.2,
      });

      // 3. Hero Kinetic Timeline
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-sequence",
          start: "top top",
          end: "+=120%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        },
      });

      heroTl.to(
        "#hero-blur-bg",
        {
          scale: 1.4,
          filter: "blur(28px)",
          opacity: 0.08,
          ease: "power1.out",
        },
        0
      );

      heroTl.to(
        "#line-1",
        {
          xPercent: -12,
          opacity: 0.25,
          ease: "power1.inOut",
        },
        0
      );

      heroTl.to(
        "#line-2",
        {
          xPercent: 10,
          ease: "power1.inOut",
        },
        0
      );

      heroTl.to(
        "#line-3",
        {
          scale: 1.1,
          color: "#7b57f5",
          ease: "power1.inOut",
        },
        0
      );

      heroTl.to(
        "#scroll-prompt",
        {
          opacity: 0,
          y: 20,
        },
        0
      );

      // 4. FULL SCREEN PINNED STACKING CARDS
      const isTallScreen = window.innerHeight > 550;
      const stackCards = gsap.utils.toArray<HTMLElement>(".stack-card");
      stackCards.forEach((card, i) => {
        if (i < stackCards.length - 1 && isTallScreen) {
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
          });
        }
      });

      // 5. MOUSE-FOLLOWING REVOLVING BADGE
      const follower = document.getElementById("badge-follower");
      const dot = document.getElementById("cursor-dot");

      if (window.innerWidth >= 768) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;

        const onMouseMove = (e: MouseEvent) => {
          mouseX = e.clientX;
          mouseY = e.clientY;

          if (dot) {
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
          }
        };

        window.addEventListener("mousemove", onMouseMove);

        const updateFollower = () => {
          currentX += (mouseX - currentX) * 0.12;
          currentY += (mouseY - currentY) * 0.12;

          if (follower) {
            follower.style.left = `${currentX}px`;
            follower.style.top = `${currentY}px`;
          }
        };

        gsap.ticker.add(updateFollower);

        ScrollTrigger.create({
          trigger: "#hero-sequence",
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => {
            if (follower) {
              follower.style.opacity = "1";
              follower.style.visibility = "visible";
            }
          },
          onLeave: () => {
            if (follower) {
              follower.style.opacity = "0";
              follower.style.visibility = "hidden";
            }
          },
          onEnterBack: () => {
            if (follower) {
              follower.style.opacity = "1";
              follower.style.visibility = "visible";
            }
          },
          onLeaveBack: () => {
            if (follower) {
              follower.style.opacity = "0";
              follower.style.visibility = "hidden";
            }
          },
        });
      }

      // Smooth Anchor Scroll
      const handleAnchor = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest("a");
        if (anchor && anchor.getAttribute("href")?.startsWith("#")) {
          e.preventDefault();
          const href = anchor.getAttribute("href");
          if (href) {
            const el = document.querySelector(href);
            if (el) {
              lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 });
            }
          }
        }
      };

      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", handleAnchor as any);
      });
    }, mainRef);

    // Refresh triggers after DOM is rendered
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={mainRef}>
      {/* Minimal Center Dot Cursor (Desktops only) */}
      <div id="cursor-dot" className="hidden md:block"></div>

      {/* REVOLVING BADGE MOUSE FOLLOWER (Desktops only, Scene 1 only) */}
      <div id="badge-follower" className="hidden md:block">
        <div className="w-36 h-36 flex items-center justify-center relative">
          <svg className="spinning-badge w-full h-full" viewBox="0 0 120 120">
            <path
              id="circlePath"
              fill="none"
              d="M 60, 60 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
            />
            <text className="font-mono text-[9px] uppercase tracking-[0.24em] fill-neutral-900 font-bold">
              <textPath href="#circlePath" startOffset="0%">
                • AI CODE MENTOR • INSTAFOODS •
              </textPath>
            </text>
          </svg>
          <div className="absolute w-10 h-10 rounded-full border border-neutral-900 flex items-center justify-center text-xl font-light text-neutral-900">
            +
          </div>
        </div>
      </div>

      {/* ==============================================
           HEADER: FULLY RESPONSIVE HUD
      =================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 md:px-12 py-4 sm:py-6 flex items-center sm:items-start justify-between pointer-events-none mix-blend-difference text-white">
        <div className="pointer-events-auto">
          <div className="font-mono text-[10px] sm:text-xs md:text-[13px] font-semibold tracking-wider uppercase">
            CREATIVE DEV &bull; FULL-STACK
          </div>
          <div className="font-mono text-[9px] sm:text-[11px] md:text-xs text-white/80 uppercase tracking-wider underline underline-offset-2">
            RAJATH &bull; IFHAAM (FREELANCE)
          </div>
        </div>

        <div className="static sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-6 pointer-events-auto">
          <a href="#" className="group flex items-center justify-center">
            <span className="font-headline tracking-widest text-2xl sm:text-3xl md:text-4xl text-white hover:text-vynex-purple transition duration-200">
              VYNEX
            </span>
          </a>
        </div>

        <div className="pointer-events-auto">
          <a
            href="#contact"
            className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-white text-white font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition duration-200"
          >
            CONTACT &darr;
          </a>
        </div>
      </header>

      {/* FIXED BOTTOM CORNERS (Responsive HUD) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 sm:px-8 md:px-12 py-3 sm:py-6 flex items-center justify-between pointer-events-none mix-blend-difference text-white font-mono text-[9px] sm:text-[11px] md:text-xs tracking-wider uppercase">
        <div>VYNEX, 2026 &bull; RAJATH &bull; IFHAAM</div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="hidden xs:inline">HOTLINE:</span> 80888 33827
        </div>
      </div>

      {/* MAIN SCROLL EXPERIENCE */}
      <main className="relative w-full">
        {/* ==============================================
             SCENE 0: ELEVATED ARTISTIC LANDING STAGE
        =================================================== */}
        <section
          id="landing-stage"
          className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden valentin-grid px-4 py-20 bg-[#f3e8f8]"
        >
          <div className="absolute w-72 h-72 sm:w-[35rem] sm:h-[35rem] md:w-[48rem] md:h-[48rem] radial-glow pointer-events-none rounded-full blur-2xl sm:blur-3xl opacity-80"></div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden landing-stickers">
            <div className="sticker-badge pointer-events-auto absolute top-20 sm:top-24 left-[3%] sm:left-[10%] bg-white text-black font-display font-extrabold text-xs sm:text-sm md:text-base px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg -rotate-6 border border-neutral-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-vynex-purple animate-ping"></span>
              <span>VYNEX &bull; DIGITAL STUDIO</span>
            </div>

            <div className="sticker-badge pointer-events-auto absolute top-20 sm:top-24 left-[50%] -translate-x-1/2 bg-black text-white font-mono text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-xl border border-white/20 hidden sm:flex items-center gap-2">
              <span className="text-vynex-purple font-bold">❖</span>
              <span>LAT 12.9716° N // APEX CRAFT</span>
            </div>

            <div className="sticker-badge pointer-events-auto absolute top-20 sm:top-24 right-[3%] sm:right-[10%] bg-neutral-900 text-white font-display font-bold text-xs sm:text-sm md:text-base px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg rotate-6 border border-neutral-700">
              FUTURE-READY &nearr;
            </div>

            <div className="sticker-badge pointer-events-auto absolute top-[36%] sm:top-[38%] left-[2%] sm:left-[5%] bg-vynex-purple text-white font-mono text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-xl rotate-3">
              FULL-STACK &bull; RAJATH
            </div>

            <div className="sticker-badge pointer-events-auto absolute top-[38%] sm:top-[40%] right-[2%] sm:right-[5%] bg-white text-black font-mono text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-lg -rotate-3 border border-neutral-300">
              FREELANCE &bull; IFHAAM
            </div>

            <div className="sticker-badge pointer-events-auto absolute bottom-24 sm:bottom-28 left-[3%] sm:left-[12%] bg-white text-black font-display font-bold text-xs sm:text-sm md:text-base px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg -rotate-6 border border-neutral-300">
              AI CODE MENTOR &bull; LIVE APP
            </div>

            <div className="sticker-badge pointer-events-auto absolute bottom-24 sm:bottom-28 right-[3%] sm:right-[12%] bg-white text-black font-display font-bold text-xs sm:text-sm md:text-base px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg rotate-6 border border-neutral-300">
              INSTAFOODS &bull; COMMERCE
            </div>

            <div className="sticker-badge pointer-events-auto absolute bottom-14 sm:bottom-16 left-[50%] -translate-x-1/2 bg-white/95 backdrop-blur-md text-neutral-900 font-mono text-xs sm:text-sm font-semibold px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-neutral-300 shadow-md whitespace-nowrap hidden xs:block">
              NEXT.JS 15 &bull; TYPESCRIPT &bull; FASTAPI
            </div>
          </div>

          <div className="relative z-10 text-center select-none landing-hero-text px-2 my-auto">
            <div className="font-mono text-xs sm:text-sm md:text-base uppercase tracking-widest text-neutral-600 font-semibold mb-3">
              [ 00 // WELCOME TO THE NEXT FRONTIER ]
            </div>
            <h1 className="hero-title-layer text-[19vw] sm:text-[16vw] md:text-[14vw] text-neutral-950 leading-none">
              VY
              <span className="text-vynex-purple inline-block transform hover:scale-105 hover:rotate-6 transition duration-300">
                N
              </span>
              EX
            </h1>
            <div className="hero-title-layer text-[11vw] sm:text-[9vw] md:text-[7.5vw] text-neutral-800 -mt-1 sm:-mt-2 md:-mt-5">
              VISION + NEXT
            </div>
            <p className="font-mono text-xs sm:text-sm md:text-base uppercase tracking-widest text-neutral-700 font-medium mt-4 sm:mt-5 max-w-sm sm:max-w-md mx-auto">
              Next Starts Here &bull; Future-Ready Technology
            </p>
          </div>

          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs sm:text-sm uppercase tracking-widest text-neutral-600 flex flex-col items-center gap-1 font-semibold">
            <span>Scroll to explore</span>
            <span className="animate-bounce text-sm sm:text-base">&darr;</span>
          </div>
        </section>

        {/* ==============================================
             SCENE 1: THE PINNED HERO SCROLL SEQUENCE 
        =================================================== */}
        <section
          id="hero-sequence"
          className="relative min-h-screen w-full bg-[#f5ebe4]"
        >
          <div
            id="hero-pinned"
            className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4"
          >
            <div
              id="hero-blur-bg"
              className="absolute inset-0 flex flex-col items-center justify-center bg-blurred-text text-neutral-800 pointer-events-none text-center"
            >
              <div className="text-[15vw] sm:text-[13vw] md:text-[14vw] leading-none">WEB</div>
              <div className="text-[12vw] sm:text-[10vw] md:text-[11.5vw] leading-none">
                &gt; CREATIVE DEV &lt;
              </div>
              <div className="text-[15vw] sm:text-[13vw] md:text-[14vw] leading-none">DIGITAL</div>
            </div>

            <div className="relative z-10 text-center max-w-6xl mx-auto px-4 mt-4 sm:mt-8">
              <div
                id="hero-tagline-sub"
                className="font-mono text-xs sm:text-sm md:text-base uppercase tracking-widest text-neutral-600 mb-2 sm:mb-3 font-semibold"
              >
                VISION + NEXT &bull; FUTURE-READY TECHNOLOGY
              </div>

              <div
                id="hero-main-title"
                className="hero-title-layer text-[13.5vw] sm:text-[12vw] md:text-[10vw] text-neutral-950"
              >
                <div id="line-1" className="transition-transform duration-75">
                  CREATION OF
                </div>
                <div id="line-2" className="text-neutral-900">
                  INTERACTIVE
                </div>
                <div id="line-3" className="text-vynex-purple">
                  EXPERIENCES
                </div>
              </div>
            </div>

            <div className="md:hidden mt-6 flex items-center justify-center">
              <div className="px-3 py-1 rounded-full bg-neutral-900 text-white font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-vynex-purple animate-ping"></span>
                • AI CODE MENTOR • INSTAFOODS •
              </div>
            </div>

            <div
              id="scroll-prompt"
              className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 flex flex-col items-center gap-1 font-semibold"
            >
              <span>Scroll to uncover selected works</span>
              <span className="animate-bounce text-xs sm:text-sm">&darr;</span>
            </div>
          </div>
        </section>

        {/* ==============================================
             SCENE 2: FULL-SCREEN PINNED STACKING CARDS
        =================================================== --> */}
        <div id="projects" className="relative">
          {/* PROJECT 1: AI Code Mentor */}
          <section className="stack-card min-h-screen w-full bg-[#3b52f6] text-white flex flex-col justify-between p-6 sm:p-10 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start font-mono text-[10px] sm:text-xs uppercase tracking-widest text-white/80 pt-14 sm:pt-16">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping"></span>
                // 01. SELECTED WORK &bull; AI INTELLIGENCE
              </div>
              <div>DEPLOYED ON VERCEL</div>
            </div>

            <div className="my-auto py-6 sm:py-8">
              <div className="font-mono text-xs sm:text-sm md:text-base text-white/70 uppercase tracking-widest mb-2 sm:mb-3">
                AI-POWERED CODE INTELLIGENCE &bull; REAL-TIME MENTORING
              </div>
              <h2 className="hero-title-layer text-[13vw] sm:text-[12vw] md:text-[10vw] text-white tracking-tight hover:text-white/90 transition">
                &gt; AI CODE MENTOR &lt;
              </h2>
              <p className="max-w-2xl text-white/90 text-xs sm:text-sm md:text-lg mt-3 sm:mt-4 font-light leading-relaxed">
                Interactive, intelligent AI-powered programming companion offering real-time code optimization, debugging guidance, architectural insights, and contextual mentoring for modern developers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-12 sm:pb-14 border-t border-white/20 font-mono text-xs">
              <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[10px] sm:text-xs">
                  Next.js
                </span>
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[10px] sm:text-xs">
                  TypeScript
                </span>
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[10px] sm:text-xs">
                  Tailwind CSS
                </span>
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[10px] sm:text-xs">
                  OpenAI / Groq API
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-0">
                <a
                  href="https://ai-code-mentor.vercel.app/"
                  target="_blank"
                  className="px-5 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white text-[#3b52f6] hover:bg-neutral-100 transition uppercase tracking-wider font-bold text-xs sm:text-sm shadow-lg text-center"
                >
                  Launch Live App &nearr;
                </a>
                <a
                  href="https://github.com/rajathos07/AICodeMentor.git"
                  target="_blank"
                  className="px-5 py-2.5 sm:px-7 sm:py-3 rounded-full border border-white text-white hover:bg-white/15 transition uppercase tracking-wider font-semibold text-xs sm:text-sm text-center"
                >
                  Source Repo
                </a>
              </div>
            </div>
          </section>

          {/* PROJECT 2: InstaFoods */}
          <section className="stack-card min-h-screen w-full bg-[#0a0b0e] text-white flex flex-col justify-between p-6 sm:p-10 md:p-16 relative overflow-hidden shadow-2xl border-t border-white/10">
            <div className="flex justify-between items-start font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 pt-14 sm:pt-16">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-400 animate-ping"></span>
                // 02. SELECTED WORK &bull; COMMERCE
              </div>
              <div>FULL-STACK REPOSITORY</div>
            </div>

            <div className="my-auto py-6 sm:py-8">
              <div className="font-mono text-xs sm:text-sm md:text-base text-sky-400 uppercase tracking-widest mb-2 sm:mb-3">
                FLUID ORDERING ECOSYSTEM &bull; DYNAMIC CART ARCHITECTURE
              </div>
              <h2 className="hero-title-layer text-[13vw] sm:text-[12vw] md:text-[10vw] text-white tracking-tight hover:text-sky-300 transition">
                &gt; INSTAFOODS &lt;
              </h2>
              <p className="max-w-2xl text-neutral-400 text-xs sm:text-sm md:text-lg mt-3 sm:mt-4 font-light leading-relaxed">
                High-speed, end-to-end food delivery and ordering web application engineered for maximum responsiveness, fluid menu browsing, dynamic cart state management, and streamlined checkout.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-12 sm:pb-14 border-t border-white/10 font-mono text-xs text-neutral-400">
              <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] sm:text-xs">
                  React.js
                </span>
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] sm:text-xs">
                  Redux Toolkit
                </span>
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] sm:text-xs">
                  Tailwind CSS
                </span>
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] sm:text-xs">
                  Python / Node
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-0">
                <a
                  href="https://github.com/rajathos07/InstaFoods"
                  target="_blank"
                  className="px-5 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white text-black hover:bg-sky-400 transition uppercase tracking-wider font-bold text-xs sm:text-sm shadow-lg text-center"
                >
                  Explore InstaFoods Code &rarr;
                </a>
              </div>
            </div>
          </section>

          {/* ==============================================
               SCENE 3: ENGINEERING MASTERY 
          =================================================== --> */}
          <section
            id="tech-stack"
            className="stack-card min-h-screen w-full bg-[#081512] text-white flex flex-col justify-between p-6 sm:p-10 md:p-16 relative overflow-hidden dark-grid border-t border-emerald-500/20"
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex justify-between items-start font-mono text-[10px] sm:text-xs uppercase tracking-widest text-emerald-400 pt-14 sm:pt-16 relative z-10">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping"></span>
                // 03. ENGINEERING MASTERY
              </div>
              <div className="hidden sm:block">REACT &bull; NEXT.JS &bull; TS &bull; PYTHON &bull; FASTAPI</div>
            </div>

            <div className="my-auto py-6 sm:py-10 w-full max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                <div className="lg:col-span-5 space-y-4 sm:space-y-6 tech-animate-left">
                  <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-semibold">
                    ARCHITECTED FOR SCALE
                  </span>
                  <h3 className="hero-title-layer text-4xl sm:text-6xl md:text-7xl leading-none text-white">
                    VISION + NEXT<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
                      FULL-STACK.
                    </span>
                  </h3>
                  <p className="text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                    We engineer award-worthy web applications from pixel-accurate interactive frontends to robust, asynchronous Python APIs.
                  </p>

                  <div
                    id="code-terminal"
                    className="code-window rounded-xl p-3 sm:p-4 font-mono text-[10px] sm:text-xs text-neutral-300 space-y-1.5 sm:space-y-2 mt-2 sm:mt-4 hidden md:block border border-emerald-500/20 bg-[#050d0b]"
                  >
                    <div className="flex items-center gap-1.5 pb-2 border-b border-white/10">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <span className="ml-2 text-neutral-400 text-[9px] sm:text-[10px]">
                        vynex-core // live_stack.ts
                      </span>
                    </div>
                    <div className="text-emerald-400 terminal-line">&gt; export const VYNEX_STACK = &#123;</div>
                    <div className="pl-4 text-neutral-300 terminal-line">
                      frontend: [&quot;Next.js 15&quot;, &quot;TypeScript&quot;, &quot;React&quot;],
                    </div>
                    <div className="pl-4 text-neutral-300 terminal-line">
                      backend: [&quot;Python&quot;, &quot;FastAPI&quot;, &quot;High-Throughput APIs&quot;],
                    </div>
                    <div className="pl-4 text-neutral-300 terminal-line">
                      motion: [&quot;GSAP&quot;, &quot;Lenis&quot;, &quot;Three.js Shaders&quot;],
                    </div>
                    <div className="pl-4 text-emerald-400 terminal-line">
                      performance: &quot;Awwwards-Grade 60FPS&quot;
                    </div>
                    <div className="text-emerald-400 terminal-line">&#125; as const;</div>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 tech-cards-container">
                  <div className="tech-card p-4 sm:p-6 rounded-2xl bg-white/[0.04] border border-emerald-500/20 card-glow transition duration-300 group hover:border-emerald-400/60">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-mono text-xs sm:text-sm font-bold mb-3 sm:mb-4 group-hover:scale-110 transition">
                      01
                    </div>
                    <div className="font-headline text-xl sm:text-2xl text-white tracking-wider">
                      NEXT.JS 15 & REACT
                    </div>
                    <div className="font-mono text-[10px] sm:text-xs text-emerald-400 mt-1 font-semibold">
                      App Router & Turbopack
                    </div>
                    <p className="text-neutral-300 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed">
                      Sub-second loading times, server-side rendering, and responsive architectures.
                    </p>
                  </div>

                  <div className="tech-card p-4 sm:p-6 rounded-2xl bg-white/[0.04] border border-emerald-500/20 card-glow transition duration-300 group hover:border-emerald-400/60">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-mono text-xs sm:text-sm font-bold mb-3 sm:mb-4 group-hover:scale-110 transition">
                      02
                    </div>
                    <div className="font-headline text-xl sm:text-2xl text-white tracking-wider">
                      TYPESCRIPT SYSTEM
                    </div>
                    <div className="font-mono text-[10px] sm:text-xs text-emerald-400 mt-1 font-semibold">
                      Strict Type Schemas
                    </div>
                    <p className="text-neutral-300 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed">
                      Zero runtime crashes with enterprise TypeScript modeling and type inference.
                    </p>
                  </div>

                  <div className="tech-card p-4 sm:p-6 rounded-2xl bg-white/[0.04] border border-emerald-500/20 card-glow transition duration-300 group hover:border-emerald-400/60">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-mono text-xs sm:text-sm font-bold mb-3 sm:mb-4 group-hover:scale-110 transition">
                      03
                    </div>
                    <div className="font-headline text-xl sm:text-2xl text-white tracking-wider">
                      PYTHON & FASTAPI
                    </div>
                    <div className="font-mono text-[10px] sm:text-xs text-emerald-400 mt-1 font-semibold">
                      Async Microservices
                    </div>
                    <p className="text-neutral-300 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed">
                      High-speed asynchronous Python endpoints, AI integrations, and real-time sockets.
                    </p>
                  </div>

                  <div className="tech-card p-4 sm:p-6 rounded-2xl bg-white/[0.04] border border-emerald-500/20 card-glow transition duration-300 group hover:border-emerald-400/60">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-mono text-xs sm:text-sm font-bold mb-3 sm:mb-4 group-hover:scale-110 transition">
                      04
                    </div>
                    <div className="font-headline text-xl sm:text-2xl text-white tracking-wider">
                      GSAP & THREE.JS
                    </div>
                    <div className="font-mono text-[10px] sm:text-xs text-emerald-400 mt-1 font-semibold">
                      Awwwards-Grade Motion
                    </div>
                    <p className="text-neutral-300 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed">
                      Lenis smooth inertial scrolling, custom canvas shaders, and magnetic cursor physics.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-12 sm:pb-14 border-t border-emerald-500/20 font-mono text-[10px] sm:text-xs text-neutral-400 relative z-10">
              <div>
                DEVELOPER: <strong className="text-white">RAJATH</strong> (
                <a
                  href="https://portfolio-blue-two-54.vercel.app/"
                  target="_blank"
                  className="text-emerald-400 hover:underline font-bold"
                >
                  Portfolio &nearr;
                </a>
                {" "}&bull;{" "}
                <a
                  href="https://github.com/rajathos07"
                  target="_blank"
                  className="text-neutral-400 hover:text-white hover:underline"
                >
                  GitHub
                </a>
                )
              </div>
              <div>
                FREELANCE LEAD: <strong className="text-white">IFHAAM</strong> (80888 33827)
              </div>
            </div>
          </section>

          {/* ==============================================
               SCENE 4: LET'S COLLABORATE 
          =================================================== --> */}
          <section
            id="contact"
            className="stack-card min-h-screen w-full bg-[#f5ebe4] text-neutral-900 flex flex-col justify-between p-6 sm:p-10 md:p-16 relative overflow-hidden border-t border-neutral-300"
          >
            <div className="flex justify-between items-start font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-600 pt-14 sm:pt-16">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                // 04. DIRECT COLLABORATION
              </div>
              <div className="hidden xs:block font-semibold">AVAILABLE FOR BOOKINGS</div>
            </div>

            <div className="my-auto py-6 sm:py-10 w-full max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                <div className="lg:col-span-7 space-y-4 sm:space-y-6 contact-animate-left">
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                    [ START YOUR PROJECT TODAY ]
                  </span>
                  <h2 className="hero-title-layer text-[13.5vw] sm:text-[11vw] md:text-[9vw] leading-none contact-headline">
                    NEXT STARTS<br />
                    <span className="text-vynex-purple">RIGHT HERE.</span>
                  </h2>
                  <p className="text-neutral-600 text-xs sm:text-base md:text-xl font-light leading-relaxed max-w-xl">
                    Ready to elevate your digital presence with award-caliber interactive experiences and robust full-stack systems? Connect with Rajath and Ifhaam today.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2 contact-buttons-wrap">
                    <a
                      href="tel:8088833827"
                      className="contact-btn px-5 py-3 sm:px-8 sm:py-4 bg-neutral-950 text-white font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold hover:bg-vynex-purple transition rounded-full shadow-xl flex items-center gap-2"
                    >
                      <span>📞</span> Call: 80888 33827
                    </a>
                    <a
                      href="https://wa.me/918088833827?text=Hi%20Ifhaam,%20I'm%20interested%20in%20discussing%20a%20project%20with%20VYNEX"
                      target="_blank"
                      className="contact-btn px-5 py-3 sm:px-8 sm:py-4 border-2 border-neutral-900 text-neutral-900 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold hover:bg-neutral-900 hover:text-white transition rounded-full flex items-center gap-2"
                    >
                      <span>💬</span> WhatsApp Ifhaam &rarr;
                    </a>
                    <a
                      href="https://portfolio-blue-two-54.vercel.app/"
                      target="_blank"
                      className="contact-btn px-4 py-3 sm:px-6 sm:py-4 bg-white border border-neutral-300 text-neutral-900 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold hover:border-neutral-900 transition rounded-full flex items-center gap-1.5"
                    >
                      <span>🚀</span> Rajath&apos;s Portfolio &rarr;
                    </a>
                    <a
                      href="https://github.com/rajathos07"
                      target="_blank"
                      className="contact-btn px-4 py-3 sm:px-6 sm:py-4 bg-white border border-neutral-300 text-neutral-900 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold hover:border-neutral-900 transition rounded-full"
                    >
                      GitHub &rarr;
                    </a>
                  </div>
                </div>

                {/* Pulse Glowing Dispatch Box */}
                <div className="lg:col-span-5 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-neutral-200/80 space-y-4 sm:space-y-5 pulse-card contact-animate-right mt-4 lg:mt-0">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                    <span className="font-mono text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                      Direct Hotline &bull; Quick Dispatch
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono text-emerald-600 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Now
                    </span>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50/80 border border-neutral-200/80 hover:border-vynex-purple transition duration-200 group">
                      <div className="text-[10px] sm:text-[11px] font-mono text-neutral-500 uppercase">
                        Freelance Project Lead
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5 group-hover:text-vynex-purple transition">
                        Ifhaam
                      </div>
                      <a
                        href="tel:8088833827"
                        className="text-sm sm:text-base font-mono text-vynex-purple font-bold hover:underline block mt-0.5 sm:mt-1"
                      >
                        +91 80888 33827
                      </a>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50/80 border border-neutral-200/80 hover:border-sky-500 transition duration-200 group">
                      <div className="text-[10px] sm:text-[11px] font-mono text-neutral-500 uppercase">
                        Full-Stack Developer
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5 group-hover:text-sky-600 transition">
                        Rajath
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 font-mono text-xs sm:text-sm">
                        <a
                          href="https://portfolio-blue-two-54.vercel.app/"
                          target="_blank"
                          className="font-bold text-sky-600 hover:underline flex items-center gap-1"
                        >
                          View Portfolio &nearr;
                        </a>
                        <span className="text-neutral-300 hidden sm:inline">&bull;</span>
                        <a
                          href="https://github.com/rajathos07"
                          target="_blank"
                          className="text-neutral-600 hover:text-black hover:underline"
                        >
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 sm:pt-2 text-center">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-emerald-800 bg-emerald-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-200 w-full justify-center font-medium">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Taking new inquiries for 2026
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pb-12 sm:pb-14 border-t border-neutral-300 font-mono text-[10px] sm:text-xs text-neutral-500 gap-2 sm:gap-4 font-medium">
              <div>&copy; 2026 VYNEX &bull; Vision + Next. Next Starts Here.</div>
              <div>
                Developer: <strong>Rajath</strong> &bull; Freelance: <strong>Ifhaam (80888 33827)</strong>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
