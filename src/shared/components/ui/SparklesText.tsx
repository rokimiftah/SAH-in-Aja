"use client";

import type { CSSProperties, ReactElement } from "react";

import { useEffect, useState } from "react";

import { motion } from "motion/react";

import { cn } from "@shared/lib";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

const SparkleElement: React.FC<Sparkle> = ({ id, x, y, color, delay, scale }) => {
  return (
    <motion.svg
      key={id}
      className="pointer-events-none absolute z-30"
      initial={{ opacity: 0, left: x, top: y }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, scale, 0],
      }}
      transition={{ duration: 0.8, repeat: Infinity, delay, ease: "easeInOut" }}
      width="6"
      height="6"
      viewBox="0 0 6 6"
    >
      <circle cx="3" cy="3" r="2" fill={color} />
    </motion.svg>
  );
};

interface SparklesTextProps {
  as?: ReactElement;
  className?: string;
  children: React.ReactNode;
  sparklesCount?: number;
  colors?: {
    first: string;
    second: string;
  };
}

export const SparklesText: React.FC<SparklesTextProps> = ({
  children,
  colors = { first: "#9E7AFF", second: "#FE8BBB" },
  className,
  sparklesCount = 10,
  ...props
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateStar = (): Sparkle => {
      const starX = `${Math.random() * 100}%`;
      const starY = `${Math.random() * 100}%`;
      const color = Math.random() > 0.5 ? colors.first : colors.second;
      const delay = Math.random() * 2;
      const scale = Math.random() * 1 + 0.3;
      const lifespan = Math.random() * 10 + 5;
      const id = `${starX}-${starY}-${Date.now()}`;
      return { id, x: starX, y: starY, color, delay, scale, lifespan };
    };

    const initializeStars = () => {
      const newSparkles = Array.from({ length: sparklesCount }, generateStar);
      setSparkles(newSparkles);
    };

    const updateStars = () => {
      setSparkles((currentSparkles) =>
        currentSparkles.map((star) => {
          if (star.lifespan <= 0) {
            return generateStar();
          } else {
            return { ...star, lifespan: star.lifespan - 0.1 };
          }
        }),
      );
    };

    initializeStars();
    const interval = setInterval(updateStars, 100);

    return () => clearInterval(interval);
  }, [colors.first, colors.second, sparklesCount]);

  return (
    <div
      className={cn("font-bold", className)}
      {...props}
      style={
        {
          "--sparkles-first-color": `${colors.first}`,
          "--sparkles-second-color": `${colors.second}`,
        } as CSSProperties
      }
    >
      <span className="relative z-10 inline-block">
        {sparkles.map((sparkle) => (
          <SparkleElement key={sparkle.id} {...sparkle} />
        ))}
        <strong className="relative z-20">{children}</strong>
      </span>
    </div>
  );
};
