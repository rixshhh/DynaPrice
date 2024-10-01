"use client";

import Link from "next/link";
import React from "react";

function Header() {
  return (
    <header className="py-4 border-b border-white/15 md:border-none  sticky top-0 z-10 backdrop-blur md:backdrop-blur-none">
      <div className="container">
        <div className="flex justify-between items-center md:border border-white/15 md:p-2.5 rounded-xl max-w-2xl mx-auto backdrop-blur">
          <div>
            <div className=" border h-10 w-10 rounded-lg inline-flex justify-end items-center border-white/15"></div>
          </div>

          <div className="hidden md:block">
            <nav className="flex gap-8 text-sm ">
              <a
                href="#"
                className=" text-white/70 hover:text-white transition"
              >
                Features
              </a>
              <a
                href="#"
                className=" text-white/70 hover:text-white transition"
              >
                Developer
              </a>
              <a
                href="#"
                className=" text-white/70 hover:text-white transition"
              >
                Pricing
              </a>
              <a
                href="#"
                className=" text-white/70 hover:text-white transition"
              >
                Changlog
              </a>
            </nav>
          </div>

          <Link href={"/dashboard"}>
            <div className="flex gap-4 items-center">
              <div className="relative py-2 px-4 rounded-lg font-medium text-sm bg-gradient-to-b from-[#190d2e] to-[#4a208a] shadow-[0px_0px_12px_#8c45ff]">
                <div className="absolute inset-0 ">
                  <div className=" rounded-lg border border-white/20 absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
                  <div className="rounded-lg border border-white/40 absolute inset-0 [mask-image:linear-gradient(to_top,black,transparent)]"></div>
                  <div className="absolute inset-0 shadow-[0_0)10px_rgb(140,69,255,.7)_inset] rounded-lg"></div>
                </div>
                <span> Join Us</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
