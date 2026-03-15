import React from 'react';
import { Users, Award, ShieldCheck, Cpu } from 'lucide-react';

const SocialProof = () => {
    const stats = [
        { icon: <Users className="text-accent" />, label: 'Trusted by 1,200+', subtext: 'Aspirants' },
        { icon: <Award className="text-accent" />, label: 'Built by EAMCET', subtext: 'Top Rankers' },
        { icon: <Cpu className="text-accent" />, label: 'AI-Driven', subtext: 'Evaluation' },
        { icon: <ShieldCheck className="text-accent" />, label: '98% Success', subtext: 'Rate' },
    ];

    return (
        <div className="py-12 border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="font-bold text-lg leading-tight">{stat.label}</p>
                                <p className="text-xs text-gray-500  tracking-wider font-semibold">{stat.subtext}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialProof;
