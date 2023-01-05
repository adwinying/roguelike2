import { generateMap, getRandomFloorCells } from "@/game/map";
import {
  generateBoss,
  generateExit,
  generateHealths,
  generateMonsters,
  generatePlayer,
  generateWeapon,
  Floor,
} from "@/game/sprite";

export const config = {
  mapWidth: 100,
  mapHeight: 100,
  numOfMonsters: 9,
  numOfHealths: 6,
};

export type GameState = {
  floor: Floor;
  map: ReturnType<typeof generateMap>;
  sprites: {
    player: ReturnType<typeof generatePlayer>;
    weapon?: ReturnType<typeof generateWeapon>;
    exit?: ReturnType<typeof generateExit>;
    boss?: ReturnType<typeof generateBoss>;
    healths: ReturnType<typeof generateHealths>;
    monsters: ReturnType<typeof generateMonsters>;
  };
};
export function initGameState(
  floor: Floor,
  playerState?: GameState["sprites"]["player"]
): GameState {
  if (floor > 1 && !playerState)
    throw new Error("playerState is required for floor > 1");

  const map = generateMap(config.mapWidth, config.mapHeight);
  // 3 for player, weapon, and exit/boss
  const numOfSprites = config.numOfMonsters + config.numOfHealths + 3;
  const spriteCoors = getRandomFloorCells(map, numOfSprites);

  const sprites = {
    player: playerState
      ? { ...playerState, coordinate: spriteCoors[0] }
      : generatePlayer(spriteCoors[0]),
    weapon: generateWeapon(floor, spriteCoors[1]),
    exit: floor < 5 ? generateExit(spriteCoors[2]) : undefined,
    boss: floor === 5 ? generateBoss(spriteCoors[2]) : undefined,
    healths: generateHealths(
      floor,
      spriteCoors.slice(3, 3 + config.numOfHealths)
    ),
    monsters: generateMonsters(
      floor,
      spriteCoors.slice(3 + config.numOfHealths, numOfSprites)
    ),
  };

  return {
    floor,
    map,
    sprites,
  };
}
