import { useState, useEffect } from "react";
import { getCalendario } from "../features/tarefas/api";
import "./calendario.css";

function segundaFeiraDaSemana(data) {
  const copia = new Date(data);
  const diaDaSemana = copia.getDay();
  const diferenca = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
  copia.setDate(copia.getDate() + diferenca);
  return copia;
}

function formatarISO(data) {
  return data.toISOString().split("T")[0];
}

const NOMES_DIAS = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

function SemanaPage() {
  const [dataReferencia, setDataReferencia] = useState(() => new Date());
  const [dias, setDias] = useState([]);
  const [chaveCarregada, setChaveCarregada] = useState(null);

  const inicioSemana = segundaFeiraDaSemana(dataReferencia);
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(fimSemana.getDate() + 6);

  const inicioISO = formatarISO(inicioSemana);
  const fimISO = formatarISO(fimSemana);
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

  function irParaSemanaAnterior() {
    const nova = new Date(dataReferencia);
    nova.setDate(nova.getDate() - 7);
    setDataReferencia(nova);
  }

  function irParaProximaSemana() {
    const nova = new Date(dataReferencia);
    nova.setDate(nova.getDate() + 7);
    setDataReferencia(nova);
  }

  function irParaHoje() {
    setDataReferencia(new Date());
  }

  const hojeISO = formatarISO(new Date());

  return (
    <div className="calendario-container">
      <div className="calendario-navegacao">
        <button onClick={irParaSemanaAnterior}>← Anterior</button>
        <button onClick={irParaHoje}>Hoje</button>
        <button onClick={irParaProximaSemana}>Próxima →</button>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <div className="semana-grid">
          {dias.map((dia, indice) => (
            <div
              key={dia.data}
              className={`semana-dia ${dia.data === hojeISO ? "semana-dia-hoje" : ""}`}
            >
              <div className="semana-dia-cabecalho">
                <span>{NOMES_DIAS[indice]}</span>
                <span>
                  {dia.data.split("-").reverse().slice(0, 2).join("/")}
                </span>
              </div>
              <div className="semana-dia-tarefas">
                {dia.tarefas.length === 0 ? (
                  <p className="semana-dia-vazio">—</p>
                ) : (
                  dia.tarefas.map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className="semana-tarefa-item"
                      style={{ borderLeftColor: tarefa.categoriaCorHex }}
                    >
                      {tarefa.horaInicio && (
                        <span className="semana-tarefa-hora">
                          {tarefa.horaInicio.slice(0, 5)}
                        </span>
                      )}
                      <span>{tarefa.nome}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default SemanaPage;
