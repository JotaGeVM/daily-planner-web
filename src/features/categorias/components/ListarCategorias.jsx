import { useState, useEffect } from "react";
import {
  getCategorias,
  deletarCategoria,
  criarCategoria,
  atualizarCategoria,
} from "../api";
import CategoriaCard from "./CategoriaCard";
import CategoriaForm from "./CategoriaForm";
import CategoriaInfo from "./CategoriaInfo";
import "../categorias.css";
function ListarCategorias({ tarefas, onAbrirTarefaInfo }) {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [categoriaEditandoId, setCategoriaEditandoId] = useState(null);
  const [criandoCategoria, setCriandoCategoria] = useState(false);
  const [categoriaInfoId, setCategoriaInfoId] = useState(null);
  const categoriaSelecionada = categorias.find(
    (categoria) => categoria.id === categoriaEditandoId,
  );
  const modalAberto = criandoCategoria || categoriaEditandoId !== null;
  const categoriaParaForm = criandoCategoria ? null : categoriaSelecionada;
  const categoriaParaInfo = categorias.find(
    (categoria) => categoria.id === categoriaInfoId,
  );
  const tarefasDaInfo = tarefas.filter(
    (tarefa) => tarefa.categoriaId === categoriaInfoId,
  );
  useEffect(() => {
    getCategorias()
      .then((dados) => {
        setCategorias(dados);
        setCarregando(false);
      })
      .catch((erro) => {
        console.error("Erro ao buscar categorias:", erro);
        setCarregando(false);
      });
  }, []);
  function handleDeletar(id) {
    deletarCategoria(id)
      .then(() => {
        setCategorias((atuais) =>
          atuais.filter((categoria) => categoria.id !== id),
        );
      })
      .catch((erro) => console.error("Erro ao deletar categoria:", erro));
  }
  function handleIniciarEdicao(id) {
    setCategoriaInfoId(null);
    setCategoriaEditandoId(id);
  }
  function fecharModal() {
    const idEditado = categoriaEditandoId;
    setCategoriaEditandoId(null);
    setCriandoCategoria(false);

    if (idEditado) {
      setCategoriaInfoId(idEditado);
    }
  }

  function handleSalvarCategoria(id, dados) {
    if (id) {
      return atualizarCategoria(id, dados).then((categoriaAtualizada) => {
        setCategorias((atuais) =>
          atuais.map((categoria) =>
            categoria.id === id ? categoriaAtualizada : categoria,
          ),
        );
        fecharModal();
      });
    } else {
      return criarCategoria(dados).then((novaCategoria) => {
        setCategorias((atuais) => [...atuais, novaCategoria]);
        fecharModal();
      });
    }
  }

  function handleAbrirInfo(id) {
    setCategoriaInfoId(id);
  }

  function handleFecharInfo() {
    setCategoriaInfoId(null);
  }

  function handleAbrirTarefaDaInfo(id) {
    handleFecharInfo();
    onAbrirTarefaInfo(id);
  }
  if (carregando) {
    return <p>Carregando categorias...</p>;
  }

  return (
    <>
      <button className="btn-primary" onClick={() => setCriandoCategoria(true)}>
        + Nova Categoria
      </button>
      <div className="lista-categorias">
        {categorias.map((categoria) => (
          <CategoriaCard
            key={categoria.id}
            categoria={categoria}
            onDeletar={handleDeletar}
            onAbrirInfo={handleAbrirInfo}
          />
        ))}
      </div>
      {modalAberto && (
        <div
          className="modal-overlay"
          onClick={(evento) => {
            if (evento.target === evento.currentTarget) {
              fecharModal();
            }
          }}
        >
          <div className="modal-conteudo">
            <CategoriaForm
              categoria={categoriaParaForm}
              onSalvar={handleSalvarCategoria}
              onCancelar={fecharModal}
            />
          </div>
        </div>
      )}
      {categoriaInfoId !== null && categoriaParaInfo && (
        <CategoriaInfo
          categoria={categoriaParaInfo}
          tarefasCategoria={tarefasDaInfo}
          onEditar={() => handleIniciarEdicao(categoriaInfoId)}
          onFechar={handleFecharInfo}
          onAbrirTarefaInfo={handleAbrirTarefaDaInfo}
        />
      )}
    </>
  );
}
export default ListarCategorias;
