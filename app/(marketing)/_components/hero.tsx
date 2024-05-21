import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, CircleGauge, Gem } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="md:py-20 py-16">
      <div className="container mx-auto text-center mt-10 px-4">
        <div className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl flex justify-center font-bold md:px-20 pb-6 dark:bg-gradient-to-r from-black to-gray-400 dark:from-white dark:to-gray-500 bg-clip-text dark:text-transparent">
          Prepare for your school year
        </div>

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
          <video
            className="rounded-xl w-full max-w-screen-lg mx-auto shadow-2xl shadow-gray-800"
            autoPlay
            muted
            loop
          >
            <source src="/hero-video.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
};
