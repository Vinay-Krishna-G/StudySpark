import React from "react";
import { ClipboardList, Map, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Unlock 45+ Scoring Topics",
      desc: "Get instant access to a curated list of 45+ high-weightage topics across Physics, Chemistry, and Math — selected purely for maximum marks.",
      icon: <ClipboardList />,
    },
    {
      title: "Follow the 45-Day Plan",
      desc: "Execute one focused topic per day with structured practice, PYQs, and revision checkpoints. No random studying. No wasted effort.",
      icon: <Map />,
    },
    {
      title: "Revise & Maximize Score",
      desc: "Reinforce weak areas, eliminate repeat mistakes, and optimize question selection strategy before exam day.",
      icon: <TrendingUp />,
    },
  ];

  return (
    <section className="section-padding bg-accent text-white rounded-[3rem] mx-6 md:mx-12 my-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 font-display">
            How It Works
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Three simple steps to transition from stressed aspirant to confident
            topper.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-white/20 z-0" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-white text-accent flex items-center justify-center mb-8 shadow-xl shadow-black/10">
                {step.icon}
              </div>
              <div className="w-8 h-8 rounded-full bg-white text-accent font-bold mb-4 flex items-center justify-center text-sm shadow-lg">
                0{index + 1}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-white/80 leading-relaxed text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
