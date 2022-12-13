import { Coordinate, CoordinateKey } from "@/game/map";

export type Monster = {
  readonly type: "monster";
  coordinate: Coordinate;
  health: number;
  defense: number;
  attack: number;
};
export function generateMonsters(
  coordinates: Coordinate[]
): Map<CoordinateKey, Monster> {
  const monsters = new Map<CoordinateKey, Monster>();

  coordinates.forEach((coordinate) => {
    const monster = {
      type: "monster" as const,
      coordinate,
      health: 10,
      defense: 1,
      attack: 3,
    };

    monsters.set(CoordinateKey.fromCoor(coordinate), monster);
  });

  return monsters;
}

export type Player = {
  readonly type: "player";
  coordinate: Coordinate;
  health: number;
  defense: number;
  attack: number;
};
export function generatePlayer(coordinate: Coordinate): Player {
  return {
    type: "player" as const,
    coordinate,
    health: 10,
    defense: 2,
    attack: 3,
  };
}

export type Health = {
  readonly type: "health";
  coordinate: Coordinate;
  health: number;
};
export function generateHealths(
  coordinates: Coordinate[]
): Map<CoordinateKey, Health> {
  const healths = new Map<CoordinateKey, Health>();

  coordinates.forEach((coordinate) => {
    const health = {
      type: "health" as const,
      coordinate,
      health: 10,
    };

    healths.set(CoordinateKey.fromCoor(coordinate), health);
  });

  return healths;
}

export type Weapon = {
  readonly type: "weapon";
  coordinate: Coordinate;
  attack: number;
};
export function generateWeapon(coordinate: Coordinate): Weapon {
  return {
    type: "weapon" as const,
    coordinate,
    attack: 8,
  };
}

export type Exit = {
  readonly type: "exit";
  coordinate: Coordinate;
};
export function generateExit(coordinate: Coordinate): Exit {
  return {
    type: "exit" as const,
    coordinate,
  };
}

export type Boss = Omit<Monster, "type"> & {
  readonly type: "boss";
};
export function generateBoss(coordinate: Coordinate): Boss {
  return {
    type: "boss" as const,
    coordinate,
    health: 50,
    defense: 3,
    attack: 10,
  };
}

export type Sprite = Monster | Player | Health | Weapon | Exit | Boss;