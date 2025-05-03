# Magic Card Animation

This project demonstrates a "magic trick" animation using React, Framer Motion, and Tailwind CSS. It displays a set of cards that go through an animated sequence simulating a card trick.

## Features

- **Card Display:** Shows an initial set of playing cards (`A`, `K`, `Q`, `J` of different suits).
- **Animated Sequence:**
  1. Cards gather in the center of the screen.
  2. Cards flip over to hide their faces.
  3. One card is randomly selected and disappears with an animation.
  4. The ranks of the remaining cards are shuffled ("transformed").
  5. Cards return to their original spread-out positions.
  6. Cards flip back face-up, revealing the "transformed" hand.
- **Interactive Control:** A button allows the user to start the magic sequence or reset it.
- **Smooth Animations:** Uses Framer Motion for fluid transitions and effects (layout changes, opacity, scale, rotation, position).
- **Descriptive Text:** Text updates guide the user through each stage of the trick.

## Technologies Used

- **React:** JavaScript library for building user interfaces.
- **TypeScript:** Superset of JavaScript adding static typing.
- **Vite:** Fast frontend build tool.
- **TanStack Router:** Type-safe routing for React applications.
- **Framer Motion:** Animation library for React.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **clsx / tailwind-merge:** Utilities for combining CSS classes.

## How to Run

1. **Clone the repository (if applicable).**
2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Start the development server:**

   ```bash
   bun run dev
   ```

   This will typically open the application in your browser at `http://localhost:3000`.

## Magic Trick Logic (`src/routes/index.tsx`)

The core logic resides in the `RouteComponent` and the `handleMagicSequence` async function:

1. **State Management:** `useState` hooks manage:
   - `areCardsFlipped`: Whether cards are face-up or face-down.
   - `areCentered`: Whether cards are gathered or spread out.
   - `cardStage`: The current step in the animation sequence (0-6).
   - `visibleCards`: An array of card objects currently displayed.
2. **`handleMagicSequence`:**
   - Triggered by the button click.
   - Uses `async/await` and a `wait()` helper function to pause between animation stages.
   - Updates state variables (`areCentered`, `areCardsFlipped`, `cardStage`) at each step to trigger animations defined in the `motion.div` components.
   - Handles card removal by filtering the `visibleCards` state.
   - Implements the "transformation" by shuffling the ranks of the remaining cards using a `shuffleArray` helper.
   - Resets the state to the beginning if the button is clicked after the sequence completes.
3. **Animation:**
   - `motion.div` wraps each card, enabling animation properties (`animate`, `exit`, `transition`, `layout`).
   - `AnimatePresence` handles the enter/exit animations, particularly for the card that disappears.
   - Conditional styles and transforms are applied based on the `areCentered` state.
   - Text descriptions also use `motion.p` and `AnimatePresence` for smooth transitions.
