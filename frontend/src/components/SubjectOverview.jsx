import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Atom, FlaskConical, Leaf, ArrowRight } from 'lucide-react';

const SubjectOverview = () => {
    const subjects = [
        {
            name: 'Mathematics',
            icon: <Calculator className="text-blue-500" />,
            topics: 45,
            tests: 120,
            weightage: '35%',
            description: 'Master calculus, algebra, and coordinate geometry with our comprehensive practice modules.',
        },
        {
            name: 'Physics',
            icon: <Atom className="text-purple-500" />,
            topics: 32,
            tests: 95,
            weightage: '30%',
            description: 'Understand mechanics, electricity, and modern physics through targeted practice sessions.',
        },
        {
            name: 'Chemistry',
            icon: <FlaskConical className="text-green-500" />,
            topics: 28,
            tests: 85,
            weightage: '25%',
            description: 'Excel in organic, inorganic, and physical chemistry with our structured learning approach.',
        },
        {
            name: 'Biology',
            icon: <Leaf className="text-emerald-500" />,
            topics: 35,
            tests: 100,
            weightage: '10%',
            description: 'Cover botany, zoology, and biotechnology with our detailed study materials.',
        },
    ];

    return (
        <section id="subjects" className="section-padding bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 font-display">
                        Subject-Wise <span className="text-accent">Overview</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Comprehensive preparation across all subjects with topic-wise breakdown and practice tests designed for EAMCET success.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {subjects.map((subject, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="p-4 rounded-3xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                {subject.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-3">{subject.name}</h3>

                            <div className="space-y-3 mb-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Topics</span>
                                    <span className="font-semibold text-accent">{subject.topics}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Tests</span>
                                    <span className="font-semibold text-accent">{subject.tests}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Weightage</span>
                                    <span className="font-semibold text-accent">{subject.weightage}</span>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                                {subject.description}
                            </p>

                            <button className="w-full btn-primary flex items-center justify-center group-hover:bg-accent/90 transition-colors">
                                Practice Now <ArrowRight className="ml-2" size={16} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SubjectOverview;