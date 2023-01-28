import useGame from "@/useGame";
import useModal from "@/useModal";

export default function ModalDefeat() {
  const { resetGame } = useGame();
  const {
    modalState: { isDefeatModalActive },
    hideDefeatModal,
  } = useModal();

  return (
    <div className={`modal ${isDefeatModalActive ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h2 className="mb-5 text-4xl font-bold">😞 Defeat...</h2>

        <p className="mb-2">
          Unfortunately, it seems that your journey has come to an end. You have
          fought bravely and with all your might, but in the end, the enemies
          were too strong and you have lost all your hit points.
        </p>

        <p className="mb-2">
          It is a sad and unfortunate turn of events, but do not despair. Your
          death is not the end, but rather a new beginning. Take this time to
          reflect on your journey and the lessons you have learned. Remember the
          strategies and techniques that worked well for you, and think about
          what you could have done differently to emerge victorious.
        </p>

        <p className="mb-2">
          And when you are ready, take up your sword and shield once again.
          There are always more dungeons to explore and more challenges to face.
          With each attempt, you will grow stronger and wiser, and one day you
          may even defeat the final boss and emerge victorious. Until then, keep
          fighting and never give up. The world needs heroes like you to rise up
          and conquer the challenges that lay before you.
        </p>

        <button
          type="button"
          className="btn-primary btn mt-5"
          onClick={() => {
            resetGame(1);
            hideDefeatModal();
          }}
        >
          Play Again?
        </button>
      </div>
    </div>
  );
}
