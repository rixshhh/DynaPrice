"use client"

import { motion} from "framer-motion";
import React from "react";
import logo1 from "@/assets/logo1.svg";
import logo2 from "@/assets/logo2.svg";
import logo3 from "@/assets/logo3.svg";
import logo4 from "@/assets/logo4.svg";
import logo5 from "@/assets/logo5.svg";
import logo6 from "@/assets/logo6.svg";
import logo7 from "@/assets/logo7.svg";

function LogoTicker() {
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <div className="flex items-center gap-5">
          <div className="flex-1 md:flex-none">
            <h2 className="text-xl">Industries We Serve</h2>
          </div>
          <div className="flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <motion.div
            initial={{translateX:"-50%"}}
            animate={{translateX:"0"}}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear"
            }}
            
            className="flex flex-none gap-14">
              {[
                logo1,
                logo2,
                logo3,
                logo4,
                logo5,
                logo6,
                logo7,
                logo1,
                logo3,
                logo6,
                logo7,
                logo4,
                logo5,
              ].map((logo) => (
                <img className="h-12 w-auto" src={logo.src} key={logo.src} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LogoTicker;
