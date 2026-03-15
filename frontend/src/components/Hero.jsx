import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate()
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-[14px] font-semibold">EAMCET 2026 Appearing Soon</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 font-display">
            Crack EAMCET in{" "}
            <span className="text-accent underline decoration-accent/30 underline-offset-8" >
              45 Days
            </span>
          </h1>

          <p className="text-md text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
            With a plan that actually works. 45-day structured roadmap, 45+
            high-yield topics, and AI-powered mistake analysis.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <button className="btn-primary text-[15px] flex items-center justify-center" onClick={() => navigate("/register")}>
              Start Learning <ArrowRight className="ml-2" size={18} />
            </button>
            <button className="btn-secondary text-[15px] flex items-center justify-center" onClick={() => navigate("/plan")}>
              View 45-Day Plan
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex -space-x-3 items-center">
              {[
                "https://randomuser.me/api/portraits/men/32.jpg",
                "https://randomuser.me/api/portraits/women/44.jpg",
                "https://randomuser.me/api/portraits/men/76.jpg",
                "https://randomuser.me/api/portraits/women/65.jpg",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`User ${i + 1}`}
                  className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ))}

              <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-900 text-white text-xs flex items-center justify-center font-semibold">
                +12
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              1.2k+ Aspirants Joined
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex  items-center space-x-2">
              <CheckCircle size={16} className="text-accent" />
              <span>Designed by Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className="text-accent" />
              <span>Rank-oriented preparation</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 dark:border-gray-900/50">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
              alt="EAMCET Preparation"
              className="w-full h-auto transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <div className="flex items-center space-x-4 text-white">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/80 backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                  <Play fill="white" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-lg">Watch Success Stories</p>
                  <p className="text-xs text-white/70">
                    1200+ Students already joined
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating UI Elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 -right-10 glass p-4 rounded-xl shadow-xl z-20 hidden lg:block"
          >
            <p className="text-accent font-bold text-2xl">Get</p>
            <p className="text-xs text-gray-500">Highest Rank 2026</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-10 -left-10 glass p-4 rounded-xl shadow-xl z-20 hidden lg:block"
          >
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle size={16} className="text-accent" />
              <span className="text-xs text-gray-500 font-medium">95% Success Rate</span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Proven Results</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
