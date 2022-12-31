import { generateMap, getRandomFloorCells } from "@/game/map";
import {
  generateBoss,
  generateExit,
  generateHealths,
  generateMonsters,
  generatePlayer,
  generateWeapon,
  Level,
} from "@/game/sprite";

export const config = {
  mapWidth: 100,
  mapHeight: 100,
  numOfMonsters: 9,
  numOfHealths: 6,
};

export type GameState = {
  level: Level;
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
  level: Level,
  playerState?: GameState["sprites"]["player"]
): GameState {
  if (level > 1 && !playerState)
    throw new Error("playerState is required for level > 1");

  const map = generateMap(config.mapWidth, config.mapHeight);
  // 3 for player, weapon, and exit/boss
  const numOfSprites = config.numOfMonsters + config.numOfHealths + 3;
  const spriteCoors = getRandomFloorCells(map, numOfSprites);

  const sprites = {
    player: playerState
      ? { ...playerState, coordinate: spriteCoors[0] }
      : generatePlayer(spriteCoors[0]),
    weapon: generateWeapon(level, spriteCoors[1]),
    exit: level < 5 ? generateExit(spriteCoors[2]) : undefined,
    boss: level === 5 ? generateBoss(spriteCoors[2]) : undefined,
    healths: generateHealths(
      level,
      spriteCoors.slice(3, 3 + config.numOfHealths)
    ),
    monsters: generateMonsters(
      level,
      spriteCoors.slice(3 + config.numOfHealths, numOfSprites)
    ),
  };

  return {
    level,
    map,
    sprites,
  };
}
