import { useState, useEffect } from "react";
import { getCalendario } from "../features/tarefas/api";
import "./calendario.css";

function primeiroDiaDoMes(data) {
  return new Date(data.getFullYear(), data.getMonth(), 1);
}

function ultimoDiaDoMes(data) {
  return new Date(data.getFullYear(), data.getMonth() + 1, 0);
}

function segundaFeiraDaSemana(data) {
  const copia = new Date(data);
  const diaDaSemana = copia.getDay();
  const diferenca = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
  copia.setDate(copia.getDate() + diferenca);
  return copia;
}

function domingoDaSemana(data) {
  const copia = new Date(data);
  const diaDaSemana = copia.getDay();
  const diferenca = diaDaSemana === 0 ? 0 : 7 - diaDaSemana;
  copia.setDate(copia.getDate() + diferenca);
  return copia;
}

function formatarISO(data) {
  return data.toISOString().split("T")[0];
}

const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const NOMES_DIAS_CURTO = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function MesPage() {
  const [dataReferencia, setDataReferencia] = useState(() => new Date());
  const [dias, setDias] = useState([]);
  const [chaveCarregada, setChaveCarregada] = useState(null);

  const inicioMes = primeiroDiaDoMes(dataReferencia);
  const fimMes = ultimoDiaDoMes(dataReferencia);
  const inicioGrade = segundaFeiraDaSemana(inicioMes);
  const fimGrade = domingoDaSemana(fimMes);

  const inicioISO = formatarISO(inicioGrade);
  const fimISO = formatarISO(fimGrade);
  const chaveAtual = `${inicioISO}_${fimISO}`;
  const carregando = chaveCarregada !== chaveAtual;

  useEffect(() => {
    getCalendario(inicioISO, fimISO)
      .then((dados) => {
        setDias(dados);
        setChaveCarregada(chaveAtual);
      })
      .catch((erro) => {
        console.error("Erro ao buscar calendário:", erro);
      });
  }, [inicioISO, fimISO, chaveAtual]);

  function irParaMesAnterior() {
    setDataReferencia(
      (atual) => new Date(atual.getFullYear(), atual.getMonth() - 1, 1),
    );
  }

  function irParaProximoMes() {
    setDataReferencia(
      (atual) => new Date(atual.getFullYear(), atual.getMonth() + 1, 1),
    );
  }

  function irParaHoje() {
    setDataReferencia(new Date());
  }

  const hojeISO = formatarISO(new Date());
  const mesReferenciaNumero = dataReferencia.getMonth();

  return (
    <div className="calendario-container">
      <div className="calendario-navegacao">
        <button onClick={irParaMesAnterior}>← Anterior</button>
        <button onClick={irParaHoje}>Hoje</button>
        <button onClick={irParaProximoMes}>Próximo →</button>
      </div>

      <h2 className="mes-titulo">
        {NOMES_MESES[mesReferenciaNumero]} {dataReferencia.getFullYear()}
      </h2>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <div className="mes-grid">
          {NOMES_DIAS_CURTO.map((nome) => (
            <div key={nome} className="mes-cabecalho-dia">
              {nome}
            </div>
          ))}
          {dias.map((dia) => {
            const [, mes, diaNumero] = dia.data.split("-").map(Number);
            const foraDoMes = mes - 1 !== mesReferenciaNumero;
            return (
              <div
                key={dia.data}
                className={`mes-dia ${foraDoMes ? "mes-dia-fora" : ""} ${
                  dia.data === hojeISO ? "mes-dia-hoje" : ""
                }`}
              >
                <span className="mes-dia-numero">{diaNumero}</span>
                <div className="mes-dia-tarefas">
                  {dia.tarefas.slice(0, 3).map((tarefa) => (
                    <span
                      key={tarefa.id}
                      className="mes-tarefa-item"
                      style={{ borderLeftColor: tarefa.categoriaCorHex }}
                      title={tarefa.nome}
                    >
                      {tarefa.nome}
                    </span>
                  ))}
                  {dia.tarefas.length > 3 && (
                    <span className="mes-tarefa-mais">
                      +{dia.tarefas.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default MesPage;
