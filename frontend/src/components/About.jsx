import React from 'react';

const About = () => {
    return (
        <section className="section-padding">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-8 font-display leading-tight">
                        We built StudySparks because <br /> <span className="text-accent underline decoration-accent/20">precision matters.</span>
                    </h2>
                    <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        <p>
                            Most students fail not due to lack of effort, but due to lack of direction. In the 45 days leading up to EAMCET, what you study is as important as how you study.
                        </p>
                        <p>
                            Our philosophy is simple: <span className="font-bold text-black dark:text-white">Precision &gt; Volume</span>. We use data from a decade of exams to point you exactly where the marks are.
                        </p>
                        <div className="pt-4 flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center font-bold text-accent">SS</div>
                            <div>
                                <p className="font-bold text-black dark:text-white">The StudySparks Team</p>
                                <p className="text-sm">Ex-EAMCET Toppers</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                            alt="Team"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-6 -right-6 p-6 glass rounded-2xl shadow-xl max-w-[240px]">
                        <p className="italic text-sm">"Our mission is to democratize high-end coaching for every EAMCET aspirant in Andhra Pradesh & Telangana."</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
