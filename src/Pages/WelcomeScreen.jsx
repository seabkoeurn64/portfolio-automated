import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, User, MessageCircle } from 'lucide-react';
import { Telegram } from '@mui/icons-material';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Safe TypewriterEffect
const TypewriterEffect = ({ text = '' }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 260);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Background effect
const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-purple-600/10 blur-2xl animate-float" />
  </div>
);

// Safe IconButton
const IconButton = ({ Icon }) => {
  if (!Icon) return null; // prevent crash if icon is undefined
  return (
    <div className="relative group hover:scale-110 transition-transform duration-300">
      <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-300" />
      <div className="relative p-2 sm:p-3 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
      </div>
    </div>
  );
};

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize AOS safely
    if (AOS && AOS.init) {
      AOS.init({ duration: 1000, once: false, mirror: false });
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      if (typeof onLoadingComplete === 'function') {
        setTimeout(onLoadingComplete, 1000);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
      transition: { duration: 0.8, ease: "easeInOut", when: "beforeChildren", staggerChildren: 0.1 }
    }
  };

  const childVariants = {
    exit: { y: -20, opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }
  };

  const icons = [Palette, User, MessageCircle]; // Updated icons - MessageCircle for messaging/telegram

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#030014]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
        >
          <BackgroundEffect />

          <div className="relative min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-4xl mx-auto">
              {/* Icons */}
              <motion.div className="flex justify-center gap-3 sm:gap-4 md:gap-8 mb-6 sm:mb-8 md:mb-12" variants={childVariants}>
                {icons.map((Icon, index) => (
                  <div key={index} data-aos="fade-down" data-aos-delay={index * 200}>
                    <IconButton Icon={Icon} />
                  </div>
                ))}
              </motion.div>

              {/* Welcome Text */}
              <motion.div className="text-center mb-6 sm:mb-8 md:mb-12" variants={childVariants}>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold space-y-2 sm:space-y-4">
                  <div className="mb-2 sm:mb-4">
                    {['Welcome', 'To', 'Koeurn'].map((word, i) => (
                      <span
                        key={i}
                        data-aos="fade-right"
                        data-aos-delay={200 + i * 200}
                        className="inline-block px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                  <div>
                    {['Graphic', 'Design'].map((word, i) => (
                      <span
                        key={i}
                        data-aos="fade-up"
                        data-aos-delay={800 + i * 200}
                        className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </h1>
              </motion.div>

              {/* Telegram Link */}
              <motion.div className="text-center" variants={childVariants} data-aos="fade-up" data-aos-delay="1200">
                <a
                  href="https://t.me/koeurn65/"
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full relative group hover:scale-105 transition-transform duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                  <div className="relative flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
                    <Telegram className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      <TypewriterEffect text="koeurn65" />
                    </span>
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;