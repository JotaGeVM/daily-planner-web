import { useState, useRef, useEffect } from "react";
function SwipeToDelete({ children, onDeletar }) {
  const [offsetX, setOffsetX] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const inicioXRef = useRef(0);
  const containerRef = useRef(null);
  const LIMITE = 80;
  useEffect(() => {
    function handleCliqueFora(evento) {
      if (
        containerRef.current &&
        !containerRef.current.contains(evento.target)
      ) {
        setOffsetX(0);
      }
    }
    document.addEventListener("mousedown", handleCliqueFora);
    document.addEventListener("touchstart", handleCliqueFora);
    return () => {
      document.removeEventListener("mousedown", handleCliqueFora);
      document.removeEventListener("touchstart", handleCliqueFora);
    };
  }, []);
  function handlePointerDown(evento) {
    inicioXRef.current = evento.clientX;
    setArrastando(true);
  }
  function handlePointerMove(evento) {
    if (!arrastando) return;
    const delta = evento.clientX - inicioXRef.current;
    const novoOffset = Math.min(0, Math.max(delta, -LIMITE));
    setOffsetX(novoOffset);
  }
  function handlePointerUp() {
    setArrastando(false);
    setOffsetX((atual) => (atual < -LIMITE / 2 ? -LIMITE : 0));
  }
  return (
    <div className="swipe-container" ref={containerRef}>
      <div className="swipe-delete-fundo" style={{ width: LIMITE }}>
        <button className="swipe-delete-btn" onClick={onDeletar}>
          Deletar
        </button>
      </div>
      <div
        className="swipe-conteudo"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: arrastando ? "none" : "transform 0.2s ease",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {children}
      </div>
    </div>
  );
}
export default SwipeToDelete;
