import { CoordinateKey, generateMap, MapTerrain } from "@/game/map";

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
});
