import * as React from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { cn } from "@/lib/utils";

// Card suit mapping
export const CARD_SUITS = {
  heart: { symbol: "♥️", colorClass: "text-red-800" },
  diamond: { symbol: "♦️", colorClass: "text-red-800" },
  spade: { symbol: "♠️", colorClass: "text-black" },
  club: { symbol: "♣️", colorClass: "text-black" },
};

// Card rank options
export type CardRank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";
export type CardSuit = keyof typeof CARD_SUITS;

// Base card style
const baseCardStyle = "relative aspect-[7/10] rounded-lg border border-gray-300 bg-white w-32 sm:w-40 md:w-48 text-base shadow-lg";

// CardProps interface simplified
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  rank: CardRank;
  suit: CardSuit;
  isFlipped?: boolean;
}

const CardSuit = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      rank,
      suit,
      className,
      isFlipped
    },
    ref
  ) => {
    const { symbol, colorClass } = CARD_SUITS[suit];

    // Fixed text sizing classes
    const rankClass = "font-semibold leading-none text-lg sm:text-xl md:text-2xl";
    const suitClass = "leading-none text-base sm:text-lg md:text-xl";
    const centerSymbolClass = cn(
      colorClass,
      "flex-grow flex items-center justify-center text-4xl sm:text-6xl md:text-7xl"
    );    const faceBaseClass = "absolute w-full h-full flex rounded-lg inset-0";
    return (
      // Outer container for perspective
      <motion.div ref={ref} className={cn("relative [perspective:1000px]", className)}>
        {/* Inner container: Use motion.div instead of div with Tailwind classes */}
        <motion.div
          className={cn(
            baseCardStyle,
            "[transform-style:preserve-3d]"
          )}
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Front of the card */}
          <motion.div
            className={cn(
              faceBaseClass,
              colorClass,
              "flex-col justify-between p-1 ",
              "[backface-visibility:hidden]"
            )}
            style={{ rotateY: 0 }}
          >
            {/* Top Left Corner */}
            <motion.div className="flex flex-col items-center self-start">
              <motion.div className={rankClass}>{rank}</motion.div>
              <motion.div className={suitClass}>{symbol}</motion.div>
            </motion.div>

            {/* Center Symbol */}
            <motion.div className={centerSymbolClass}>{symbol}</motion.div>

            {/* Bottom Right Corner (Rotated) */}
            <motion.div className="flex flex-col items-center self-end rotate-180">
              <motion.div className={rankClass}>{rank}</motion.div>
              <motion.div className={suitClass}>{symbol}</motion.div>
            </motion.div>
          </motion.div>

          {/* Back of the card */}
          <motion.div
            className={cn(
              faceBaseClass,
              "bg-blue-500 border border-blue-700 items-center justify-center",
              "[backface-visibility:hidden]"
            )}
            style={{ rotateY: 180 }}
          >
            {/* Example back face content */}
            <motion.div className="w-3/4 h-3/4 border-2 border-blue-300 rounded-md flex items-center justify-center">
              <motion.span className="text-white font-bold text-xl">CARD</motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
);

CardSuit.displayName = "CardSuit";

export { CardSuit };
