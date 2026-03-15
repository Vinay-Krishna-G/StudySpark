import React from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';

const Contact = () => {
    return (
        <>
            <section id="contact" className="section-padding">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 backdrop-blur-sm bg-accent/5 rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
                        {/* Subtle background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 font-display">
                                Have questions? <br /> <span className="text-accent">Let's talk.</span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
                                We're here to help you navigate through your final preparation stretch. Reach out to us anytime.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Us</p>
                                        <p className="font-bold">support@studysparks.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-green-500 text-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">WhatsApp Support</p>
                                        <p className="font-bold">+91 98765 43210</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className="relative z-10 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-accent/10 space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Name</label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Message</label>
                                <textarea
                                    rows="4"
                                    placeholder="How can we help?"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                                ></textarea>
                            </div>
                            <button className="w-full btn-primary flex items-center justify-center py-4 text-lg">
                                Send Message <Send className="ml-2" size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="section-padding relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center">

                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-8">
                        Start Your <span className="text-accent">45-Day Rank Transformation</span> Today
                    </h2>

                    <p className="text-gray-400 text-md mb-12 max-w-2xl mx-auto">
                        Stop guessing. Follow a structured roadmap built for serious EAMCET aspirants.
                        Your rank is decided in the next 45 days.
                    </p>

                    <a
                        href="/register"
                        className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 transition-all duration-300"
                    >
                        Get Started Now
                    </a>

                </div>
            </section>
        </>
    );
};

export default Contact;
