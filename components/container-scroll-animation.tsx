"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotateX = useTransform(scrollYProgress, [0, 1], [85, -35]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translateY = useTransform(scrollYProgress, [0, 1000], [0, -600]);

  return (
    <div className="translate-y-[-5%] relative p-2 md:p-20" ref={containerRef}>
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "2000px",
        }}
      >
        <Header translateY={translateY} titleComponent={titleComponent} />
        <Card rotateX={rotateX} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};
export const Header = ({ translateY, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translateY,
      }}
      className="div max-w-5xl mx-auto text-center pb-10"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotateX,
  scale,
  children,
}: {
  rotateX: any;
  scale: any;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotateX,
        scale: scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 p-2 md:p-6 rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl md:rounded-2xl md:p-4">
        {children}
      </div>
    </motion.div>
  );
};