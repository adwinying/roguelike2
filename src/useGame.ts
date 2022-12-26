import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { useCallback, useMemo } from "react";

import { computeMove } from "@/game/action";
import { CoordinateKey } from "@/game/map";
import { toSpriteMap } from "@/game/sprite";
import { initGameState } from "@/game/state";

const gameAtom = atomWithImmer(initGameState());

export default function useGame() {
  const [{ map: gameMap, sprites }, updateGameState] = useAtom(gameAtom);

  const spriteMap = useMemo(() => toSpriteMap(sprites), [sprites]);

  const resetGame = useCallback(() => {
    updateGameState((draft) => {
      const newGame = initGameState();
      draft.map = newGame.map;
      draft.sprites = newGame.sprites;
    });
  }, [updateGameState]);

  const triggerMove = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      const result = computeMove({ map: gameMap, sprites }, direction);

      if (result === undefined) return;

      if (result.type === "defeat") {
        resetGame();
        return;
      }

      if (result.type === "victory") {
        resetGame();
        return;
      }

      if (result.type === "exit") {
        resetGame();
        return;
      }

      if (result.type === "kill") {
        updateGameState((draft) => {
          draft.sprites.monsters.delete(
            CoordinateKey.fromCoor(result.monsterCoor)
          );
        });

        return;
      }

      if (result.type === "battle") {
        updateGameState((draft) => {
          const monsterCoor = CoordinateKey.fromCoor(result.monsterCoor);
          const targetMonster =
            draft.sprites.boss?.coordinate &&
            CoordinateKey.fromCoor(draft.sprites.boss.coordinate) ===
              monsterCoor
              ? draft.sprites.boss
              : draft.sprites.monsters.get(monsterCoor);

          if (targetMonster === undefined)
            throw new Error("Target monster not found");

          targetMonster.health = result.monsterHealth;
          draft.sprites.player.health = result.playerHealth;
        });

        return;
      }

      if (result.type === "health") {
        updateGameState((draft) => {
          draft.sprites.player.coordinate = result.playerCoor;
          draft.sprites.player.health = result.playerHealth;
          draft.sprites.healths.delete(
            CoordinateKey.fromCoor(result.playerCoor)
          );
        });

        return;
      }

      if (result.type === "weapon") {
        updateGameState((draft) => {
          draft.sprites.player.coordinate = result.playerCoor;
          draft.sprites.player.attack = result.playerAttack;
          draft.sprites.weapon = undefined;
        });

        return;
      }

      if (result.type === "movement") {
        updateGameState((draft) => {
          draft.sprites.player.coordinate = result.playerCoor;
        });

        return;
      }

      throw new Error("Unknown result type");
    },
    [gameMap, sprites, updateGameState, resetGame]
  );

  return {
    gameMap,
    spriteMap,
    triggerMove,
  };
}
