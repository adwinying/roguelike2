import { useEffect, useMemo, useRef, useState } from "react";

import { MapTerrain } from "@/game/map";
import { Sprite } from "@/game/sprite";
import { config as gameConfig, printMap } from "@/game/state";
import useGame from "@/useGame";

export function MapCell({
  cellType,
}: {
  cellType: MapTerrain | Sprite["type"] | "fog";
}) {
  const cellColor = {
    [MapTerrain.Wall]: "bg-base-content dark:bg-neutral",
    [MapTerrain.Floor]: "bg-base-100 dark:bg-base-content",
    player: "bg-blue-700",
    health: "bg-green-700",
    monster: "bg-red-500",
    weapon: "bg-yellow-500",
    exit: "bg-purple-700",
    boss: "bg-red-900",
    fog: "bg-base-300",
  };

  return <td className={`h-4 w-4 ${cellColor[cellType]}`} />;
}

export default function Map({ className = "" }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mapRect, setMapRect] = useState({ width: 0, height: 0 });
  const { gameMap, sprites, floor, isFlashlightOn } = useGame();
  const mapCellsToDisplay = useMemo(
    () => ({
      x: Math.min(gameConfig.mapWidth, Math.floor(mapRect.width / 16)),
      y: Math.min(gameConfig.mapHeight, Math.floor(mapRect.height / 16)),
    }),
    [mapRect]
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;

        setMapRect({ width, height });
      });
    });

    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const partialMap = useMemo(
    () =>
      printMap(
        { isFlashlightOn, floor, map: gameMap, sprites },
        mapCellsToDisplay.x,
        mapCellsToDisplay.y
      ),
    [isFlashlightOn, floor, gameMap, sprites, mapCellsToDisplay]
  );

  /* eslint-disable react/no-array-index-key */
  return (
    <div className={`flex w-full justify-center ${className}`} ref={wrapperRef}>
      <table>
        <tbody>
          {partialMap.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <MapCell key={j} cellType={cell} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
