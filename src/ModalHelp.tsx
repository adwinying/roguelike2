import { MapCell } from "./Map";
import Tip from "./Tip";
import { MapTerrain } from "./game/map";

import useModal from "@/useModal";

function CellLegend({ cellType }: Parameters<typeof MapCell>[0]) {
  return (
    <table>
      <tbody>
        <tr className="border">
          <MapCell cellType={cellType} />
        </tr>
      </tbody>
    </table>
  );
}

export default function ModalHelp() {
  const {
    modalState: { activeModal },
    hideModal,
  } = useModal();

  return (
    <div className={`modal ${activeModal === "HELP" ? "modal-open" : ""}`}>
      <div className="modal-box flex flex-col items-start">
        <h2 className="mb-5 text-4xl font-bold">📜 Introduction</h2>

        <p className="mb-2 text-left">
          Welcome to the world of roguelike! Here, you will embark on a journey
          filled with danger and adventure, as you explore the dark and
          treacherous depths of ancient dungeons.
        </p>

        <p className="mb-2 text-left">
          Your ultimate goal is to clear five floors of the dungeon and defeat
          the boss that awaits at the end. To do this, you will face countless
          challenges and monsters as you delve deeper into the dungeons, using
          your skills and strategy to defeat your foes and emerge victorious.
          But be warned: death lurks around every corner, and one wrong move
          could spell the end for you.
        </p>

        <p className="mb-8 text-left">
          So steel yourself for the journey ahead, and may the gods be with you.
          The world needs heroes like you to rise up and conquer the challenges
          that lay before you. Good luck, and happy dungeon-delving!
        </p>

        <h2 className="mb-5 text-4xl font-bold">♟ Map Legends</h2>

        <dl className="mb-8 grid w-full grid-cols-[max-content_auto] items-center gap-y-6 gap-x-4 text-left">
          <dt>
            <CellLegend cellType={MapTerrain.Wall} />
          </dt>
          <dd>Wall</dd>

          <dt>
            <CellLegend cellType={MapTerrain.Floor} />
          </dt>
          <dd>Floor</dd>

          <dt>
            <CellLegend cellType="health" />
          </dt>
          <dd>Health</dd>

          <dt>
            <CellLegend cellType="monster" />
          </dt>
          <dd>Monster</dd>

          <dt>
            <CellLegend cellType="player" />
          </dt>
          <dd>Player</dd>

          <dt>
            <CellLegend cellType="weapon" />
          </dt>
          <dd>Weapon</dd>

          <dt>
            <CellLegend cellType="exit" />
          </dt>
          <dd>Floor exit</dd>

          <dt>
            <CellLegend cellType="boss" />
          </dt>
          <dd>Boss</dd>
        </dl>

        <h2 className="mb-5 text-4xl font-bold">🔑 Keybindings</h2>

        <dl className="mb-8 grid w-full grid-cols-[max-content_auto] items-center gap-y-6 gap-x-4 text-left">
          <dt>
            <kbd className="kbd">▲</kbd>
            <kbd className="kbd">◀︎</kbd>
            <kbd className="kbd">▶︎</kbd>
            <kbd className="kbd">▼</kbd>
            <br />
            <kbd className="kbd">w</kbd>
            <kbd className="kbd">a</kbd>
            <kbd className="kbd">s</kbd>
            <kbd className="kbd">d</kbd>
          </dt>
          <dd>Move player</dd>

          <dt>
            <kbd className="kbd">f</kbd>
          </dt>
          <dd>Toggles Flashlight (Easy mode)</dd>

          <dt>
            <kbd className="kbd">h</kbd>
          </dt>
          <dd>Toggles this help dialog</dd>
        </dl>

        <Tip />

        <button
          type="button"
          className="btn-primary btn mt-5 self-center"
          onClick={() => {
            hideModal();
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
