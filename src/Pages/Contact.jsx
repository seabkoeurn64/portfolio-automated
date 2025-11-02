import React, { useState, useEffect } from "react";
import { Share2, User, Mail, MessageSquare, Send } from "lucide-react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import SocialLinks from "../components/SocialLinks";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    AOS.init({ once: true });
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(getCambodiaTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getCambodiaTime = () => {
    return new Date().toLocaleString('en-KH', {
      timeZone: 'Asia/Phnom_Penh',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendToTelegram = async (data) => {
    try {
      const TELEGRAM_BOT_TOKEN = '8406477017:AAGpDTbR6ORMQ7a9Nks-UNteXwtMLckxefI';
      const TELEGRAM_CHAT_ID = '7817470099';
      
      const message = `📧 New Message From Portfolio Website\n\n👤 Name: ${data.name}\n📧 Email: ${data.email}\n💬 Message: ${data.message}\n⏰ Time: ${getCambodiaTime()} (UTC+7)`;

      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.ok) {
        return { success: true };
      } else {
        console.error('Telegram API Error:', result);
        return { 
          success: false, 
          error: result.description || 'Failed to send message' 
        };
      }
    } catch (error) {
      console.error('Network Error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your internet connection.' 
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        title: "Incomplete Form",
        text: "Please fill in all fields",
        icon: "warning",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    setIsSubmitting(true);

    Swal.fire({
      title: "Sending Message...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const telegramResult = await sendToTelegram(formData);
      
      if (!telegramResult.success) {
        throw new Error(telegramResult.error);
      }

      Swal.fire({
        title: "Success! 🎉",
        text: "Your message has been sent successfully!",
        icon: "success",
        confirmButtonColor: "#6366f1",
        timer: 3000,
      });

      setFormData({ name: "", email: "", message: "" });
      
    } catch (error) {
      Swal.fire({
        title: "Failed to Send",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-5 sm:px-5 lg:px-10">
      {/* Title Section */}
      <div className="text-center lg:mt-20 mt-10 mb-2">
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
        >
          Contact Me
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2"
        >
          Have questions? Send me a message and I'll get back to you soon.
        </p>
      </div>

      {/* Contact Form */}
      <div className="py-10 flex items-center justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div 
            data-aos="fade-right"
            data-aos-duration="1000"
            className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                  Get In Touch
                </h2>
                <p className="text-gray-400">
                  Send me a message and I'll respond promptly.
                </p>
              </div>
              <Share2 className="w-10 h-10 text-[#6366f1] opacity-50 flex-shrink-0" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div data-aos="fade-up" data-aos-delay="100" className="relative">
                <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]/50 transition-all duration-300"
                  required
                />
              </div>

              <div data-aos="fade-up" data-aos-delay="200" className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]/50 transition-all duration-300"
                  required
                />
              </div>

              <div data-aos="fade-up" data-aos-delay="300" className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full resize-none p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]/50 transition-all duration-300"
                  required
                />
              </div>

              <button
                data-aos="fade-up"
                data-aos-delay="400"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10">
              <SocialLinks />
            </div>
          </div>

          {/* Info Section */}
          <div 
            data-aos="fade-left"
            data-aos-duration="1000"
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            <h3 className="text-2xl font-semibold text-[#a855f7] mb-6">Contact Information</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Based in Cambodia 🇰🇭. Your messages are sent directly to my Telegram for instant delivery.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <p className="text-blue-400 text-sm">
                  <strong>📍 Cambodia Time (UTC+7)</strong>
                </p>
              </div>
              
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <p className="text-green-400 text-sm">
                  <strong>⚡ Quick Response</strong> - Usually within hours
                </p>
              </div>
              
              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <p className="text-purple-400 text-sm">
                  <strong>🔒 Secure & Private</strong> - Your data is protected
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 mb-4">
              <p className="text-amber-400 text-sm font-medium">
                ⏰ Current Cambodia Time: {currentTime || getCambodiaTime()}
              </p>
            </div>

            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <p className="text-emerald-400 text-sm">
                <strong>📱 Telegram:</strong> @Contactp7777_bot
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;