import { useState } from "react";

export const tips = [
  "Watch out for your health! Attacking monsters will drain your health. Be sure to pick up health packs to restore your health.",
  "You can toggle the flashlight on and off by pressing the F key.",
  "Toggle the help menu at any time by pressing the H key.",
  "You can move around the map by using the arrow keys or WASD.",
  "Gain EXP by defeating monsters. Once you have enough EXP, you can level up and increase your attack and recover some HP.",
  "Attack monsters by moving into them.",
  "Picking up weapons can increase your ATK, which helps in dealing more damage to monsters.",
];

export default function Tip() {
  const [currentTip, setCurrentTip] = useState(
    Math.floor(Math.random() * tips.length)
  );

  const handleNextTip = () => {
    setCurrentTip((currentTip + 1) % tips.length);
  };

  const handlePrevTip = () => {
    setCurrentTip((currentTip - 1 + tips.length) % tips.length);
  };

  return (
    <>
      <div className="mb-5 flex w-full items-center justify-between">
        <h2 className="text-4xl font-bold">💡 Tip</h2>

        <div className="btn-group">
          <button type="button" className="btn btn-sm" onClick={handlePrevTip}>
            &larr;
          </button>

          <button type="button" className="btn btn-sm" onClick={handleNextTip}>
            &rarr;
          </button>
        </div>
      </div>

      <p className="mb-5 text-left">{tips[currentTip]}</p>
    </>
  );
}
