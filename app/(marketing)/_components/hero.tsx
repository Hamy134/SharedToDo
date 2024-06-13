"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, CircleGauge, Gem } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


import Image from "next/image";
import { ContainerScroll } from "@/components/container-scroll-animation";

export const Hero = () => {
  return (
    <section className="md:py-20 py-16">
      {/* <div className="container mx-auto text-center mt-24 px-4">
        <h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-4xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-5xl md:text-6xl lg:text-7xl">
          CountWave is the new way
          <br className="hidden md:block" /> 
          to prepare for your school year.
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl pb-6 dark:bg-gradient-to-r from-black to-gray-400 dark:from-white dark:to-gray-500 bg-clip-text dark:text-transparent">
          Stay on top of your school year, schedule, prioritize tasks, and ace
          every exam with ease.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center pb-6">
          <SignedIn>
            <Button size="xl" asChild className="mb-4 md:mb-0 sm:w-auto w-full">
              <Link href="/dashboard">
                <CircleGauge className="h-4 w-4 mr-3" />
                Dashboard
              </Link>
            </Button>
          </SignedIn>

          <SignedOut>
            <Button size="xl" asChild className="mb-4 md:mb-0 sm:w-auto w-full">
              <Link href="/sign-up">
                Get started
                <ArrowRight className="h-4 w-4 ml-3" />
              </Link>
            </Button>
          </SignedOut>

          <Button variant="link" size="xl" asChild className="mb-4 md:mb-0 sm:w-auto w-full">
            <Link href="#pricing">
              <Gem className="h-4 w-4 mr-3" />
              See Pricing
            </Link>
          </Button>
        </div>

        <div className="pt-4">
          <img
            className="rounded-xl w-full max-w-screen-lg mx-auto shadow-2xl shadow-gray-800"
            src="/features/img1.png"
          />
        </div>

        <h1 class="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">Magic UI is the new way<br class="hidden md:block"> to build landing pages.</h1>
      </div> */}

      <div className=" overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-4xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-5xl md:text-6xl lg:text-7xl">
                CountWave is the new way
                <br className="hidden md:block" />
                to prepare for your school year.
              </h1>
            </>
          }
        >
          <Image
            src={`/features/img1.png`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </section>
  );
};
