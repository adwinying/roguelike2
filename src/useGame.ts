import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { useCallback } from "react";

import { computeMove } from "@/game/action";
import { CoordinateKey } from "@/game/map";
import { Floor } from "@/game/sprite";
import { initGameState } from "@/game/state";
import useModal from "@/useModal";
import useToast from "@/useToast";

const gameAtom = atomWithImmer(initGameState(1));

export default function useGame() {
  const [{ isFlashlightOn, floor, map: gameMap, sprites }, updateGameState] =
    useAtom(gameAtom);
  const {
    sendHealthToast,
    sendWeaponToast,
    sendBattleToast,
    sendMonsterDefeatToast,
    sendLevelUpToast,
  } = useToast();
  const { showVictoryModal, showDefeatModal } = useModal();

  const toggleFlashlight = useCallback(() => {
    updateGameState((state) => {
      state.isFlashlightOn = !state.isFlashlightOn;
    });
  }, [updateGameState]);

  const resetGame = useCallback(
    (overrideLevel?: Floor) => {
      updateGameState((draft) => {
        const newFloor = overrideLevel ?? ((floor + 1) as Floor);
        const newGame = initGameState(
          newFloor,
          newFloor > 1 ? sprites.player : undefined
        );
        draft.floor = newFloor;
        draft.map = newGame.map;
        draft.sprites = newGame.sprites;
      });
    },
    [floor, sprites.player, updateGameState]
  );

  const triggerMove = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      const result = computeMove({ map: gameMap, sprites }, direction);

      if (result === undefined) return;

      if (result.type === "defeat") {
        showDefeatModal();
        return;
      }

      if (result.type === "victory") {
        showVictoryModal();
        return;
      }

      if (result.type === "exit") {
        resetGame();
        return;
      }

      if (result.type === "kill") {
        updateGameState((draft) => {
          draft.sprites.player.currExp = result.newExp;
          draft.sprites.monsters.delete(
            CoordinateKey.fromCoor(result.monsterCoor)
          );

          if (result.newLevel) draft.sprites.player.level = result.newLevel;
          if (result.newMaxExp) draft.sprites.player.maxExp = result.newMaxExp;
          if (result.newAttack) draft.sprites.player.attack = result.newAttack;
        });

        sendMonsterDefeatToast(result.monsterCoor);

        if (result.isLevelUp && result.newLevel && result.newAttack)
          sendLevelUpToast(
            result.newLevel,
            result.newAttack - sprites.player.attack
          );

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
        sendBattleToast(
          result.monsterCoor,
          result.playerDamage,
          result.monsterDamage,
          result.playerHealth,
          result.monsterHealth
        );

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
        sendHealthToast(result.playerHealth - sprites.player.health);

        return;
      }

      if (result.type === "weapon") {
        updateGameState((draft) => {
          draft.sprites.player.coordinate = result.playerCoor;
          draft.sprites.player.attack = result.playerAttack;
          draft.sprites.weapon = undefined;
        });
        sendWeaponToast(result.playerAttack - sprites.player.attack);

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
    [
      gameMap,
      sprites,
      updateGameState,
      resetGame,
      showVictoryModal,
      showDefeatModal,
      sendWeaponToast,
      sendHealthToast,
      sendBattleToast,
      sendMonsterDefeatToast,
      sendLevelUpToast,
    ]
  );

  return {
    isFlashlightOn,
    floor,
    player: sprites.player,
    sprites,
    gameMap,
    triggerMove,
    toggleFlashlight,
    resetGame,
  };
}
