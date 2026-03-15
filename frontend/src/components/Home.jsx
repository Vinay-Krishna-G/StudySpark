import React from "react";
import Hero from "./Hero";
import SocialProof from "./SocialsProof";
import SubjectOverview from "./SubjectOverview";
import Roadmap from "./RoadMap";
import Features from "./Features";
import Comparison from "./Comparison";
import HowItWorks from "./HowItWorks";
import About from "./About";
import Contact from "./Contact";
import FAQ from "./FAQ";
import Footer from "./Footer";

const Home = () => {
    return (
        <div className="w-full">
            <Hero />
            <SocialProof />
            <SubjectOverview />
            <Roadmap />
            <Features />
            <Comparison />
            <HowItWorks />
            <About />
            <Contact />
            <FAQ />
            <Footer />
        </div>
    )
}
export default Home;