import { CoordinateKey, MapTerrain } from "./map";

import { generatePlayer } from "@/game/sprite";
import {
  initGameState,
  config as gameConfig,
  printMap,
  getSurroundingCellCoors,
} from "@/game/state";

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

  describe("getSurroundingCellCoors", () => {
    it("should return surrounding cell coordinates", () => {
      const map = new Map<CoordinateKey, MapTerrain>();
      for (let x = 0; x < 13; x += 1) {
        for (let y = 0; y < 13; y += 1) {
          map.set(CoordinateKey.fromCoor({ x, y }), MapTerrain.Floor);
        }
      }

      const center = { x: 6, y: 6 };
      const result = getSurroundingCellCoors(map, center);

      const expected = new Set<CoordinateKey>();

      // normal rows
      for (let x = 0; x < 13; x += 1) {
        for (let y = 3; y < 10; y += 1) {
          expected.add(CoordinateKey.fromCoor({ x, y }));
        }
      }

      // topmost/bottommost rows
      for (let x = 3; x < 10; x += 1) {
        expected.add(CoordinateKey.fromCoor({ x, y: 0 }));
        expected.add(CoordinateKey.fromCoor({ x, y: 12 }));
      }

      // 2nd topmost/2nd bottommost rows
      for (let x = 2; x < 11; x += 1) {
        expected.add(CoordinateKey.fromCoor({ x, y: 1 }));
        expected.add(CoordinateKey.fromCoor({ x, y: 11 }));
      }

      // 3rd topmost/3rd bottommost rows
      for (let x = 1; x < 12; x += 1) {
        expected.add(CoordinateKey.fromCoor({ x, y: 2 }));
        expected.add(CoordinateKey.fromCoor({ x, y: 10 }));
      }

      expect(result.size).toEqual(expected.size);
      expect(result).toEqual(expected);
    });

    it("should only return coordinates that are within the map", () => {
      const map = new Map<CoordinateKey, MapTerrain>();
      for (let x = 0; x < 13; x += 1) {
        for (let y = 0; y < 13; y += 1) {
          map.set(CoordinateKey.fromCoor({ x, y }), MapTerrain.Floor);
        }
      }

      const center = { x: 0, y: 0 };
      const result = getSurroundingCellCoors(map, center);

      const expected = new Set<CoordinateKey>(
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 },
          { x: 4, y: 0 },
          { x: 5, y: 0 },
          { x: 6, y: 0 },

          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 3, y: 1 },
          { x: 4, y: 1 },
          { x: 5, y: 1 },
          { x: 6, y: 1 },

          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 2, y: 2 },
          { x: 3, y: 2 },
          { x: 4, y: 2 },
          { x: 5, y: 2 },
          { x: 6, y: 2 },

          { x: 0, y: 3 },
          { x: 1, y: 3 },
          { x: 2, y: 3 },
          { x: 3, y: 3 },
          { x: 4, y: 3 },
          { x: 5, y: 3 },
          { x: 6, y: 3 },

          { x: 0, y: 4 },
          { x: 1, y: 4 },
          { x: 2, y: 4 },
          { x: 3, y: 4 },
          { x: 4, y: 4 },
          { x: 5, y: 4 },

          { x: 0, y: 5 },
          { x: 1, y: 5 },
          { x: 2, y: 5 },
          { x: 3, y: 5 },
          { x: 4, y: 5 },

          { x: 0, y: 6 },
          { x: 1, y: 6 },
          { x: 2, y: 6 },
          { x: 3, y: 6 },
        ].map((coor) => CoordinateKey.fromCoor(coor))
      );

      expect(result.size).toEqual(expected.size);
      expect(result).toEqual(expected);
    });
  });

  const map = new Map<CoordinateKey, MapTerrain>();
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

      const state = { isFlashlightOn: true, floor: 1 as const, map, sprites };

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

      const state = { isFlashlightOn: true, floor: 1 as const, map, sprites };

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

      const state = { isFlashlightOn: true, floor: 1 as const, map, sprites };

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

      const state = { isFlashlightOn: true, floor: 1 as const, map, sprites };

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

      const state = { isFlashlightOn: true, floor: 1 as const, map, sprites };

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

      const state = { isFlashlightOn: true, floor: 1 as const, map, sprites };

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

      const state = { isFlashlightOn: true, floor: 1 as const, map, sprites };

      const printedMap = printMap(state, width, height);

      expect(printedMap.length).toEqual(height);
      printedMap.forEach((row) => {
        expect(row.length).toEqual(width);
      });

      expect(printedMap[2][2]).toEqual("player");
    });
  });
});
