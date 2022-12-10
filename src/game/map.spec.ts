import {
  CoordinateKey,
  generateMap,
  getRandomFloorCells,
  MapTerrain,
} from "@/game/map";

describe("map", () => {
  describe("CoordinateKey", () => {
    it("generates a string", () => {
      const coor = { x: 1, y: 2 };
      const coorKey = CoordinateKey.fromCoor(coor);

      expect(typeof coorKey).toBe("string");
    });

    it("returns 1,2 when x is 1 and y is 2", () => {
      const coor = { x: 1, y: 2 };
      const coorKey = CoordinateKey.fromCoor(coor);

      expect(coorKey).toBe("1,2");
    });

    it("returns 3,4 when x is 3 and y is 4", () => {
      const coor = { x: 3, y: 4 };
      const coorKey = CoordinateKey.fromCoor(coor);

      expect(coorKey).toBe("3,4");
    });

    it("can be converted back to a coordinate", () => {
      const coor = { x: 3, y: 4 };
      const coorKey = CoordinateKey.fromCoor(coor);

      const result = CoordinateKey.toCoor(coorKey);
      expect(result.x).toEqual(coor.x);
      expect(result.y).toEqual(coor.y);
    });
  });

  describe("generateMap", () => {
    it("should generate a map of size width * height", () => {
      const width = 10;
      const height = 10;

      const map = generateMap(width, height);
      expect(map.size).toBe(width * height);
    });

    it("should generate a map with walls around the edges", () => {
      const width = 8;
      const height = 5;

      const map = generateMap(width, height);

      for (let x = 0; x < width; x += 1) {
        expect(map.get(CoordinateKey.fromCoor({ x, y: 0 }))).toBe(
          MapTerrain.Wall
        );
        expect(map.get(CoordinateKey.fromCoor({ x, y: height - 1 }))).toBe(
          MapTerrain.Wall
        );
      }
      for (let y = 0; y < height; y += 1) {
        expect(map.get(CoordinateKey.fromCoor({ x: 0, y }))).toBe(
          MapTerrain.Wall
        );
        expect(map.get(CoordinateKey.fromCoor({ x: width - 1, y }))).toBe(
          MapTerrain.Wall
        );
      }
    });
  });

  describe("getRandomFloorCells", () => {
    it("should return an array of the requested size", () => {
      const gameMap = new Map<CoordinateKey, MapTerrain>();
      Array.from({ length: 10 }).forEach((_, i) => {
        gameMap.set(CoordinateKey.fromCoor({ x: i, y: 0 }), MapTerrain.Floor);
      });

      const result = getRandomFloorCells(gameMap, 5);
      expect(result.length).toBe(5);
    });

    it("should return an array of floor cells", () => {
      const gameMap = new Map<CoordinateKey, MapTerrain>();
      const floorCoors = Array.from({ length: 10 }).map((_, i) =>
        CoordinateKey.fromCoor({ x: i, y: 0 })
      );
      const wallCoors = Array.from({ length: 10 }).map((_, i) =>
        CoordinateKey.fromCoor({ x: i, y: 1 })
      );

      floorCoors.forEach((coor) => {
        gameMap.set(coor, MapTerrain.Floor);
      });
      wallCoors.forEach((coor) => {
        gameMap.set(coor, MapTerrain.Wall);
      });

      const result = getRandomFloorCells(gameMap, 5);

      result.forEach((coor) => {
        expect(gameMap.get(CoordinateKey.fromCoor(coor))).toBe(
          MapTerrain.Floor
        );
      });
    });

    it("should return all floor cells if requested size equals floor cell count", () => {
      const count = 10;
      const gameMap = new Map<CoordinateKey, MapTerrain>();
      const floorCoors = Array.from({ length: count }).map((_, i) =>
        CoordinateKey.fromCoor({ x: i, y: 0 })
      );

      floorCoors.forEach((coor) => {
        gameMap.set(coor, MapTerrain.Floor);
      });

      const result = getRandomFloorCells(gameMap, count);

      expect(result.map((coor) => CoordinateKey.fromCoor(coor)).sort()).toEqual(
        floorCoors.sort()
      );
    });

    it("should return an empty array if requested size is 0", () => {
      const gameMap = new Map<CoordinateKey, MapTerrain>();
      Array.from({ length: 10 }).forEach((_, i) => {
        gameMap.set(CoordinateKey.fromCoor({ x: i, y: 0 }), MapTerrain.Floor);
      });

      const result = getRandomFloorCells(gameMap, 0);

      expect(result).toEqual([]);
    });

    it("should return unique cells", () => {
      const gameMap = new Map<CoordinateKey, MapTerrain>();
      Array.from({ length: 10 }).forEach((_, i) => {
        gameMap.set(CoordinateKey.fromCoor({ x: i, y: 0 }), MapTerrain.Floor);
      });

      const result = getRandomFloorCells(gameMap, 5);
      const unique = new Set(
        result.map((coor) => CoordinateKey.fromCoor(coor))
      );

      expect(unique.size).toBe(result.length);
    });

    it("should throw an error if there are not enough floor cells", () => {
      const gameMap = new Map<CoordinateKey, MapTerrain>();

      expect(() => getRandomFloorCells(gameMap, 5)).toThrow(
        "Not enough floor cells to get random floor cells"
      );
    });
  });
});
