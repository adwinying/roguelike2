import useGame from "@/useGame";

export default function Stats({ className = "" }: { className?: string }) {
  const { player } = useGame();

  return (
    <div className={`stats auto-cols-fr shadow-lg ${className}`}>
      <div className="stat px-3 py-2 md:px-6 md:py-4">
        <div className="stat-title">HP</div>
        <div className="stat-value">{player.health.toLocaleString()}</div>
        <div className="stat-desc">&nbsp;</div>
      </div>

      <div className="stat px-3 py-2 md:px-6 md:py-4">
        <div className="stat-title">ATK</div>
        <div className="stat-value">{player.attack.toLocaleString()}</div>
        <div className="stat-desc">&nbsp;</div>
      </div>

      <div className="stat px-3 py-2 md:px-6 md:py-4">
        <div className="stat-title">DEF</div>
        <div className="stat-value">{player.defense.toLocaleString()}</div>
        <div className="stat-desc">&nbsp;</div>
      </div>

      <div className="stat px-3 py-2 md:px-6 md:py-4">
        <div className="stat-title">EXP</div>
        <div className="stat-value">31</div>
        <div className="stat-desc">to next lvl</div>
      </div>

      <div className="stat px-3 py-2 md:px-6 md:py-4">
        <div className="stat-title">LVL</div>
        <div className="stat-value">1</div>
        <div className="stat-desc">Out of 5</div>
      </div>
    </div>
  );
}
