import { CoordinateKey } from "@/game/map";
import {
  generateBoss,
  generateExit,
  generateHealths,
  generateMonsters,
  generatePlayer,
  generateWeapon,
} from "@/game/sprite";

describe("sprite", () => {
  describe("generateMonsters", () => {
    it("should generate monsters at the given coordinates", () => {
      const coordinates = [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ];
      const monsters = generateMonsters(coordinates);

      expect(monsters.size).toBe(coordinates.length);
      expect(monsters.get(CoordinateKey.fromCoor(coordinates[0]))).toEqual({
        type: "monster",
        coordinate: coordinates[0],
        health: 10,
        defense: 1,
        attack: 3,
      });
      expect(monsters.get(CoordinateKey.fromCoor(coordinates[1]))).toEqual({
        type: "monster",
        coordinate: coordinates[1],
        health: 10,
        defense: 1,
        attack: 3,
      });
    });
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
      });
    });
  });

  describe("generateHealths", () => {
    it("should generate healths at the given coordinates", () => {
      const coordinates = [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ];
      const healths = generateHealths(coordinates);

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
  });

  describe("generateWeapon", () => {
    it("should generate a weapon at the given coordinate", () => {
      const coordinate = { x: 1, y: 1 };
      const weapon = generateWeapon(coordinate);

      expect(weapon).toEqual({ type: "weapon", coordinate, attack: 8 });
    });
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
