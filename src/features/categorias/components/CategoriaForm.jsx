import { useState } from "react";
function CategoriaForm({ categoria, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    nome: categoria?.nome ?? "",
    descricao: categoria?.descricao ?? "",
    corHex: categoria?.corHex ?? "#8b949e",
  });

  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};
    if (!formData.nome.trim()) novosErros.nome = "Nome é obrigatório.";
    return novosErros;
  }

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

  const [erroGeral, setErroGeral] = useState("");

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
      await onSalvar(categoria?.id, formData);
    } catch (erro) {
      if (erro.camposInvalidos) {
        setErros(erro.camposInvalidos);
      } else {
        setErroGeral(erro.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
      </label>
      <label>
        Cor
        <input
          type="color"
          name="corHex"
          value={formData.corHex}
          onChange={handleChange}
        />
      </label>
      <div className="card-acoes">
        <button type="submit" className="btn-primary">
          Salvar
        </button>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
export default CategoriaForm;
