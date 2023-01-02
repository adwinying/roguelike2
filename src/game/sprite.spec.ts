import { CoordinateKey } from "@/game/map";
import {
  generateBoss,
  generateExit,
  generateHealths,
  generateMonsters,
  generatePlayer,
  generateWeapon,
  Level,
} from "@/game/sprite";

describe("sprite", () => {
  describe("generateMonsters", () => {
    it("should generate monsters at the given coordinates", () => {
      const level = 1;
      const coordinates = [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ];
      const monsters = generateMonsters(level, coordinates);

      expect(monsters.size).toBe(coordinates.length);
      expect(monsters.get(CoordinateKey.fromCoor(coordinates[0]))).toEqual({
        type: "monster",
        coordinate: coordinates[0],
        health: 10,
        defense: 1,
        attack: 3,
        exp: 10,
      });
      expect(monsters.get(CoordinateKey.fromCoor(coordinates[1]))).toEqual({
        type: "monster",
        coordinate: coordinates[1],
        health: 10,
        defense: 1,
        attack: 3,
        exp: 10,
      });
    });

    it.each([
      [1, 10, 1, 3, 10],
      [2, 12, 1, 4, 15],
      [3, 14, 2, 5, 20],
      [4, 16, 2, 6, 25],
      [5, 18, 3, 7, 30],
    ] as [Level, number, number, number, number][])(
      "should generate monsters at level %i with health %i, defense %i, attack %i and exp %i",
      (level, health, defense, attack, exp) => {
        const coordinates = [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
        ];
        const monsters = generateMonsters(level, coordinates);

        monsters.forEach((monster) => {
          expect(monster.health).toEqual(health);
          expect(monster.defense).toEqual(defense);
          expect(monster.attack).toEqual(attack);
          expect(monster.exp).toEqual(exp);
        });
      }
    );
  });

  describe("generatePlayer", () => {
    it("should generate a player at the given coordinate", () => {
      const coordinate = { x: 1, y: 1 };
      const player = generatePlayer(coordinate);

      expect(player).toEqual({
        type: "player",
        coordinate,
        health: 10,
        defense: 2,
        attack: 3,
        currExp: 0,
        maxExp: 50,
      });
    });
  });

  describe("generateHealths", () => {
    it("should generate healths at the given coordinates", () => {
      const level = 1;
      const coordinates = [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ];
      const healths = generateHealths(level, coordinates);

      expect(healths.size).toBe(coordinates.length);
      expect(healths.get(CoordinateKey.fromCoor(coordinates[0]))).toEqual({
        type: "health",
        coordinate: coordinates[0],
        health: 10,
      });
      expect(healths.get(CoordinateKey.fromCoor(coordinates[1]))).toEqual({
        type: "health",
        coordinate: coordinates[1],
        health: 10,
      });
      expect(healths.get(CoordinateKey.fromCoor(coordinates[2]))).toEqual({
        type: "health",
        coordinate: coordinates[2],
        health: 10,
      });
    });

    it.each([
      [1, 10],
      [2, 12],
      [3, 14],
      [4, 16],
      [5, 18],
    ] as [Level, number][])(
      "should generate health at level %i with health %i",
      (level, health) => {
        const coordinates = [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 3, y: 3 },
        ];
        const healthSprites = generateHealths(level, coordinates);

        healthSprites.forEach((sprite) => {
          expect(sprite.health).toEqual(health);
        });
      }
    );
  });

  describe("generateWeapon", () => {
    it("should generate a weapon at the given coordinate", () => {
      const level = 1;
      const coordinate = { x: 1, y: 1 };
      const weapon = generateWeapon(level, coordinate);

      expect(weapon).toEqual({ type: "weapon", coordinate, attack: 3 });
    });

    it.each([
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 4],
    ] as [Level, number][])(
      "should generate a weapon at level %i with attack %i",
      (level, attack) => {
        const coordinate = { x: 1, y: 1 };
        const weapon = generateWeapon(level, coordinate);

        expect(weapon.attack).toEqual(attack);
      }
    );
  });

  describe("generateExit", () => {
    it("should generate an exit at the given coordinate", () => {
      const coordinate = { x: 1, y: 1 };
      const exit = generateExit(coordinate);

      expect(exit).toEqual({ type: "exit", coordinate });
    });
  });

  describe("generateBoss", () => {
    it("should generate a boss at the given coordinate", () => {
      const coordinate = { x: 1, y: 1 };
      const boss = generateBoss(coordinate);

      expect(boss).toEqual({
        type: "boss",
        coordinate,
        health: 50,
        defense: 3,
        attack: 10,
      });
    });
  });
});
