import { computeMove, getBattleOutcome } from "@/game/action";
import { MapTerrain } from "@/game/map";

describe("action", () => {
  describe("getBattleOutcome", () => {
    it("should return a battle outcome", () => {
      const player = {
        type: "player" as const,
        coordinate: { x: 1, y: 1 },
        attack: 11,
        defense: 12,
        health: 100,
      };
      const monster = {
        type: "monster" as const,
        coordinate: { x: 1, y: 2 },
        attack: 13,
        defense: 14,
        health: 100,
      };

      const outcome = getBattleOutcome(player, monster);

      expect(outcome.playerDamage).toBeDefined();
      expect(outcome.monsterDamage).toBeDefined();
      expect(outcome.playerHealth).toBeDefined();
      expect(outcome.monsterHealth).toBeDefined();

      expect(outcome.playerHealth).toBeLessThanOrEqual(player.health);
      expect(outcome.monsterHealth).toBeLessThanOrEqual(monster.health);
    });

    it("should never return a negative health", () => {
      const player = {
        type: "player" as const,
        coordinate: { x: 1, y: 1 },
        attack: 11,
        defense: 12,
        health: 1,
      };
      const monster = {
        type: "monster" as const,
        coordinate: { x: 1, y: 2 },
        attack: 13,
        defense: 14,
        health: 1,
      };

      const outcome = getBattleOutcome(player, monster);

      expect(outcome.playerHealth).toBeGreaterThanOrEqual(0);
      expect(outcome.monsterHealth).toBeGreaterThanOrEqual(0);
    });

    it("return 0 monster damage if monster health is 0", () => {
      const player = {
        type: "player" as const,
        coordinate: { x: 1, y: 1 },
        attack: 13,
        defense: 14,
        health: 100,
      };
      const monster = {
        type: "monster" as const,
        coordinate: { x: 1, y: 2 },
        attack: 1000,
        defense: 1,
        health: 1,
      };

      const outcome = getBattleOutcome(player, monster);

      expect(outcome.playerDamage).toBe(0);
      expect(outcome.monsterDamage).toBeGreaterThanOrEqual(1);
      expect(outcome.playerHealth).toBe(player.health);
      expect(outcome.monsterHealth).toBe(0);
    });
  });

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
