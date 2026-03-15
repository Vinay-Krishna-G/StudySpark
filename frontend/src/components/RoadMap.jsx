import React from "react";
import { motion } from "framer-motion";

const Roadmap = () => {
  const steps = [
    {
      phase: "01",
      title: "Days 1–15 · Core Foundations",
      desc: "Complete 15 high-weightage scoring topics across Physics, Chemistry & Math. Deep clarity. PYQs from the last 10 years. No fluff.",
      bullets: [
        "Concept Reinforcement",
        "Formula Precision",
        "PYQ Pattern Mastery"
      ]
    },
    {
      phase: "02",
      title: "Days 16–30 · Advanced Application",
      desc: "20+ mixed-difficulty topics with timed execution. Real exam-style thinking. Improve speed without sacrificing accuracy.",
      bullets: [
        "Multi-Concept Questions",
        "Timed Practice Blocks",
        "Error Log System"
      ]
    },
    {
      phase: "03",
      title: "Days 31–40 · Integration Phase",
      desc: "Full-length topic integration drills. Question selection intelligence. Strategic skipping mastery.",
      bullets: [
        "Mixed Section Drills",
        "Speed Calibration",
        "Accuracy Optimization"
      ]
    },
    {
      phase: "04",
      title: "Days 41–45 · Rank Acceleration",
      desc: "Rapid revision of 45+ topics. Eliminate weak zones. Maximize scoring consistency before exam day.",
      bullets: [
        "Smart Revision Loops",
        "Mistake Elimination",
        "Final Rank Strategy"
      ]
    }
  ];

  return (
    <section id="roadmap" className="relative py-32 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            45 Days. <span className="text-accent">45+ Topics.</span>
          </h2>
          <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            A structured execution roadmap engineered for maximum marks. Every day has a scoring purpose.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">

          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-accent/40 via-accent to-accent/40" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`relative mb-8 flex items-center ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              {/* Content Box */}
              <div className="w-full md:w-[45%] relative group">

                {/* Phase watermark */}
                <div className="absolute -top-12 text-[120px] font-extrabold text-accent/5 select-none">
                  {step.phase}
                </div>

                <div className="relative p-5 rounded-3xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-2xl hover:shadow-accent/20 transition-all duration-500">

                  <h3 className="text-2xl font-bold mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                    {step.desc}
                  </p>

                  <ul className="space-y-2">
                    {step.bullets.map((item) => (
                      <li
                        key={item}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-3"
                      >
                        <span className="w-2 h-2 bg-accent rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Center Dot */}
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-accent shadow-lg shadow-accent/50 border-4 border-white dark:border-black" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;