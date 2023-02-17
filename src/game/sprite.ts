import { Coordinate, CoordinateKey } from "@/game/map";

export type Floor = 1 | 2 | 3 | 4 | 5;

export type Monster = {
  readonly type: "monster";
  coordinate: Coordinate;
  health: number;
  defense: number;
  attack: number;
  exp: number;
};
export function generateMonsters(
  floor: Floor,
  coordinates: Coordinate[]
): Map<CoordinateKey, Monster> {
  const monsters = new Map<CoordinateKey, Monster>();

  coordinates.forEach((coordinate) => {
    const monster = {
      type: "monster" as const,
      coordinate,
      health: Math.floor(10 * (1 + (floor - 1) * 0.2)),
      defense: Math.floor(1 * (1 + (floor - 1) * 0.5)),
      attack: Math.floor(3 * (1 + (floor - 1) * 0.4)),
      exp: Math.floor(10 * (1 + (floor - 1) * 0.5)),
    };

    monsters.set(CoordinateKey.fromCoor(coordinate), monster);
  });

  return monsters;
}

export const getPlayerMaxExp = (level: number) =>
  Array.from({ length: level }).reduce((acc: number, _, i) => acc + i * 10, 50);
export const getPlayerAttackIncrease = (level: number) =>
  Math.floor(1 * (1 + (level - 1) * 0.5));

export type Player = {
  readonly type: "player";
  coordinate: Coordinate;
  health: number;
  defense: number;
  attack: number;
  level: number;
  currExp: number;
  maxExp: number;
};
export function generatePlayer(coordinate: Coordinate): Player {
  return {
    type: "player" as const,
    coordinate,
    health: 10,
    defense: 2,
    attack: 3,
    level: 1,
    currExp: 0,
    maxExp: getPlayerMaxExp(1),
  };
}

export type Health = {
  readonly type: "health";
  coordinate: Coordinate;
  health: number;
};
export function generateHealths(
  floor: Floor,
  coordinates: Coordinate[]
): Map<CoordinateKey, Health> {
  const healths = new Map<CoordinateKey, Health>();

  coordinates.forEach((coordinate) => {
    const health = {
      type: "health" as const,
      coordinate,
      health: Math.floor(10 * (1 + (floor - 1) * 0.2)),
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
export function generateWeapon(floor: Floor, coordinate: Coordinate): Weapon {
  return {
    type: "weapon" as const,
    coordinate,
    attack: Math.floor(1 * (1 + (floor - 1) * 0.5)),
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

export type Boss = Omit<Monster, "type" | "exp"> & {
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
export function toSpriteMap({
  player,
  weapon,
  monsters,
  healths,
  exit,
  boss,
}: {
  player: Player;
  weapon?: Weapon;
  monsters: Map<CoordinateKey, Monster>;
  healths: Map<CoordinateKey, Health>;
  exit?: Exit;
  boss?: Boss;
}): Map<CoordinateKey, Sprite> {
  const sprites = new Map<CoordinateKey, Sprite>([...monsters, ...healths]);

  sprites.set(CoordinateKey.fromCoor(player.coordinate), player);

  if (weapon) sprites.set(CoordinateKey.fromCoor(weapon.coordinate), weapon);
  if (exit) sprites.set(CoordinateKey.fromCoor(exit.coordinate), exit);
  if (boss) sprites.set(CoordinateKey.fromCoor(boss.coordinate), boss);

  return sprites;
}
