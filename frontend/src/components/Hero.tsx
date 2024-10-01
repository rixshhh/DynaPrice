"use client"
import React from "react";
import { Button } from "./ui/moving-border";
import { StarsBackground } from "./ui/stars-background";
import {motion} from "framer-motion"

function Hero() {
  return (
    <section className="h-[492px] md:h-[800px] flex items-center overflow-hidden relative [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <StarsBackground />

      <div className="absolute inset-0 bg-[radial-gradient(75%_75%_at_center_center,rgb(140,69,255,.5)_15%,rgb(14,0,36,.5)_78%,transparent)]"></div>

      {/* PL 1 */}
      <div className="absolute h-64 w-64 md:h-96 md:w-96 bg-purple-500 rounded-full border border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(50%_50%_at_16.8%_18.3%,white,rgb(184,148,255)_37.7%,rgb(24,0,66))] shadow-[-20px_-20px_50px_rgb(255,255,255,.5),-20px_-20px_50px_rgb(255,255,255,.1),0_0_50px_rgb(140,69,255)]"></div>
      {/* PL 1 */}

      {/* R 1 */}
      <motion.div
      style={{
        translateY: "-50%",
        translateX: "-50%"
      }}
      
      animate={{
        rotate:"1turn",
      }}
      transition={{
        duration: 60,
        repeat: Infinity,
        ease: "linear"
      }}
      
      className="absolute h-[344px] w-[344px] md:h-[580px] md:w-[580px] border border-white  opacity-20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute h-2 w-2  left-0 bg-white rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute h-2 w-2  left-1/2 bg-white rounded-full top-0 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute h-5 w-5  left-full border border-white rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center">
          <div className="h-2 w-2 bg-white rounded-full"></div>
        </div>
      </motion.div>
      {/* R 1 */}

      {/* R 2 */}
      <motion.div 
      style={{
        translateY: "-50%",
        translateX: "-50%"
      }}
      
      animate={{
        rotate:"-1turn",
      }}
      transition={{
        duration: 60,
        repeat: Infinity,
        ease: "linear"
      }}
      
      className="absolute h-[444px] w-[444px] md:h-[780px] md:w-[780px] rounded-full border border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed"></motion.div>
      {/* R 2 */}

      {/* R 3 */}
      <motion.div

style={{
  translateY: "-50%",
  translateX: "-50%"
}}

animate={{
  rotate:"1turn",
}}
transition={{
  duration: 60,
  repeat: Infinity,
  ease: "linear"
}}
      
      className="absolute h-[544px] w-[544px] md:h-[980px] md:w-[980px] border border-white opacity-20 rounded-full  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute h-2 w-2  left-0 bg-white rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute h-2 w-2  left-full bg-white rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </motion.div>
      {/* R 3 */}

      <div className="container relative mt-10">
        <h1 className="text-8xl md:text-[168px] md:leading-tight font-semibold tracking-tighter bg-white bg-[radial-gradient(100%_100%_at_top_left,white,white,rgb(74,32,138,.5))] text-transparent bg-clip-text text-center">
          Dyna Price
        </h1>
        <p className="text-lg md:text-xl max-w-xl mx-auto text-white/70 mt-5 text-center">
          Welcome to DynaPrice — your solution for smart, real-time pricing.
          Harness AI to effortlessly adjust prices, optimize profits, and stay
          ahead in a dynamic market.
        </p>

        <div className="flex justify-center mt-5 ">
          <button className="relative py-2 px-4 rounded-lg font-medium text-sm bg-gradient-to-b from-[#190d2e] to-[#4a208a] shadow-[0px_0px_12px_#8c45ff]">
            <div className="absolute inset-0 ">
              <div className=" rounded-lg border border-white/20 absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
              <div className="rounded-lg border border-white/40 absolute inset-0 [mask-image:linear-gradient(to_top,black,transparent)]"></div>
              <div className="absolute inset-0 shadow-[0_0)10px_rgb(140,69,255,.7)_inset] rounded-lg"></div>
            </div>
            <span>Join Us</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
