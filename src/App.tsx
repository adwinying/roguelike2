import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Map from "@/Map";
import ModalDefeat from "@/ModalDefeat";
import ModalVictory from "@/ModalVictory";
import Stats from "@/Stats";
import useGame from "@/useGame";
import useModal from "@/useModal";

export default function App() {
  const { triggerMove, toggleFlashlight } = useGame();
  const {
    modalState: { isVictoryModalActive, isDefeatModalActive },
  } = useModal();

  useEffect(() => {
    if (isVictoryModalActive || isDefeatModalActive) return () => {};

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
          triggerMove("up");
          break;
        case "ArrowDown":
        case "s":
          triggerMove("down");
          break;
        case "ArrowLeft":
        case "a":
          triggerMove("left");
          break;
        case "ArrowRight":
        case "d":
          triggerMove("right");
          break;
        case "f":
          toggleFlashlight();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    triggerMove,
    toggleFlashlight,
    isVictoryModalActive,
    isDefeatModalActive,
  ]);

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center px-3 py-4 text-center">
      <h1 className="pb-4 text-4xl font-bold">Roguelike</h1>

      <Stats className="mb-4" />

      <Map className="flex-1" />

      <Toaster position="bottom-left" />

      <ModalVictory />

      <ModalDefeat />
    </div>
  );
}
