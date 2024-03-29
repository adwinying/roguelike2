import {
  Coordinate,
  CoordinateKey,
  GameMap,
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
  visibleRadius: 7,
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

export function getSurroundingCellCoors(map: GameMap, center: Coordinate) {
  const { x, y } = center;

  // corner cells will be ignored to get "rounded" corners
  const cornerCells = new Set(
    [
      // top left
      { x: x - 6, y: y - 6 },
      { x: x - 5, y: y - 6 },
      { x: x - 4, y: y - 6 },
      { x: x - 6, y: y - 5 },
      { x: x - 5, y: y - 5 },
      { x: x - 6, y: y - 4 },

      // top right
      { x: x + 6, y: y - 6 },
      { x: x + 5, y: y - 6 },
      { x: x + 4, y: y - 6 },
      { x: x + 6, y: y - 5 },
      { x: x + 5, y: y - 5 },
      { x: x + 6, y: y - 4 },

      // bottom left
      { x: x - 6, y: y + 6 },
      { x: x - 5, y: y + 6 },
      { x: x - 4, y: y + 6 },
      { x: x - 6, y: y + 5 },
      { x: x - 5, y: y + 5 },
      { x: x - 6, y: y + 4 },

      // bottom right
      { x: x + 6, y: y + 6 },
      { x: x + 5, y: y + 6 },
      { x: x + 4, y: y + 6 },
      { x: x + 6, y: y + 5 },
      { x: x + 5, y: y + 5 },
      { x: x + 6, y: y + 4 },
    ].map((coor) => CoordinateKey.fromCoor(coor))
  );

  const maxRange = config.visibleRadius - 1; // -1 for the center cell
  const surroundingCoors = new Set<CoordinateKey>();
  for (let i = -maxRange; i <= maxRange; i += 1) {
    for (let j = -maxRange; j <= maxRange; j += 1) {
      const coorKey = CoordinateKey.fromCoor({ x: x + i, y: y + j });

      if (!cornerCells.has(coorKey) && map.has(coorKey))
        surroundingCoors.add(coorKey);
    }
  }

  return surroundingCoors;
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

  const map: (MapTerrain | Sprite["type"] | "fog")[][] = [];
  const playerCoor = state.sprites.player.coordinate;
  const spriteCoors = toSpriteMap(state.sprites);

  const surroundingCoors = state.isFlashlightOn
    ? getSurroundingCellCoors(state.map, state.sprites.player.coordinate)
    : undefined;

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
      const printCoorX = x - startX;
      const printCoorY = y - startY;

      if (surroundingCoors && !surroundingCoors.has(coorKey)) {
        if (map[printCoorY] === undefined) map[printCoorY] = [];
        map[printCoorY][printCoorX] = "fog";
        continue;
      }

      const cellType = spriteCoors.get(coorKey)?.type ?? state.map.get(coorKey);

      if (cellType === undefined) throw new Error("Invalid map cell");

      if (map[printCoorY] === undefined) map[printCoorY] = [];
      map[printCoorY][printCoorX] = cellType;
    }
  }

  return map;
}
