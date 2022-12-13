import { initGameState, config as gameConfig } from "@/game/state";

describe("state", () => {
  describe("initGameState", () => {
    it("should generate a game state", () => {
      const state = initGameState();

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
