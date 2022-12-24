import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { useMemo } from "react";

import { toSpriteMap } from "@/game/sprite";
import { initGameState } from "@/game/state";

const gameAtom = atomWithImmer(initGameState());

export default function useGame() {
  const [{ map: gameMap, sprites }] = useAtom(gameAtom);

  const spriteMap = useMemo(() => toSpriteMap(sprites), [sprites]);

  return {
    gameMap,
    spriteMap,
  };
}
