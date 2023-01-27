import useGame from "@/useGame";
import useModal from "@/useModal";

export default function ModalVictory() {
  const { resetGame } = useGame();
  const {
    modalState: { isVictoryModalActive },
    hideVictoryModal,
  } = useModal();

  return (
    <div className={`modal ${isVictoryModalActive ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h2 className="mb-5 text-4xl font-bold">🎉 Victory!</h2>

        <p className="mb-2">
          Congratulations, hero! You have defeated the boss and emerged
          victorious in this roguelike dungeon game. Your skill and
          determination have proven to be more than a match for the challenges
          that lay before you.
        </p>

        <p className="mb-2">
          As you stand victorious over the fallen boss, you can&apos;t help but
          feel a sense of pride and accomplishment. You have overcome countless
          obstacles and battles, and your perseverance has paid off in the end.
        </p>

        <p className="mb-2">
          But your journey is far from over. There are always more dungeons to
          explore and more bosses to defeat. And with each victory, you will
          grow stronger and more confident in your abilities. So take a moment
          to savor this victory, and then get ready to embark on your next
          adventure. The world needs heroes like you to rise up and conquer the
          challenges that lie ahead.
        </p>

        <button
          type="button"
          className="btn-primary btn mt-5"
          onClick={() => {
            resetGame(1);
            hideVictoryModal();
          }}
        >
          Play Again?
        </button>
      </div>
    </div>
  );
}
