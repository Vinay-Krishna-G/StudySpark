import React from 'react';
import { X, Check } from 'lucide-react';

const Comparison = () => {
    const data = [
        { label: 'Study Plan', without: 'Random YouTube prep', with: 'Structured 45-day roadmap' },
        { label: 'Topic Focus', without: 'No idea what’s important', with: 'High-weight topics only' },
        { label: 'Problem Solving', without: 'Guess why answers are wrong', with: 'AI explains exact mistake' },
        { label: 'Tracking', without: 'No performance tracking', with: 'Rank & accuracy tracking' },
        { label: 'Result', without: 'Panic before exam', with: 'Controlled revision plan' },
    ];

    return (
        <section id="compare" className="section-padding overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 font-display">
                        Why Choose <span className="text-accent">StudySparks?</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Compare the difference between traditional random preparation and our precision-driven approach.
                    </p>
                </div>

                <div className="rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900">
                                <th className="p-6 font-bold text-lg">Feature</th>
                                <th className="p-6 font-bold text-lg text-red-500">Without Us</th>
                                <th className="p-6 font-bold text-lg text-accent">With StudySparks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                    <td className="p-6 font-medium text-gray-700 dark:text-gray-300">{row.label}</td>
                                    <td className="p-6 text-sm text-gray-500 flex items-center space-x-2">
                                        <X size={16} className="text-red-500 shrink-0" />
                                        <span>{row.without}</span>
                                    </td>
                                    <td className="p-6 text-sm font-semibold text-gray-900 dark:text-white">
                                        <div className="flex items-center space-x-2">
                                            <Check size={16} className="text-green-500 shrink-0" />
                                            <span>{row.with}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-8 bg-accent/5 flex flex-col items-center">
                        <p className="font-bold text-center mb-4">Ready to fix your preparation strategy?</p>
                        <button className="btn-primary">Get Access Now</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Comparison;
