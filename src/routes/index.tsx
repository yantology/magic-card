import { CardSuit } from "@/components/custom/cardSuit";
import type { CardRank, CardSuit as SuitType } from "@/components/custom/cardSuit";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import animation libraries

// Define the route for this component
export const Route = createFileRoute("/")({
  component: RouteComponent,
});

// --- Helper Functions ---

/**
 * Creates a pause in execution for a specified duration.
 * @param ms - The number of milliseconds to wait.
 * @returns A promise that resolves after the specified time.
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Shuffles the elements of an array randomly using the Fisher-Yates algorithm.
 * @param array - The array to shuffle.
 * @returns A new array with the elements shuffled.
 */
function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array]; // Create a copy to avoid modifying the original array

  // While there are elements remaining to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap it with the current element
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }

  return newArray;
}

// --- React Component ---

function RouteComponent() {
  // --- State Variables ---

  // Tracks whether the cards are flipped over (showing back) or face up
  const [areCardsFlipped, setAreCardsFlipped] = useState(false);
  // Tracks whether the cards are gathered in the center or spread out
  const [areCentered, setAreCentered] = useState(false);
  // Tracks the current stage of the magic trick animation sequence
  // 0: Initial state (cards spread, face up)
  // 1: Cards moving to the center
  // 2: Cards flipping over
  // 3: One card is being removed
  // 4: Remaining cards' ranks are shuffled (transformed)
  // 5: Cards moving back to original positions
  // 6: Cards flipping back face up (revealed)
  const [cardStage, setCardStage] = useState(0);
  // Holds the array of cards currently visible on the screen
  const [visibleCards, setVisibleCards] = useState<{rank: CardRank, suit: SuitType, id: string}[]>([]);

  // --- Initial Card Setup ---

  // Define the initial set of cards that appear at the start
  const initialCards: {rank: CardRank, suit: SuitType, id: string}[] = [
    { rank: "A", suit: "heart", id: "card-1" },
    { rank: "K", suit: "diamond", id: "card-2" },
    { rank: "J", suit: "spade", id: "card-4" },
    { rank: "Q", suit: "club", id: "card-3" },
    
  ];

  // Store the ranks (A, K, Q, J) from the initial cards for later shuffling logic
  const initialCardRanks = initialCards.map(card => card.rank);

  // --- Effects ---

  // This useEffect hook runs when the component mounts or when `cardStage` changes.
  // It's used here primarily to reset the cards to their initial state when `cardStage` becomes 0.
  useEffect(() => {
    if (cardStage === 0) {
        // Reset visible cards to the initial set
        setVisibleCards(initialCards);
        // Ensure cards start face up
        setAreCardsFlipped(false);
        // Ensure cards start spread out
        setAreCentered(false);
    }
    // The dependency array [cardStage] means this effect runs only when cardStage changes.
  }, [cardStage]);

  // --- Event Handler ---

  /**
   * Handles the entire magic trick sequence step-by-step using async/await for timing.
   * If the trick is in progress (stage > 0 and < 6), this function does nothing.
   * If the trick is finished (stage 6) or hasn't started (stage 0), clicking the button
   * will either start the sequence or reset it.
   */
  const handleMagicSequence = async () => {
    // Only start the sequence if it's the initial stage (0)
    if (cardStage === 0) {
      // --- Stage 1: Center Cards ---
      setAreCentered(true); // Trigger animation to move cards to the center
      setCardStage(1);      // Update stage indicator
      await wait(800);      // Wait for centering animation to complete

      // --- Stage 2: Flip Cards ---
      setAreCardsFlipped(true); // Trigger animation to flip cards over
      setCardStage(2);        // Update stage indicator
      await wait(500);        // Wait for flip animation to complete

      // --- Stage 3: Remove a Random Card ---
      const cardsBeforeRemoval = [...visibleCards]; // Copy current cards before removal
      if (cardsBeforeRemoval.length > 0) { // Ensure there are cards to remove
          // Select a random card to remove
          const randomIndex = Math.floor(Math.random() * cardsBeforeRemoval.length);
          const cardToRemove = cardsBeforeRemoval[randomIndex];

          setCardStage(3); // Update stage indicator (removal animation starts via AnimatePresence)
          await wait(600); // Wait roughly for the removal animation duration

          // Update the visible cards state *after* the animation has had time to play
          const remainingCards = cardsBeforeRemoval.filter(card => card.id !== cardToRemove.id);
          setVisibleCards(remainingCards);

          // --- Stage 4: Shuffle Ranks (Transform) ---
          await wait(300); // Short pause before shuffling

          // Determine which ranks from the *initial* set should be considered for shuffling.
          // This includes ranks of cards still present AND the rank of the removed card
          // if it was the only one with that rank initially (to maintain the illusion).
          // We then slice it to match the number of *remaining* cards.
          const remainingInitialRanks = initialCardRanks.filter(rank =>
              remainingCards.some(card => card.rank === rank) || // Keep ranks of cards still visible
              initialCards.find(ic => ic.id === cardToRemove.id)?.rank === rank // Keep rank of the removed card
          ).slice(0, remainingCards.length); // Ensure we only have ranks for the remaining cards

          // Shuffle the selected ranks
          const shuffledRanks = shuffleArray(remainingInitialRanks);

          // Update the ranks of the visible cards using the shuffled ranks
          setVisibleCards((currentCards) =>
            currentCards.map((card, index) => {
              // Assign shuffled ranks, using modulo to wrap around if needed (though lengths should match here)
              const newRank = shuffledRanks[index % shuffledRanks.length];
              return { ...card, rank: newRank }; // Return the card with its new rank
            })
          );
          setCardStage(4); // Update stage indicator
          await wait(500); // Pause briefly after transformation

          // --- Stage 5: Return Cards to Original Positions ---
          setAreCentered(false); // Trigger animation to spread cards out
          setCardStage(5);       // Update stage indicator
          await wait(800);       // Wait for return animation to complete

          // --- Stage 6: Flip Cards Back (Reveal) ---
          setAreCardsFlipped(false); // Trigger animation to flip cards face up
          setCardStage(6);         // Update stage indicator (Sequence complete)
          // The trick sequence ends here.
      }

    } else {
      // If the button is clicked when the sequence is finished (or any stage > 0), reset.
      setCardStage(0); // Setting stage to 0 triggers the useEffect to reset everything.
    }
  };

  // --- Render Logic ---

  return (
    // Main container div: Added gradient background, text color, padding
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 p-4 overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800">
      {/* Title Text: Increased size, added shadow */}
      <h1 className="text-3xl font-bold text-center text-indigo-800 drop-shadow-sm">
        Pilih salah satu kartu dan ingat baik baik
      </h1>

      {/* Container for the animated cards: Added subtle shadow and rounded corners */}
      {/* Height is fixed (h-72) to prevent layout shifts during animations */}
      <div className={`relative w-full h-72 flex items-center justify-center gap-4 flex-wrap p-2 rounded-lg shadow-inner bg-white/30 backdrop-blur-sm`}>
        {/* AnimatePresence handles the enter/exit animations, especially for the removed card */}
        <AnimatePresence>
          {/* Map over the currently visible cards to render each one */}
          {visibleCards.map((card, index) => (
            // motion.div is a Framer Motion component that enables animation
            <motion.div
              key={card.id} // Unique key for React and Framer Motion tracking
              layout // Enables smooth animation when position/size changes (e.g., centering/spreading)

              // --- Animation Properties ---
              initial={false} // We handle the initial state via useEffect, not Framer's initial prop here
              // 'animate' defines the target state for the animation based on component state
              animate={{
                // Use absolute positioning when centered for easy overlap and rotation
                position: areCentered ? "absolute" : "relative",
                // Reset transforms when not centered
                x: 0,
                y: 0,
                // Center horizontally/vertically using translateX/Y when absolute positioned
                translateX: areCentered ? "-50%" : "0%",
                translateY: areCentered ? "-50%" : "0%",
                // Apply rotation when centered to fan the cards out
                rotate: areCentered ? index * 8 - ((visibleCards.length -1) * 4) : 0,
                // Slightly scale up cards when centered
                scale: areCentered ? 1.15 : 1, // Slightly increased scale when centered
                // Adjust z-index when centered so cards overlap correctly
                zIndex: areCentered ? index : 0,
                // Add a subtle shadow when cards are spread out
                boxShadow: areCentered ? "0px 10px 20px rgba(0, 0, 0, 0.2)" : "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              // 'exit' defines the animation when the component is removed (handled by AnimatePresence)
              exit={{
                opacity: 0, // Fade out
                scale: 0.5, // Shrink
                y: -150,    // Move upwards
                // Add some random horizontal movement and rotation for a "poof" effect
                x: Math.random() * 100 - 50,
                rotate: Math.random() * 60 - 30,
                transition: { duration: 0.5, ease: "easeOut" } // Customize exit animation timing
              }}
              // 'transition' defines how the animation between states occurs
              transition={{
                type: "spring", // Use a spring physics-based animation for a natural feel
                stiffness: 120, // Spring stiffness (higher = faster, bouncier)
                damping: 15,    // Spring damping (higher = less oscillation)
                // Add a small delay to the centering animation for each card for a staggered effect
                delay: areCentered && cardStage === 1 ? index * 0.08 : 0,
                // Define transition specifically for layout changes (centering/spreading)
                layout: { duration: 0.4, ease: "easeInOut" }
              }}
              // Inline styles are sometimes needed to bridge Framer Motion's logic and CSS,
              // especially for initial positioning before animations take over.
              style={{
                  position: areCentered ? "absolute" : "relative",
                  top: areCentered ? "50%" : "auto",
                  left: areCentered ? "50%" : "auto",
                  // It's often good practice to set the initial transform directly via style
                  // to match the 'animate' state, ensuring smooth transitions.
                  transform: areCentered
                      ? `translateX(-50%) translateY(-50%) rotate(${index * 8 - ((visibleCards.length -1) * 4)}deg) scale(1.15)`
                      : `translateX(0%) translateY(0%) rotate(0deg) scale(1)`,
                  // Ensure initial shadow matches the non-centered state
                  boxShadow: areCentered ? "0px 10px 20px rgba(0, 0, 0, 0.2)" : "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Render the actual Card component */}
              <CardSuit
                rank={card.rank}
                suit={card.suit}
                isFlipped={areCardsFlipped} // Pass flip state to the card component
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Description Text Area: Increased font size */}
      {/* Fixed height (h-6) prevents layout shifts when text changes */}
      <div className="text-center mb-4 h-6 text-lg font-medium text-purple-700">
        {/* AnimatePresence with mode="wait" ensures the old text fades out before the new one fades in */}
        <AnimatePresence mode="wait">
          {/* motion.p allows animating the text changes */}
          <motion.p
            key={cardStage} // Change the key to trigger animation when the stage changes
            initial={{ opacity: 0, y: 10 }} // Start invisible and slightly down
            animate={{ opacity: 1, y: 0 }}   // Fade in and move up to position
            exit={{ opacity: 0, y: -10 }}    // Fade out and move slightly up
            transition={{ duration: 0.3 }}   // Animation duration
          >
            {/* Display text based on the current cardStage */}
            {cardStage === 0 && "Choose one card and remember it well."}
            {cardStage === 1 && "Gathering cards..."}
            {cardStage === 2 && "Flipping cards..."}
            {cardStage === 3 && "Making one disappear..."}
            {cardStage === 4 && "Shuffling the cards..."}
            {cardStage === 5 && "Returning the cards..."}
            {cardStage === 6 && "Is your card still here?"}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Control Button: Enhanced styling with gradient, shadow, and transitions */}
      <button
        className="py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
        onClick={handleMagicSequence}
        // Disable the button while the magic sequence is running (stages 1 through 5)
        disabled={cardStage > 0 && cardStage < 6}
      >
        {/* Change button text based on whether the trick is ready to start or needs resetting */}
        {cardStage === 0 ? "Start the Magic" : "Reset trick"}
      </button>
    </div>
  );
}
