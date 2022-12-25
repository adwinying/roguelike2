import { Coordinate, CoordinateKey, MapTerrain } from "@/game/map";
import { Boss, Monster, Player, toSpriteMap } from "@/game/sprite";
import { GameState } from "@/game/state";

const config = {
  minAttackMultiplier: 0.7,
  maxAttackMultiplier: 1.3,
  minDefenseMultiplier: 0.7,
  maxDefenseMultiplier: 1.3,
};

export function getBattleOutcome(player: Player, monster: Monster | Boss) {
  const {
    minAttackMultiplier,
    maxAttackMultiplier,
    minDefenseMultiplier,
    maxDefenseMultiplier,
  } = config;

  const attackMultiplierRange = maxAttackMultiplier - minAttackMultiplier;
  const defenseMultiplierRange = maxDefenseMultiplier - minDefenseMultiplier;

  const playerAttackMultiplier =
    Math.random() * attackMultiplierRange + minAttackMultiplier;
  const playerDefenseMultiplier =
    Math.random() * defenseMultiplierRange + minDefenseMultiplier;
  const monsterAttackMultiplier =
    Math.random() * attackMultiplierRange + minAttackMultiplier;
  const monsterDefenseMultiplier =
    Math.random() * defenseMultiplierRange + minDefenseMultiplier;

  const playerAttack = Math.round(player.attack * playerAttackMultiplier);
  const playerDefense = Math.round(player.defense * playerDefenseMultiplier);
  const monsterAttack = Math.round(monster.attack * monsterAttackMultiplier);
  const monsterDefense = Math.round(monster.defense * monsterDefenseMultiplier);

  const monsterDamage = Math.max(playerAttack - monsterDefense, 0);
  const monsterHealth = Math.max(monster.health - monsterDamage, 0);

  const playerDamage =
    monsterHealth === 0 ? 0 : Math.max(monsterAttack - playerDefense, 0);
  const playerHealth = Math.max(player.health - playerDamage, 0);

  return {
    playerDamage,
    monsterDamage,
    playerHealth,
    monsterHealth,
  };
}

export function computeMove(
  { map, sprites }: GameState,
  direction: "up" | "down" | "left" | "right"
) {
  const spriteMap = toSpriteMap(sprites);
  const playerCoor = sprites.player.coordinate;
  const targetCoor: Coordinate = {
    up: { x: playerCoor.x, y: playerCoor.y - 1 },
    down: { x: playerCoor.x, y: playerCoor.y + 1 },
    left: { x: playerCoor.x - 1, y: playerCoor.y },
    right: { x: playerCoor.x + 1, y: playerCoor.y },
  }[direction];

  const targetCoorKey = CoordinateKey.fromCoor(targetCoor);
  const targetCell = spriteMap.get(targetCoorKey) ?? map.get(targetCoorKey);

  if (targetCell === undefined) throw new Error("Target cell not found");

  if (targetCell === MapTerrain.Wall)
    return {
      type: "movement" as const,
      playerCoor: sprites.player.coordinate,
    };

  if (targetCell === MapTerrain.Floor)
    return {
      type: "movement" as const,
      playerCoor: targetCoor,
    };

  if (targetCell.type === "health")
    return {
      type: "health" as const,
      playerCoor: targetCoor,
      playerHealth: sprites.player.health + targetCell.health,
    };

  if (targetCell.type === "weapon")
    return {
      type: "weapon" as const,
      playerCoor: targetCoor,
      playerAttack: sprites.player.attack + targetCell.attack,
    };

  if (targetCell.type === "monster" || targetCell.type === "boss") {
    const { playerDamage, monsterDamage, playerHealth, monsterHealth } =
      getBattleOutcome(sprites.player, targetCell);

    if (playerHealth === 0)
      return {
        type: "defeat" as const,
      };

    if (monsterHealth === 0 && targetCell.type === "boss")
      return {
        type: "victory" as const,
      };

    if (monsterHealth === 0 && targetCell.type === "monster")
      return {
        type: "kill" as const,
        playerCoor: sprites.player.coordinate,
        playerHealth,
        playerDamage,
        monsterCoor: targetCoor,
        monsterHealth,
        monsterDamage,
      };

    return {
      type: "battle" as const,
      playerCoor: sprites.player.coordinate,
      playerHealth,
      playerDamage,
      monsterCoor: targetCoor,
      monsterHealth,
      monsterDamage,
    };
  }

  if (targetCell.type === "exit")
    return {
      type: "exit" as const,
    };

  return undefined;
}

export default null;
