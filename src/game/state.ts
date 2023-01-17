import {
  CoordinateKey,
  generateMap,
  getRandomFloorCells,
  MapTerrain,
} from "@/game/map";
import {
  generateBoss,
  generateExit,
  generateHealths,
  generateMonsters,
  generatePlayer,
  generateWeapon,
  toSpriteMap,
  Floor,
  Sprite,
} from "@/game/sprite";

export const config = {
  mapWidth: 100,
  mapHeight: 100,
  numOfMonsters: 9,
  numOfHealths: 6,
};

export type GameState = {
  isFlashlightOn: boolean;
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
    isFlashlightOn: true,
    floor,
    map,
    sprites,
  };
}

export function printMap(state: GameState, width: number, height: number) {
  const [mapWidth, mapHeight] = (() => {
    let currWidth = 0;
    let currHeight = 0;

    state.map.forEach((_, key) => {
      const { x, y } = CoordinateKey.toCoor(key);
      currWidth = Math.max(currWidth, x);
      currHeight = Math.max(currHeight, y);
    });

    return [currWidth + 1, currHeight + 1];
  })();

  if (width > mapWidth || height > mapHeight)
    throw new Error("width and height should be less than map size");

  const map: (MapTerrain | Sprite["type"])[][] = [];
  const playerCoor = state.sprites.player.coordinate;
  const spriteCoors = toSpriteMap(state.sprites);

  const startX =
    playerCoor.x + Math.floor(width / 2) < mapWidth
      ? Math.max(0, playerCoor.x - Math.floor(width / 2))
      : mapWidth - width;
  const startY =
    playerCoor.y + Math.floor(height / 2) < mapHeight
      ? Math.max(0, playerCoor.y - Math.floor(height / 2))
      : mapHeight - height;

  for (let x = startX; x < startX + width; x += 1) {
    for (let y = startY; y < startY + height; y += 1) {
      const coorKey = CoordinateKey.fromCoor({ x, y });
      const cellType = spriteCoors.get(coorKey)?.type ?? state.map.get(coorKey);

      if (cellType === undefined) throw new Error("Invalid map cell");

      const printCoorX = x - startX;
      const printCoorY = y - startY;

      if (map[printCoorY] === undefined) map[printCoorY] = [];
      map[printCoorY][printCoorX] = cellType;
    }
  }

  return map;
}
