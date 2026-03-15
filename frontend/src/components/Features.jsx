import React from 'react';
import { motion } from 'framer-motion';
import { Target, BookOpen, BarChart3, Zap, Bookmark, Trophy } from 'lucide-react';

const Features = () => {
    const features = [
        {
            title: 'Rank-Oriented Roadmap',
            desc: '45-day plan focusing on high-weightage topics that historically yield 80%+ of questions.',
            icon: <Target className="text-blue-500" />,
        },
        {
            title: 'Daily Topic-Wise Practice',
            desc: 'Handpicked problems that mirror EAMCET level, ensuring you spend time on relevant prep.',
            icon: <BookOpen className="text-indigo-500" />,
        },
        {
            title: 'AI Mistake Analysis',
            desc: 'Get instant AI-generated explanations that tell you exactly where you went wrong and how to fix it.',
            icon: <Zap className="text-yellow-500" />,
        },
        {
            title: 'Progress Tracking',
            desc: 'Visualize your growth with advanced analytics and predicted rank based on current performance.',
            icon: <BarChart3 className="text-green-500" />,
        },
        {
            title: 'Smart Revision System',
            desc: 'Bookmark tricky questions and revisit them later with our specialized revision module.',
            icon: <Bookmark className="text-purple-500" />,
        },
        {
            title: 'Real-Time Leaderboard',
            desc: 'Compete with thousands of aspirants and see where you stand in the state-level competition.',
            icon: <Trophy className="text-orange-500" />,
        },
    ];

    return (
        <section id="features" className="section-padding bg-gray-50/50 dark:bg-gray-900/10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 font-display">
                            Everything You Need to <br /><span className="text-accent">Secure a Top Rank</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Stop guessing. Start practicing with precision. We provide the tools used by EAMCET toppers to streamline their preparation.
                        </p>
                    </div>
                    <button className="btn-secondary whitespace-nowrap">Explore All Features</button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
