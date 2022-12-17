import { Coordinate, CoordinateKey, GameMap, MapTerrain } from "@/game/map";
import {
  Exit,
  Health,
  Monster,
  Player,
  toSpriteMap,
  Weapon,
} from "@/game/sprite";

export function computeMove(
  {
    map,
    sprites,
  }: {
    map: GameMap;
    sprites: {
      player: Player;
      weapon: Weapon;
      monsters: Map<CoordinateKey, Monster>;
      healths: Map<CoordinateKey, Health>;
      exit: Exit;
    };
  },
  direction: "up" | "down" | "left" | "right"
) {
  const spriteMap = toSpriteMap(sprites);
  const playerCoor = sprites.player.coordinate;
  const targetCoor: Coordinate = {
    up: { x: playerCoor.x, y: playerCoor.y - 1 },
    down: { x: playerCoor.x, y: playerCoor.y + 1 },
    left: { x: playerCoor.x - 1, y: playerCoor.y },
    right: { x: playerCoor.x + 1, y: playerCoor.y },
  }[direction];

  const targetCoorKey = CoordinateKey.fromCoor(targetCoor);
  const targetCell = spriteMap.get(targetCoorKey) ?? map.get(targetCoorKey);

  if (targetCell === undefined) throw new Error("Target cell not found");

  if (targetCell === MapTerrain.Wall)
    return {
      type: "movement" as const,
      playerCoor: sprites.player.coordinate,
    };

  if (targetCell === MapTerrain.Floor)
    return {
      type: "movement" as const,
      playerCoor: targetCoor,
    };

  return undefined;
}

export default null;
