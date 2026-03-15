import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
const faqs = [
    {
        q: "Is 45 days enough to crack EAMCET?",
        a: "Yes — if you focus only on high-weightage scoring topics. This system eliminates low-ROI chapters and concentrates on 45+ proven topics that historically contribute the most marks."
    },
    {
        q: "What exactly happens during the 45 days?",
        a: "Each day focuses on one carefully selected topic with structured practice, PYQs, and revision checkpoints. The goal is consistent daily execution, not random studying."
    },
    {
        q: "Is this suitable for beginners?",
        a: "Yes. The roadmap starts with core foundational topics before moving into advanced and mixed-difficulty problems. Even if you're starting late, the structure keeps you focused."
    },
    {
        q: "Does this include mock tests?",
        a: "The system includes topic-wise drills and mixed practice sets. Full-length mock tests can be added separately depending on your preparation stage."
    },
    {
        q: "Does it cover both AP and TS EAMCET?",
        a: "Yes. The selected 45+ topics are aligned with the EAMCET syllabus and applicable for both AP EAPCET and TS EAMCET patterns."
    }
];

    return (
        <section id="faq" className="section-padding bg-gray-50/50 dark:bg-gray-900/10">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 font-display">
                        Frequently Asked <span className="text-accent">Questions</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Everything you need to know about the platform and your preparation.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} faq={faq} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const FAQItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
                <span className="font-bold pr-8">{faq.q}</span>
                {isOpen ? <ChevronUp size={20} className="text-accent" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-800/50">
                            {faq.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FAQ;
