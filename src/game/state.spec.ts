import { generatePlayer } from "@/game/sprite";
import { initGameState, config as gameConfig } from "@/game/state";

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
});
