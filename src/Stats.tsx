import useGame from "@/useGame";

export default function Stats({ className = "" }: { className?: string }) {
  const { player, floor } = useGame();

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
        <div className="stat-value">{player.currExp.toLocaleString()}</div>
        <div className="stat-desc">/ {player.maxExp.toLocaleString()}</div>
      </div>

      <div className="stat px-3 py-2 md:px-6 md:py-4">
        <div className="stat-title">LVL</div>
        <div className="stat-value">{player.level}</div>
        <div className="stat-desc">&nbsp;</div>
      </div>

      <div className="stat px-3 py-2 md:px-6 md:py-4">
        <div className="stat-title">FLR</div>
        <div className="stat-value">{floor}</div>
        <div className="stat-desc">Out of 5</div>
      </div>
    </div>
  );
}
