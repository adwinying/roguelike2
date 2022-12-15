import { CoordinateKey, MapTerrain } from "@/game/map";
import { config as gameConfig } from "@/game/state";
import { useGame } from "@/useGame";

export default function App() {
  const gameMap = useGame(({ map }) => map);
  const spriteMap = useGame(({ computed }) => computed.spriteMap);

  const cellColor = {
    [MapTerrain.Wall]: "bg-base-content dark:bg-neutral",
    [MapTerrain.Floor]: "bg-base-100 dark:bg-base-content",
    player: "bg-blue-500",
    health: "bg-green-700",
    monster: "bg-red-500",
    weapon: "bg-yellow-500",
    exit: "bg-purple-700",
    boss: "bg-red-900",
  };

  return (
    <div className="min-h-screen text-center">
      <h1 className="py-8 text-4xl font-bold">Roguelike</h1>

      <table className="mx-auto">
        <tbody>
          {Array.from(Array(gameConfig.mapHeight).keys()).map((y) => (
            <tr key={y}>
              {Array.from(Array(gameConfig.mapWidth).keys()).map((x) => (
                <td
                  key={x}
                  className={`h-2 w-2 ${
                    cellColor[
                      spriteMap.get(CoordinateKey.fromCoor({ x, y }))?.type ??
                        (gameMap.get(
                          CoordinateKey.fromCoor({ x, y })
                        ) as MapTerrain)
                    ]
                  }`}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
