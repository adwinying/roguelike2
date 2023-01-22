import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";

const modalStateAtom = atomWithImmer({
  isVictoryModalActive: false,
  isDefeatModalActive: false,
});

export default function useModal() {
  const [modalState, setModalState] = useAtom(modalStateAtom);

  const showVictoryModal = () => {
    setModalState((draft) => {
      draft.isVictoryModalActive = true;
    });
  };

  const hideVictoryModal = () => {
    setModalState((draft) => {
      draft.isVictoryModalActive = false;
    });
  };

  const showDefeatModal = () => {
    setModalState((draft) => {
      draft.isDefeatModalActive = true;
    });
  };

  const hideDefeatModal = () => {
    setModalState((draft) => {
      draft.isDefeatModalActive = false;
    });
  };

  return {
    modalState,
    showVictoryModal,
    hideVictoryModal,
    showDefeatModal,
    hideDefeatModal,
  };
}
