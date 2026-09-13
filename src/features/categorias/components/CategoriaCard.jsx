import SwipeToDelete from "../../../shared/components/SwipeToDelete";
function CategoriaCard({ categoria, onDeletar, onAbrirInfo }) {
  return (
    <SwipeToDelete onDeletar={() => onDeletar(categoria.id)}>
      <div
        className="categoria-card"
        style={{ borderLeftColor: categoria.corHex }}
      >
        <span
          className="categoria-nome-clicavel"
          onClick={() => onAbrirInfo(categoria.id)}
        >
          {categoria.nome}
        </span>
      </div>
    </SwipeToDelete>
  );
}
export default CategoriaCard;
