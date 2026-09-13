import { useState, useEffect } from "react";
import { getOcorrencias, deletarOcorrencia } from "../api";
import OcorrenciaCard from "./OcorrenciaCard";
import "../ocorrencias.css";

function ListarOcorrencias() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    getOcorrencias()
      .then((dados) => {
        setOcorrencias(dados);
        setCarregando(false);
      })
      .catch((erro) => {
        console.error("Erro ao buscar ocorrencias:", erro);
        setCarregando(false);
      });
  }, []);

  function handleDeletar(id) {
    deletarOcorrencia(id)
      .then(() => {
        setOcorrencias((ocorrenciasAtuais) =>
          ocorrenciasAtuais.filter((ocorrencia) => ocorrencia.id !== id),
        );
      })
      .catch((erro) => {
        console.error("Erro ao deletar ocorrencia:", erro);
      });
  }


  if (carregando) {
    return <p>Carregando ocorrencias...</p>;
  }

  return (
    <div className="lista-ocorrencias">
      {ocorrencias.map((ocorrencia) => (
        <OcorrenciaCard
          key={ocorrencia.id}
          ocorrencia={ocorrencia}
          onDeletar={handleDeletar}
        />
      ))}
    </div>
  );
}

export default ListarOcorrencias;
