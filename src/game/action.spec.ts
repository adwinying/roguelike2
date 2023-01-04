import { computeMove, getBattleOutcome } from "@/game/action";
import { CoordinateKey, MapTerrain } from "@/game/map";

describe("action", () => {
  describe("getBattleOutcome", () => {
    it("should return a battle outcome", () => {
      const player = {
        type: "player" as const,
        coordinate: { x: 1, y: 1 },
        attack: 11,
        defense: 12,
        health: 100,
        currExp: 0,
        maxExp: 50,
      };
      const monster = {
        type: "monster" as const,
        coordinate: { x: 1, y: 2 },
        attack: 13,
        defense: 14,
        health: 100,
        exp: 10,
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
        currExp: 0,
        maxExp: 50,
      };
      const monster = {
        type: "monster" as const,
        coordinate: { x: 1, y: 2 },
        attack: 13,
        defense: 14,
        health: 1,
        exp: 10,
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
        currExp: 0,
        maxExp: 50,
      };
      const monster = {
        type: "monster" as const,
        coordinate: { x: 1, y: 2 },
        attack: 1000,
        defense: 1,
        health: 1,
        exp: 10,
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
          currExp: 0,
          maxExp: 50,
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
          currExp: 0,
          maxExp: 50,
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
          currExp: 0,
          maxExp: 50,
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
          currExp: 0,
          maxExp: 50,
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

    it("returns target coordinate and player health when target cell is health", () => {
      const playerHealth = 10;
      const healthHealth = 15;

      const map = new Map();
      map.set("1,1", MapTerrain.Floor);
      map.set("1,2", MapTerrain.Floor);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: playerHealth,
          attack: 10,
          defense: 10,
          currExp: 0,
          maxExp: 50,
        },
        monsters: new Map(),
        healths: new Map([
          [
            CoordinateKey.fromCoor({ x: 1, y: 2 }),
            {
              type: "health" as const,
              coordinate: { x: 1, y: 2 },
              health: healthHealth,
            },
          ],
        ]),
      };

      const result = computeMove({ map, sprites }, "down");

      expect(result).toEqual({
        type: "health",
        playerCoor: { x: 1, y: 2 },
        playerHealth: playerHealth + healthHealth,
      });
    });

    it("returns target coordinate and player new attack when target cell is weapon", () => {
      const playerAttack = 10;
      const weaponAttack = 15;

      const map = new Map();
      map.set("1,1", MapTerrain.Floor);
      map.set("1,2", MapTerrain.Floor);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: 10,
          attack: playerAttack,
          defense: 10,
          currExp: 0,
          maxExp: 50,
        },
        weapon: {
          type: "weapon" as const,
          coordinate: { x: 1, y: 2 },
          attack: weaponAttack,
        },
        monsters: new Map(),
        healths: new Map(),
      };

      const result = computeMove({ map, sprites }, "down");

      expect(result).toEqual({
        type: "weapon",
        playerCoor: { x: 1, y: 2 },
        playerAttack: playerAttack + weaponAttack,
      });
    });

    it("returns defeat when target cell is monster and player runs out of health", () => {
      const map = new Map();
      map.set("1,1", MapTerrain.Floor);
      map.set("1,2", MapTerrain.Floor);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: 1,
          attack: 1,
          defense: 1,
          currExp: 0,
          maxExp: 50,
        },
        monsters: new Map([
          [
            CoordinateKey.fromCoor({ x: 1, y: 2 }),
            {
              type: "monster" as const,
              coordinate: { x: 1, y: 2 },
              health: 1000,
              attack: 1000,
              defense: 1000,
              exp: 10,
            },
          ],
        ]),
        healths: new Map(),
      };

      const result = computeMove({ map, sprites }, "down");

      expect(result).toEqual({
        type: "defeat",
      });
    });

    it("returns victory when target cell is boss and defeated", () => {
      const map = new Map();
      map.set("1,1", MapTerrain.Floor);
      map.set("1,2", MapTerrain.Floor);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: 1000,
          attack: 1000,
          defense: 1000,
          currExp: 0,
          maxExp: 50,
        },
        monsters: new Map(),
        healths: new Map(),
        boss: {
          type: "boss" as const,
          coordinate: { x: 1, y: 2 },
          health: 1,
          attack: 1,
          defense: 1,
        },
      };

      const result = computeMove({ map, sprites }, "down");

      expect(result).toEqual({
        type: "victory",
      });
    });

    it("returns kill and player/monster stats when target cell is monster and defeated", () => {
      const map = new Map();
      map.set("1,1", MapTerrain.Floor);
      map.set("1,2", MapTerrain.Floor);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: 10,
          attack: 1000,
          defense: 10,
          currExp: 0,
          maxExp: 50,
        },
        monsters: new Map([
          [
            CoordinateKey.fromCoor({ x: 1, y: 2 }),
            {
              type: "monster" as const,
              coordinate: { x: 1, y: 2 },
              health: 1,
              attack: 1000,
              defense: 1,
              exp: 10,
            },
          ],
        ]),
        healths: new Map(),
      };

      const result = computeMove({ map, sprites }, "down");

      const monster = [...sprites.monsters.values()][0];
      expect(result?.playerCoor).toEqual(sprites.player.coordinate);
      expect(result?.monsterCoor).toEqual(monster.coordinate);

      expect(result?.playerHealth).toEqual(sprites.player.health);
      expect(result?.playerDamage).toEqual(0);
      expect(result?.monsterHealth).toEqual(0);
      expect(result?.monsterDamage).toBeGreaterThan(0);
    });

    it("returns player exp when target cell is monster and defeated", () => {
      const map = new Map();
      map.set("1,1", MapTerrain.Floor);
      map.set("1,2", MapTerrain.Floor);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: 10,
          attack: 1000,
          defense: 10,
          currExp: 0,
          maxExp: 50,
        },
        monsters: new Map([
          [
            CoordinateKey.fromCoor({ x: 1, y: 2 }),
            {
              type: "monster" as const,
              coordinate: { x: 1, y: 2 },
              health: 1,
              attack: 1000,
              defense: 1,
              exp: 10,
            },
          ],
        ]),
        healths: new Map(),
      };

      const result = computeMove({ map, sprites }, "down");

      const { player } = sprites;
      const monster = [...sprites.monsters.values()][0];

      expect(result?.isLevelUp).toEqual(false);
      expect(result?.newExp).toEqual(player.currExp + monster.exp);
    });

    it("sets level up flag to true and returns remaining exp when player exp exceeds max exp", () => {
      const map = new Map();
      map.set("1,1", MapTerrain.Floor);
      map.set("1,2", MapTerrain.Floor);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: 10,
          attack: 1000,
          defense: 10,
          currExp: 45,
          maxExp: 50,
        },
        monsters: new Map([
          [
            CoordinateKey.fromCoor({ x: 1, y: 2 }),
            {
              type: "monster" as const,
              coordinate: { x: 1, y: 2 },
              health: 1,
              attack: 1000,
              defense: 1,
              exp: 10,
            },
          ],
        ]),
        healths: new Map(),
      };

      const result = computeMove({ map, sprites }, "down");

      const { player } = sprites;
      const monster = [...sprites.monsters.values()][0];

      expect(result?.isLevelUp).toEqual(true);
      expect(result?.newExp).toEqual(
        player.currExp + monster.exp - player.maxExp
      );
    });

    it("returns battle and player/monster stats when target cell is monster and not defeated", () => {
      const map = new Map();
      map.set("1,1", MapTerrain.Floor);
      map.set("1,2", MapTerrain.Floor);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: 100,
          attack: 10,
          defense: 5,
          currExp: 0,
          maxExp: 50,
        },
        monsters: new Map([
          [
            CoordinateKey.fromCoor({ x: 1, y: 2 }),
            {
              type: "monster" as const,
              coordinate: { x: 1, y: 2 },
              health: 100,
              attack: 10,
              defense: 5,
              exp: 10,
            },
          ],
        ]),
        healths: new Map(),
      };

      const result = computeMove({ map, sprites }, "down");
      const monster = [...sprites.monsters.values()][0];

      expect(result?.playerCoor).toEqual(sprites.player.coordinate);
      expect(result?.monsterCoor).toEqual(monster.coordinate);

      expect(result?.playerHealth).toBeLessThan(sprites.player.health);
      expect(result?.playerDamage).toBeGreaterThan(0);
      expect(result?.monsterHealth).toBeLessThan(monster.health);
      expect(result?.monsterDamage).toBeGreaterThan(0);
    });

    it("returns exit when target cell is exit", () => {
      const map = new Map();
      map.set("1,1", MapTerrain.Floor);
      map.set("1,2", MapTerrain.Floor);

      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          health: 100,
          attack: 10,
          defense: 5,
          currExp: 0,
          maxExp: 50,
        },
        monsters: new Map(),
        healths: new Map(),
        exit: {
          type: "exit" as const,
          coordinate: { x: 1, y: 2 },
        },
      };

      const result = computeMove({ map, sprites }, "down");

      expect(result).toEqual({
        type: "exit",
      });
    });
  });
});
