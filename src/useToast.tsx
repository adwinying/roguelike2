import toast from "react-hot-toast";

import Toast from "@/Toast";
import { Coordinate, CoordinateKey } from "@/game/map";

export default function useToast() {
  const sendToast = (
    { type, icon, title, content }: Parameters<typeof Toast>[0],
    id?: string
  ) => {
    toast.custom(
      (t) => (
        <Toast
          type={type}
          icon={icon}
          title={title}
          content={content}
          isVisible={t.visible}
        />
      ),
      { id }
    );
  };

  const sendHealthToast = (healthIncresedBy: number) => {
    sendToast({
      type: "success",
      icon: "💊",
      title: "HP Increased!",
      content: `HP increased by ${healthIncresedBy}`,
    });
  };

  const sendWeaponToast = (attackIncreasedBy: number) => {
    sendToast({
      type: "info",
      icon: "🗡️",
      title: "Weapon Acquired!",
      content: `Attack increased by ${attackIncreasedBy}`,
    });
  };

  const sendBattleToast = (
    monsterCoor: Coordinate,
    playerDamage: number,
    monsterDamage: number,
    playerHealth: number,
    monsterHealth: number
  ) => {
    sendToast(
      {
        type: "warning",
        icon: "⚔️",
        title: "Battle Outcome",
        content: [
          `Player Health: ${playerHealth} (${
            monsterDamage > 0 ? `-${playerDamage}` : "MISSED"
          })`,
          `Monster Health: ${monsterHealth} (${
            playerDamage > 0 ? `-${monsterDamage}` : "MISSED"
          })`,
        ].join("\n"),
      },
      CoordinateKey.fromCoor(monsterCoor).toString()
    );
  };

  const sendMonsterDefeatToast = (monsterCoor: Coordinate) => {
    sendToast(
      {
        type: "success",
        icon: "🏆",
        title: "Monster Defeated!",
        content: "Way to go!",
      },
      CoordinateKey.fromCoor(monsterCoor).toString()
    );
  };

  const sendLevelUpToast = (newLevel: number, attackIncreasedBy: number) => {
    sendToast({
      type: "success",
      icon: "🎉",
      title: "Level Up!",
      content: `Level increased to ${newLevel}\nAttack increased by ${attackIncreasedBy}`,
    });
  };

  return {
    sendHealthToast,
    sendWeaponToast,
    sendBattleToast,
    sendMonsterDefeatToast,
    sendLevelUpToast,
  };
}
