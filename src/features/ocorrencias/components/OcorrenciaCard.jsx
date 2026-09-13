import SwipeToDelete from "../../../shared/components/SwipeToDelete";
function OcorrenciaCard({ ocorrencia, onDeletar }) {
  const data = ocorrencia.dataHora ? new Date(ocorrencia.dataHora) : null;
  const dataFormatada = data ? data.toLocaleDateString("pt-BR") : "";
  const horaFormatada = data
    ? data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "";
  return (
    <SwipeToDelete onDeletar={() => onDeletar(ocorrencia.id)}>
      <div className="ocorrencia-card">
        <span className="ocorrencia-status">✅</span>
        <div className="ocorrencia-info">
          <span className="ocorrencia-data">
            {dataFormatada} às {horaFormatada}
          </span>
        </div>
      </div>
    </SwipeToDelete>
  );
}
export default OcorrenciaCard;
