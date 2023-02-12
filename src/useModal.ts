import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";

const modalStateAtom = atomWithImmer({
  activeModal: null as "VICTORY" | "DEFEAT" | "HELP" | null,
});

export default function useModal() {
  const [modalState, setModalState] = useAtom(modalStateAtom);

  const showVictoryModal = () => {
    setModalState((draft) => {
      draft.activeModal = "VICTORY";
    });
  };

  const showDefeatModal = () => {
    setModalState((draft) => {
      draft.activeModal = "DEFEAT";
    });
  };

  const showHelpModal = () => {
    setModalState((draft) => {
      draft.activeModal = "HELP";
    });
  };

  const hideModal = () => {
    setModalState((draft) => {
      draft.activeModal = null;
    });
  };

  return {
    modalState,
    showVictoryModal,
    showDefeatModal,
    showHelpModal,
    hideModal,
  };
}
