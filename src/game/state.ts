import { generateMap, getRandomFloorCells } from "@/game/map";
import {
  generateExit,
  generateHealths,
  generateMonsters,
  generatePlayer,
  generateWeapon,
} from "@/game/sprite";

export const config = {
  mapWidth: 100,
  mapHeight: 100,
  numOfMonsters: 9,
  numOfHealths: 6,
};

export function initGameState() {
  const map = generateMap(config.mapWidth, config.mapHeight);
  // 3 for player, weapon, and exit/boss
  const numOfSprites = config.numOfMonsters + config.numOfHealths + 3;
  const spriteCoors = getRandomFloorCells(map, numOfSprites);

  const sprites = {
    player: generatePlayer(spriteCoors[0]),
    weapon: generateWeapon(spriteCoors[1]),
    exit: generateExit(spriteCoors[2]),
    healths: generateHealths(spriteCoors.slice(3, 3 + config.numOfHealths)),
    monsters: generateMonsters(
      spriteCoors.slice(3 + config.numOfHealths, numOfSprites)
    ),
  };

  return {
    map,
    sprites,
  };
}
