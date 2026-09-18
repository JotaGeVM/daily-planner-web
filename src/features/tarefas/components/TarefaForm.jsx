import { useState, useEffect } from "react";
import { getCategorias } from "../../categorias/api";

function TarefaForm({ tarefa, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    nome: tarefa?.nome ?? "",
    descricao: tarefa?.descricao ?? "",
    categoriaId: tarefa?.categoriaId ?? "",
    tipo: tarefa?.tipo ?? "",
    recorrencia: tarefa?.recorrencia ?? "",
    diasSemana: tarefa?.diasSemana ?? "",
    horaInicio: tarefa?.horaInicio ?? "",
    duracao: tarefa?.duracao ?? "",
    metaDiaria: tarefa?.metaDiaria ?? "",
    dataInicio: tarefa?.dataInicio ?? "",
  });
  const [categorias, setCategorias] = useState([]);

  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");

  function validar() {
    const novosErros = {};
    if (!formData.nome.trim()) novosErros.nome = "Nome é obrigatório.";
    if (!formData.descricao.trim())
      novosErros.descricao = "Descrição é obrigatória.";
    if (!formData.categoriaId)
      novosErros.categoriaId = "Selecione uma categoria.";
    if (!formData.tipo) novosErros.tipo = "Selecione o tipo.";
    if (!formData.recorrencia)
      novosErros.recorrencia = "Selecione a recorrência.";
    if (formData.tipo === "HABITO" && !formData.metaDiaria)
      novosErros.metaDiaria = "Meta diária é obrigatória para hábitos.";
    if (!formData.dataInicio)
      novosErros.dataInicio = "Data de início é obrigatória.";
    return novosErros;
  }
  useEffect(() => {
    getCategorias()
      .then(setCategorias)
      .catch((erro) => console.error("Erro ao buscar categorias", erro));
  }, []);

  function handleChange(evento) {
    const { name, value } = evento.target;
    setFormData((dadosAtuais) => ({ ...dadosAtuais, [name]: value }));
    setErros((atuais) => {
      if (!atuais[name]) return atuais;
      const copia = { ...atuais };
      delete copia[name];
      return copia;
    });
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    setErros({});
    setErroGeral("");
    try {
      await onSalvar(tarefa?.id, formData);
    } catch (erro) {
      if (erro.camposInvalidos) {
        setErros(erro.camposInvalidos);
      } else {
        setErroGeral(erro.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      {erroGeral && <p className="erro-geral">{erroGeral}</p>}
      <label>
        Nome
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          autoComplete="off"
        />
        {erros.nome && <span className="erro-campo">{erros.nome}</span>}
      </label>
      <label>
        Descrição
        <input
          type="text"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          autoComplete="off"
        />
        {erros.descricao && (
          <span className="erro-campo">{erros.descricao}</span>
        )}
      </label>
      <label>
        Categoria
        <select
          name="categoriaId"
          value={formData.categoriaId}
          onChange={handleChange}
        >
          <option value="" disabled hidden>
            Selecione uma categoria
          </option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
        {erros.categoriaId && (
          <span className="erro-campo">{erros.categoriaId}</span>
        )}
      </label>
      <label></label>
      <label>
        Tipo
        <select name="tipo" value={formData.tipo} onChange={handleChange}>
          <option value="" disabled hidden>
            Selecione o tipo
          </option>
          <option value="EVENTO">Evento</option>
          <option value="TAREFA">Tarefa</option>
          <option value="HABITO">Hábito</option>
        </select>
        {erros.tipo && <span className="erro-campo">{erros.tipo}</span>}
      </label>
      {formData.tipo === "HABITO" && (
        <label>
          Meta Diária (quantas vezes por dia)
          <input
            type="number"
            name="metaDiaria"
            min="1"
            value={formData.metaDiaria}
            onChange={handleChange}
            autoComplete="off"
          />
          {erros.metaDiaria && (
            <span className="erro-campo">{erros.metaDiaria}</span>
          )}
        </label>
      )}
      <label>
        Data de Início
        <input
          type="date"
          name="dataInicio"
          value={formData.dataInicio}
          onChange={handleChange}
          autoComplete="off"
        />
        {erros.dataInicio && (
          <span className="erro-campo">{erros.dataInicio}</span>
        )}
      </label>
      <label>
        Recorrência
        <select
          name="recorrencia"
          value={formData.recorrencia}
          onChange={handleChange}
        >
          <option value="" disabled hidden>
            Selecione a recorrência
          </option>
          <option value="NENHUMA">Nenhuma</option>
          <option value="DIARIA">Diaria</option>
          <option value="SEMANAL">Semanal</option>
          <option value="QUINZENAL">Quinzenal</option>
          <option value="MENSAL">Mensal</option>
        </select>
        {erros.recorrencia && (
          <span className="erro-campo">{erros.recorrencia}</span>
        )}
      </label>
      <label>
        Dias da Semana
        <input
          type="text"
          name="diasSemana"
          value={formData.diasSemana}
          onChange={handleChange}
          placeholder="EX: SEGUNDA, QUARTA"
          autoComplete="off"
        />
      </label>
      <label>
        Hora de Início
        <input
          type="time"
          name="horaInicio"
          value={formData.horaInicio}
          onChange={handleChange}
          autoComplete="off"
        />
      </label>
      <label>
        Duração (minutos)
        <input
          type="number"
          name="duracao"
          value={formData.duracao}
          onChange={handleChange}
          autoComplete="off"
        />
      </label>
      <button type="submit">Salvar</button>
      <button type="button" onClick={onCancelar}>
        Cancelar
      </button>
    </form>
  );
}

export default TarefaForm;
