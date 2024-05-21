"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  isCollapsed?: boolean;
};

export const Logo = ({ isCollapsed }: LogoProps) => {
  return (
    <Link
      href="/"
      className={cn(
        "mx-5 my-2 opacity-100",
        isCollapsed && "opacity-0 transition-opacity"
      )}
    >
      <Image src="/logo.svg" alt="CountWave" width={170} height={42} />
    </Link>
  );
};
