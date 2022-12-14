import zustand from "zustand";

import { CoordinateKey } from "@/game/map";
import { Sprite, toSpriteMap } from "@/game/sprite";
import { initGameState } from "@/game/state";

export const useGame = zustand<
  ReturnType<typeof initGameState> & {
    computed: {
      spriteMap: Map<CoordinateKey, Sprite>;
    };
  }
>((_, get) => ({
  ...initGameState(),
  computed: {
    get spriteMap() {
      return toSpriteMap(get().sprites);
    },
  },
}));

export default null;
