import { CoordinateKey, MapTerrain } from "./map";

import { generatePlayer } from "@/game/sprite";
import { initGameState, config as gameConfig, printMap } from "@/game/state";

describe("state", () => {
  describe("initGameState", () => {
    it("should generate a game state", () => {
      const floor = 1;
      const state = initGameState(floor);

      expect(state.floor).toEqual(floor);

      expect(state.map.size).toEqual(
        gameConfig.mapWidth * gameConfig.mapHeight
      );

      expect(state.sprites.player).toMatchObject({
        type: "player",
        coordinate: {
          x: expect.any(Number) as number,
          y: expect.any(Number) as number,
        },
        health: expect.any(Number) as number,
        attack: expect.any(Number) as number,
        defense: expect.any(Number) as number,
      });

      expect(state.sprites.weapon).toMatchObject({
        type: "weapon",
        coordinate: {
          x: expect.any(Number) as number,
          y: expect.any(Number) as number,
        },
      });

      expect(state.sprites.exit).toMatchObject({
        type: "exit",
        coordinate: {
          x: expect.any(Number) as number,
          y: expect.any(Number) as number,
        },
      });

      expect(state.sprites.boss).toBeUndefined();

      expect(state.sprites.monsters.size).toEqual(gameConfig.numOfMonsters);
      [...state.sprites.monsters.values()].forEach((monster) => {
        expect(monster).toMatchObject({
          type: "monster",
          coordinate: {
            x: expect.any(Number) as number,
            y: expect.any(Number) as number,
          },
          health: expect.any(Number) as number,
          attack: expect.any(Number) as number,
          defense: expect.any(Number) as number,
        });
      });

      expect(state.sprites.healths.size).toEqual(gameConfig.numOfHealths);
      [...state.sprites.healths.values()].forEach((health) => {
        expect(health).toMatchObject({
          type: "health",
          coordinate: {
            x: expect.any(Number) as number,
            y: expect.any(Number) as number,
          },
        });
      });
    });

    it("should generate a game state with boss when floor is 5", () => {
      const floor = 5;
      const playerState = generatePlayer({ x: 1, y: 1 });
      const state = initGameState(floor, playerState);

      expect(state.floor).toEqual(floor);

      expect(state.map.size).toEqual(
        gameConfig.mapWidth * gameConfig.mapHeight
      );

      expect(state.sprites.player).toMatchObject({
        type: "player",
        coordinate: {
          x: expect.any(Number) as number,
          y: expect.any(Number) as number,
        },
        health: expect.any(Number) as number,
        attack: expect.any(Number) as number,
        defense: expect.any(Number) as number,
      });

      expect(state.sprites.weapon).toMatchObject({
        type: "weapon",
        coordinate: {
          x: expect.any(Number) as number,
          y: expect.any(Number) as number,
        },
      });

      expect(state.sprites.exit).toBeUndefined();

      expect(state.sprites.boss).toMatchObject({
        type: "boss",
        coordinate: {
          x: expect.any(Number) as number,
          y: expect.any(Number) as number,
        },
        health: expect.any(Number) as number,
        attack: expect.any(Number) as number,
        defense: expect.any(Number) as number,
      });

      expect(state.sprites.monsters.size).toEqual(gameConfig.numOfMonsters);
      [...state.sprites.monsters.values()].forEach((monster) => {
        expect(monster).toMatchObject({
          type: "monster",
          coordinate: {
            x: expect.any(Number) as number,
            y: expect.any(Number) as number,
          },
          health: expect.any(Number) as number,
          attack: expect.any(Number) as number,
          defense: expect.any(Number) as number,
        });
      });

      expect(state.sprites.healths.size).toEqual(gameConfig.numOfHealths);
      [...state.sprites.healths.values()].forEach((health) => {
        expect(health).toMatchObject({
          type: "health",
          coordinate: {
            x: expect.any(Number) as number,
            y: expect.any(Number) as number,
          },
        });
      });
    });
  });

  const map = new Map();
  map.set(CoordinateKey.fromCoor({ x: 0, y: 0 }), MapTerrain.Floor);
  map.set(CoordinateKey.fromCoor({ x: 0, y: 1 }), MapTerrain.Floor);
  map.set(CoordinateKey.fromCoor({ x: 0, y: 2 }), MapTerrain.Floor);
  map.set(CoordinateKey.fromCoor({ x: 1, y: 0 }), MapTerrain.Floor);
  map.set(CoordinateKey.fromCoor({ x: 1, y: 1 }), MapTerrain.Floor);
  map.set(CoordinateKey.fromCoor({ x: 1, y: 2 }), MapTerrain.Floor);
  map.set(CoordinateKey.fromCoor({ x: 2, y: 0 }), MapTerrain.Floor);
  map.set(CoordinateKey.fromCoor({ x: 2, y: 1 }), MapTerrain.Floor);
  map.set(CoordinateKey.fromCoor({ x: 2, y: 2 }), MapTerrain.Floor);

  describe("printMap", () => {
    it("should print a map based on current state with specified size", () => {
      const width = 3;
      const height = 3;
      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          attack: 1,
          defense: 1,
          health: 1,
          level: 1,
          currExp: 1,
          maxExp: 1,
        },
        healths: new Map(),
        monsters: new Map(),
      };

      const state = { floor: 1 as const, map, sprites };

      const printedMap = printMap(state, width, height);

      expect(printedMap.length).toEqual(height);
      printedMap.forEach((row) => {
        expect(row.length).toEqual(width);
      });
    });

    it("should print a map with the sprites in the map", () => {
      const width = 3;
      const height = 3;
      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          attack: 1,
          defense: 1,
          health: 1,
          level: 1,
          currExp: 1,
          maxExp: 1,
        },
        healths: new Map([
          [
            CoordinateKey.fromCoor({ x: 0, y: 0 }),
            {
              type: "health" as const,
              coordinate: { x: 0, y: 0 },
              health: 1,
            },
          ],
        ]),
        monsters: new Map([
          [
            CoordinateKey.fromCoor({ x: 2, y: 2 }),
            {
              type: "monster" as const,
              coordinate: { x: 2, y: 2 },
              attack: 1,
              defense: 1,
              health: 1,
              exp: 1,
            },
          ],
        ]),
      };

      const state = { floor: 1 as const, map, sprites };

      const printedMap = printMap(state, width, height);

      expect(printedMap[0][0]).toEqual("health");
      expect(printedMap[1][1]).toEqual("player");
      expect(printedMap[2][2]).toEqual("monster");
    });

    it("should print a part of the map if size specified is smaller than the map", () => {
      const width = 1;
      const height = 1;
      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          attack: 1,
          defense: 1,
          health: 1,
          level: 1,
          currExp: 1,
          maxExp: 1,
        },
        healths: new Map(),
        monsters: new Map(),
      };

      const state = { floor: 1 as const, map, sprites };

      const printedMap = printMap(state, width, height);

      expect(printedMap.length).toEqual(height);
      printedMap.forEach((row) => {
        expect(row.length).toEqual(width);
      });

      expect(printedMap[0][0]).toEqual("player");
    });

    it("should throw error if width specified is larger than map width", () => {
      const width = 101;
      const height = 3;
      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          attack: 1,
          defense: 1,
          health: 1,
          level: 1,
          currExp: 1,
          maxExp: 1,
        },
        healths: new Map(),
        monsters: new Map(),
      };

      const state = { floor: 1 as const, map, sprites };

      expect(() => printMap(state, width, height)).toThrowError(
        "width and height should be less than map size"
      );
    });

    it("should throw error if height specified is larger than map height", () => {
      const width = 3;
      const height = 101;
      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 1, y: 1 },
          attack: 1,
          defense: 1,
          health: 1,
          level: 1,
          currExp: 1,
          maxExp: 1,
        },
        healths: new Map(),
        monsters: new Map(),
      };

      const state = { floor: 1 as const, map, sprites };

      expect(() => printMap(state, width, height)).toThrowError(
        "width and height should be less than map size"
      );
    });

    it("should print player off center if player is at top left edge of map", () => {
      const width = 3;
      const height = 3;
      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 0, y: 0 },
          attack: 1,
          defense: 1,
          health: 1,
          level: 1,
          currExp: 1,
          maxExp: 1,
        },
        healths: new Map(),
        monsters: new Map(),
      };

      const state = { floor: 1 as const, map, sprites };

      const printedMap = printMap(state, width, height);

      expect(printedMap.length).toEqual(height);
      printedMap.forEach((row) => {
        expect(row.length).toEqual(width);
      });

      expect(printedMap[0][0]).toEqual("player");
    });

    it("should print player off center if player is at bottom right edge of map", () => {
      const width = 3;
      const height = 3;
      const sprites = {
        player: {
          type: "player" as const,
          coordinate: { x: 2, y: 2 },
          attack: 1,
          defense: 1,
          health: 1,
          level: 1,
          currExp: 1,
          maxExp: 1,
        },
        healths: new Map(),
        monsters: new Map(),
      };

      const state = { floor: 1 as const, map, sprites };

      const printedMap = printMap(state, width, height);

      expect(printedMap.length).toEqual(height);
      printedMap.forEach((row) => {
        expect(row.length).toEqual(width);
      });

      expect(printedMap[2][2]).toEqual("player");
    });
  });
});
