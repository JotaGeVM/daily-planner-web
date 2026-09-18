import { useState, useEffect } from "react";
import { getStreak } from "../api";

function StreakCard({ tarefa }) {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    getStreak(tarefa.id)
      .then(setStreak)
      .catch((erro) => console.error("Erro ao buscar streak:", erro));
  }, [tarefa.id]);

  if (!streak) return null;

  const temStreak = streak.streakAtual > 0;

  return (
    <div className="tarefa-card streak-card">
      <span className={`streak-fogo ${temStreak ? "streak-fogo-ativo" : ""}`}>
        🔥
      </span>
      <div className="streak-info">
        <h3>{tarefa.nome}</h3>
        <span>
          {streak.streakAtual} {streak.streakAtual === 1 ? "dia" : "dias"}
        </span>
      </div>
    </div>
  );
}
export default StreakCard;
