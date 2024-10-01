import { section } from "framer-motion/client";
import React from "react";

function CallAction() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="h-[30rem] w-full dark:bg-[#0A0A0A] bg-white z-none dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
          {/* Radial gradient for the container to give a faded look */}
          <div className="absolute pointer-events-none inset-0 flex flex-col items-center justify-center dark:bg-[#0A0A0A] bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

          <div className=" flex flex-col items-center">
            <h1 className="text-4xl sm:text-4xl md:text-6xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
              Real-Time Pricing, Real Results
            </h1>
            <p className="text-neutral-800 dark:text-neutral-200  md:w-[630px] text-xm text-center md:text-xl font-sm mb-4">
              DynaPrice enables you to adjust prices dynamically based on demand
              and competition, driving profitability and market advantage
            </p>

            <div className="flex justify-center mt-5 ">
              <button className="relative py-3 px-5 rounded-lg font-medium text-sm bg-gradient-to-b from-[#190d2e] to-[#4a208a] shadow-[0px_0px_12px_#8c45ff]">
                <div className="absolute inset-0 ">
                  <div className=" rounded-lg border border-white/20 absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
                  <div className="rounded-lg border border-white/40 absolute inset-0 [mask-image:linear-gradient(to_top,black,transparent)]"></div>
                  <div className="absolute inset-0 shadow-[0_0)10px_rgb(140,69,255,.7)_inset] rounded-lg"></div>
                </div>
                <span>Join Us</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallAction;
