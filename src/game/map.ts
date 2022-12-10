const config = {
  floorToWallRatio: 0.3,
  bunchRounds: 2,
  playableAreaRatio: 0.25,
};

export type Coordinate = {
  x: number;
  y: number;
};
// a hacky way to define a specific string as a type
export abstract class CoordinateKey extends String {
  public static fromCoor(coordinate: Coordinate): CoordinateKey {
    return `${coordinate.x},${coordinate.y}` as unknown as CoordinateKey;
  }

  public static fromString(string: string): CoordinateKey {
    if (!/^\d+,\d+$/.test(string)) throw new Error("Invalid coordinate key");

    return string as unknown as CoordinateKey;
  }

  public static toCoor(coordinateKey: CoordinateKey): Coordinate {
    const [x, y] = coordinateKey.split(",").map(Number);

    return { x, y };
  }

  // a private property to make sure this class can't be coerced from a string
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private __coordinateKeyFlag: never;
}

export enum MapTerrain {
  Floor,
  Wall,
}

export type GameMap = Map<CoordinateKey, MapTerrain>;
export function generateMap(width: number, height: number): GameMap {
  let gameMap = new Map<CoordinateKey, MapTerrain>();
  // randomly generate a floor map
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      gameMap.set(
        CoordinateKey.fromCoor({ x, y }),
        Math.random() > config.floorToWallRatio
          ? MapTerrain.Floor
          : MapTerrain.Wall
      );
    }
  }

  // "bunch up" the walls loosely based off game of life rules
  for (let i = 0; i < config.bunchRounds; i += 1) {
    const newMap = new Map<CoordinateKey, MapTerrain>();

    for (let x = 0; x < width; x += 1) {
      for (let y = 0; y < height; y += 1) {
        const coor = { x, y };
        const coorKey = CoordinateKey.fromCoor(coor);
        const terrain = gameMap.get(coorKey);

        if (terrain === undefined) throw new Error("Invalid map");

        const neighbors = [
          { x: x - 1, y },
          { x: x + 1, y },
          { x, y: y - 1 },
          { x, y: y + 1 },
          { x: x - 1, y: y - 1 },
          { x: x + 1, y: y - 1 },
          { x: x - 1, y: y + 1 },
          { x: x + 1, y: y + 1 },
        ];

        // eslint-disable-next-line @typescript-eslint/no-loop-func
        const wallCount = neighbors.reduce((count, neighbor) => {
          const neighborKey = CoordinateKey.fromCoor(neighbor);
          const neighborTerrain = gameMap.get(neighborKey);

          return neighborTerrain === MapTerrain.Wall ? count + 1 : count;
        }, 0);

        if (wallCount < 2) {
          newMap.set(coorKey, MapTerrain.Floor);
          continue;
        }

        if (wallCount >= 4) {
          newMap.set(coorKey, MapTerrain.Wall);
          continue;
        }

        newMap.set(coorKey, terrain);
      }
    }

    gameMap = newMap;
  }

  // add some walls around the edges
  for (let x = 0; x < width; x += 1) {
    gameMap.set(CoordinateKey.fromCoor({ x, y: 0 }), MapTerrain.Wall);
    gameMap.set(CoordinateKey.fromCoor({ x, y: height - 1 }), MapTerrain.Wall);
  }
  for (let y = 0; y < height; y += 1) {
    gameMap.set(CoordinateKey.fromCoor({ x: 0, y }), MapTerrain.Wall);
    gameMap.set(CoordinateKey.fromCoor({ x: width - 1, y }), MapTerrain.Wall);
  }

  // pick a random point on the map that is a floor cell
  const randomFloorCell = (() => {
    let x;
    let y;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * height);

      if (gameMap.get(CoordinateKey.fromCoor({ x, y })) === MapTerrain.Floor)
        break;
    }

    return { x, y };
  })();

  // turn all cells not connected to the random floor cell into walls
  const visited: Set<CoordinateKey> = new Set();
  const queue: CoordinateKey[] = [CoordinateKey.fromCoor(randomFloorCell)];

  while (queue.length > 0) {
    const coorKey = queue.pop();
    if (!coorKey) break;

    const { x, y } = CoordinateKey.toCoor(coorKey);
    visited.add(CoordinateKey.fromCoor({ x, y }));

    const neighbors = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ];

    neighbors.forEach((neighbor) => {
      const neighborCoorKey = CoordinateKey.fromCoor(neighbor);

      if (
        gameMap.get(neighborCoorKey) === MapTerrain.Floor &&
        !visited.has(neighborCoorKey) &&
        !queue.includes(neighborCoorKey)
      )
        queue.push(neighborCoorKey);
    });
  }

  gameMap.forEach((terrain, coordinateKey) => {
    if (terrain === MapTerrain.Floor && !visited.has(coordinateKey))
      gameMap.set(coordinateKey, MapTerrain.Wall);
  });

  // check map exceeds playableAreaRatio
  const floorCount = [...gameMap.values()].filter(
    (terrain) => terrain === MapTerrain.Floor
  ).length;

  if (floorCount / (width * height) < config.playableAreaRatio)
    return generateMap(width, height);

  return gameMap;
}

export function getRandomFloorCells(
  gameMap: GameMap,
  count: number
): Coordinate[] {
  const floorCells = [...gameMap.entries()]
    .filter(([_, terrain]) => terrain === MapTerrain.Floor)
    .map(([coor]) => CoordinateKey.toCoor(coor));

  if (floorCells.length < count)
    throw new Error("Not enough floor cells to get random floor cells");

  // shuffle the array and return the first count elements
  return floorCells.sort(() => Math.random() - 0.5).slice(0, count);
}
