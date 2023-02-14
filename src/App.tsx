import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Map from "@/Map";
import ModalDefeat from "@/ModalDefeat";
import ModalHelp from "@/ModalHelp";
import ModalVictory from "@/ModalVictory";
import Stats from "@/Stats";
import useGame from "@/useGame";
import useModal from "@/useModal";

export default function App() {
  const { triggerMove, toggleFlashlight } = useGame();
  const {
    modalState: { activeModal },
    showHelpModal,
    hideModal,
  } = useModal();

  useEffect(() => {
    if (activeModal === "HELP") {
      const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case "h":
            hideModal();
            break;
          default:
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => window.removeEventListener("keydown", handleKeyDown);
    }

    if (activeModal !== null) return () => {};

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
        case "h":
          showHelpModal();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerMove, toggleFlashlight, activeModal, showHelpModal, hideModal]);

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center px-3 py-4 text-center">
      <h1 className="pb-4 text-4xl font-bold">Roguelike</h1>

      <Stats className="mb-4" />

      <Map className="flex-1" />

      <Toaster position="bottom-left" />

      <ModalVictory />

      <ModalDefeat />

      <ModalHelp />

      <div className="mt-3 text-center">
        Press <kbd className="kbd">h</kbd> for help
      </div>
    </div>
  );
}
