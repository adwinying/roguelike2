import { Coordinate, CoordinateKey, MapTerrain } from "@/game/map";
import { Sprite } from "@/game/sprite";
import { config as gameConfig } from "@/game/state";
import { useGame } from "@/useGame";

function MapCell({ cellType }: { cellType: MapTerrain | Sprite["type"] }) {
  const cellColor = {
    [MapTerrain.Wall]: "bg-base-content dark:bg-neutral",
    [MapTerrain.Floor]: "bg-base-100 dark:bg-base-content",
    player: "bg-blue-700",
    health: "bg-green-700",
    monster: "bg-red-500",
    weapon: "bg-yellow-500",
    exit: "bg-purple-700",
    boss: "bg-red-900",
  };

  return <td className={`h-2 w-2 ${cellColor[cellType]}`} />;
}

export default function Map({ className = "" }: { className?: string }) {
  const gameMap = useGame(({ map }) => map);
  const spriteMap = useGame(({ computed }) => computed.spriteMap);

  const getCellType = (coor: Coordinate) => {
    const coorKey = CoordinateKey.fromCoor(coor);

    const cellType = spriteMap.get(coorKey)?.type ?? gameMap.get(coorKey);

    if (cellType === undefined) throw new Error("Invalid map cell");

    return cellType;
  };

  return (
    <table className={className}>
      <tbody>
        {Array.from(Array(gameConfig.mapHeight).keys()).map((y) => (
          <tr key={y}>
            {Array.from(Array(gameConfig.mapWidth).keys()).map((x) => (
              <MapCell key={x} cellType={getCellType({ x, y })} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
