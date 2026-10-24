"use client"
import { useState } from "react";
import NavBar from "./component/navBar/NavBar";
import Hero from "./component/Hero/Hero-Section";
import About from "./component/About/About";
import CatlogSection from "./component/catalog/Catelog-Section";
import ProcessSection from "./component/process/ProcesSection";
import Testimonial from "./component/Testimonial/Testimonial";
import Footer from "./component/Footer/footer";
import WhyUs from "./component/WhyUs/whyus";
import Export from "./component/export/export";
import GranituraMobileNav from "./mobile-responsive/MobNavbar";
import MobExport from "../app/component/export/mobExport";
import GraniteLoader from "../app/component/Loading/GranituraLoading";


export default function Home() {
    const [loading, setLoading] = useState(true);

  return (   
     <>
      {loading && (
  <GraniteLoader
    duration={3200}
    onComplete={() => setLoading(false)}
  />
)}

    {/* Desktop + Tablet */}
      <div className="desktop-nav">
        <NavBar />
      </div>

      {/* Mobile */}
      <div className="mobile-nav">
        <GranituraMobileNav />
      </div>
     <Hero/>
      <CatlogSection/>
      
     <div className="desktop-nav">
 <Export />
     </div>
    {/* <div className="mobile-nav">
        <MobExport/>
      </div> */}
      <About/>
     
      <ProcessSection/>
      <WhyUs />
      <Testimonial />
      <Footer/>
       </>
    
  );
}
