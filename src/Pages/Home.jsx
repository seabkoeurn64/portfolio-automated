import React, { useState, useEffect, useCallback, memo } from "react";
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import AOS from "aos";
import "aos/dist/aos.css";

// --- Constants ---
const WORDS = [
  "Poster Design",
  "Logo Design", 
  "Banner Design",
  "Name Card Design",
  "Flyer Design",
  "Social Media Graphics",
  "Branding Materials"
];

const TECH_STACK = ["Photoshop", "Illustrator", "Figma", "Canva"]; 

const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/seabkoeurn65" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/koeurn65/" },
  { icon: Instagram, link: "https://www.instagram.com/koeurn._/?hl=id" },
];

const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;

// --- Memoized Components ---
const StatusBadge = memo(() => (
  <div className="inline-block animate-float mx-auto lg:mx-0" title="Designer" data-aos="fade-down" data-aos-duration="600">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-xs font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
          Designer
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(() => (
  <div className="space-y-2 text-center lg:text-left" data-aos="fade-right" data-aos-duration="800">
    <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">Graphic</span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">Design</span>
      </span>
    </h1>
  </div>
));

const TechStackBadge = memo(({ tech }) => (
  <div className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">{tech}</div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href} className="w-full sm:w-auto">
    <button className="group relative w-full sm:w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">{text}</span>
          <Icon className={`w-4 h-4 text-gray-200 transform transition-all duration-300 z-10 ${text === "Contact" ? "group-hover:translate-x-1" : "group-hover:rotate-45"}`} />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-3">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

// --- Main Component ---
const Home = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for conditional rendering/scaling
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // AOS initialization
  useEffect(() => {
    AOS.init({ once: true, offset: 50, duration: 800 });
    AOS.refresh();
    window.addEventListener("resize", () => AOS.refresh());
    return () => window.removeEventListener("resize", () => AOS.refresh());
  }, []);

  // Typing effect
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText((prev) => prev + WORDS[wordIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(handleTyping, isTyping ? TYPING_SPEED : ERASING_SPEED);
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  // Lottie options
  const lottieOptions = {
    src: "/animations/myAnimation.json",
    loop: true,
    autoplay: true,
    style: { width: "100%", height: "100%" },
    className: `w-full h-full transition-all duration-500 
      ${
        isHovering
          ? "scale-[180%] sm:scale-[160%] lg:scale-[145%] rotate-2"
          : isMobile
          ? "scale-[120%]" 
          : "scale-[140%]" 
      }`,
  };

  return (
    <section id="Home" className="min-h-screen bg-[#030014] px-[5%] sm:px-[5%] lg:px-[10%] flex items-center justify-center pt-24 pb-12 lg:py-0">
      <div className="container mx-auto">
        {/* Mobile Layout: Stacked vertically with animation below header */}
        <div className="lg:hidden flex flex-col items-center gap-8">
          {/* Header Section with Status Badge and Title */}
          <div className="w-full flex flex-col gap-6 text-center">
            <StatusBadge />
            <MainTitle />
          </div>

          {/* Lottie Animation - Below header on mobile */}
          <div
            className="w-full h-[300px] sm:h-[400px] relative flex items-center justify-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out"></div>
            <DotLottieReact {...lottieOptions} />
          </div>

          {/* Content Section */}
          <div className="w-full flex flex-col gap-6 text-center">
            {/* Typing Effect */}
            <div className="h-8 flex items-center justify-center" data-aos="fade-up" data-aos-duration="1000">
              <span className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">{text}</span>
              <span className="w-[3px] h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed font-light" data-aos="fade-up" data-aos-duration="1200">
              I craft <strong className="highlight">visually compelling</strong> and user-centered designs that solve real-world problems and amplify brand narratives through creative storytelling.
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-3 justify-center" data-aos="fade-up" data-aos-duration="1400">
              {TECH_STACK.map((tech, index) => (
                <TechStackBadge key={index} tech={tech} />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center" data-aos="fade-up" data-aos-duration="1600">
              <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
              <CTAButton href="#Contact" text="Contact" icon={Mail} />
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-4 justify-center" data-aos="fade-up" data-aos-duration="1800">
              {SOCIAL_LINKS.map((social, index) => (
                <SocialLink key={index} {...social} />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout: Standard side-by-side */}
        <div className="hidden lg:flex flex-row items-center gap-16">
          {/* Left Column (Text Content) */}
          <div className="w-1/2 flex flex-col gap-6 text-left">
            <StatusBadge />
            <MainTitle />

            {/* Typing Effect */}
            <div className="h-8 flex items-center justify-start" data-aos="fade-up" data-aos-duration="1000">
              <span className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">{text}</span>
              <span className="w-[3px] h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light" data-aos="fade-up" data-aos-duration="1200">
              I craft <strong className="highlight">visually compelling</strong> and user-centered designs that solve real-world problems and amplify brand narratives through creative storytelling.
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-duration="1400">
              {TECH_STACK.map((tech, index) => (
                <TechStackBadge key={index} tech={tech} />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-3 mt-4 justify-start" data-aos="fade-up" data-aos-duration="1600">
              <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
              <CTAButton href="#Contact" text="Contact" icon={Mail} />
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-4 justify-start" data-aos="fade-up" data-aos-duration="1800">
              {SOCIAL_LINKS.map((social, index) => (
                <SocialLink key={index} {...social} />
              ))}
            </div>
          </div>

          {/* Right Column - Lottie */}
          <div
            className="w-1/2 h-[600px] relative flex items-center justify-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out"></div>
            <DotLottieReact {...lottieOptions} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Home);