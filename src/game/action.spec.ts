import { computeMove } from "@/game/action";
import { MapTerrain } from "@/game/map";

describe("action", () => {
  describe("computeMove", () => {
    it("can determine target cell based on direction", () => {
      const map = new Map();
      map.set(CoordinateKey.fromCoor({ x: 1, y: 1 }), MapTerrain.Floor);
      map.set(CoordinateKey.fromCoor({ x: 1, y: 2 }), MapTerrain.Floor);
      map.set(CoordinateKey.fromCoor({ x: 1, y: 3 }), MapTerrain.Floor);
      map.set(CoordinateKey.fromCoor({ x: 2, y: 1 }), MapTerrain.Floor);
      map.set(CoordinateKey.fromCoor({ x: 2, y: 2 }), MapTerrain.Floor);
      map.set(CoordinateKey.fromCoor({ x: 2, y: 3 }), MapTerrain.Floor);
      map.set(CoordinateKey.fromCoor({ x: 3, y: 1 }), MapTerrain.Floor);
      map.set(CoordinateKey.fromCoor({ x: 3, y: 2 }), MapTerrain.Floor);
      map.set(CoordinateKey.fromCoor({ x: 3, y: 3 }), MapTerrain.Floor);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 2, y: 2 },
          health: 10,
          attack: 10,
          defense: 10,
        },
        weapon: {
          type: "weapon" as const,
          coordinate: { x: 1, y: 1 },
          attack: 15,
        },
        monsters: new Map(),
        healths: new Map(),
      };

      const moveUp = computeMove({ map, sprites }, "up");
      expect(moveUp).toEqual({ type: "movement", playerCoor: { x: 2, y: 1 } });

      const moveDown = computeMove({ map, sprites }, "down");
      expect(moveDown).toEqual({
        type: "movement",
        playerCoor: { x: 2, y: 3 },
      });

      const moveLeft = computeMove({ map, sprites }, "left");
      expect(moveLeft).toEqual({
        type: "movement",
        playerCoor: { x: 1, y: 2 },
      });

      const moveRight = computeMove({ map, sprites }, "right");
      expect(moveRight).toEqual({
        type: "movement",
        playerCoor: { x: 3, y: 2 },
      });
    });

    it("throws error when target cell is undefined", () => {
      const map = new Map();

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: 10,
          attack: 10,
          defense: 10,
        },
        weapon: {
          type: "weapon" as const,
          coordinate: { x: 1, y: 1 },
          attack: 15,
        },
        monsters: new Map(),
        healths: new Map(),
      };

      expect(() => computeMove({ map, sprites }, "up")).toThrowError(
        "Target cell not found"
      );
    });

    it("returns same coordinate when target cell is wall", () => {
      const map = new Map();
      map.set("1,1", MapTerrain.Floor);
      map.set("1,2", MapTerrain.Wall);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: 10,
          attack: 10,
          defense: 10,
        },
        weapon: {
          type: "weapon" as const,
          coordinate: { x: 1, y: 1 },
          attack: 15,
        },
        monsters: new Map(),
        healths: new Map(),
      };

      const result = computeMove({ map, sprites }, "down");

      expect(result).toEqual({
        type: "movement",
        playerCoor: { x: 1, y: 1 },
      });
    });

    it("returns target coordinate when target cell is floor", () => {
      const map = new Map();
      map.set("1,1", MapTerrain.Floor);
      map.set("1,2", MapTerrain.Floor);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: 10,
          attack: 10,
          defense: 10,
        },
        weapon: {
          type: "weapon" as const,
          coordinate: { x: 1, y: 1 },
          attack: 15,
        },
        monsters: new Map(),
        healths: new Map(),
      };

      const result = computeMove({ map, sprites }, "down");

      expect(result).toEqual({
        type: "movement",
        playerCoor: { x: 1, y: 2 },
      });
    });
  });
});
