


import Header from "@/components/Header";

import Hero from "@/components/Hero";
import LogoTicker from "@/components/LogoTicker";
import { FeaturesSection } from "@/components/FeaturesSection";
import Working from "@/components/Working";
import CallAction from "@/components/CallAction";
import Footer from "@/components/Footer";



export default function Home() {
  return (
    <>
      {/* <StarsBackground/> */}
      <Header/>
      <Hero/>
      <LogoTicker/>
      <FeaturesSection/>
      <Working/>
      <CallAction/>
      <Footer/>
    </>
  );
}
