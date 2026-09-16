import { useState } from "react";
import { login, registrar } from "../api";
import "../auth.css";

function AuthForm({ onAutenticado }) {
  const [modo, setModo] = useState("login"); // "login" ou "registro"
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function validar() {
    const novosErros = {};
    if (!email.trim()) novosErros.email = "Email é obrigatório.";
    if (!senha.trim()) novosErros.senha = "Senha é obrigatória.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErroGeral("");
    if (!validar()) return;

    setEnviando(true);
    try {
      const acao = modo === "login" ? login : registrar;
      const resposta = await acao({ email, senha });
      onAutenticado(resposta.token);
    } catch (erro) {
      if (erro.camposInvalidos) {
        setErros(erro.camposInvalidos);
      } else {
        setErroGeral(erro.message);
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} autoComplete="off">
        <h2>{modo === "login" ? "Entrar" : "Criar conta"}</h2>

        {erroGeral && <div className="erro-geral">{erroGeral}</div>}

        <label>
          Email
          <input
            type="email"
            value={email}
            autoComplete="off"
            onChange={(e) => {
              setEmail(e.target.value);
              setErros((atuais) => ({ ...atuais, email: undefined }));
            }}
          />
          {erros.email && <span className="erro-campo">{erros.email}</span>}
        </label>

        <label>
          Senha
          <input
            type="password"
            value={senha}
            autoComplete="off"
            onChange={(e) => {
              setSenha(e.target.value);
              setErros((atuais) => ({ ...atuais, senha: undefined }));
            }}
          />
          {erros.senha && <span className="erro-campo">{erros.senha}</span>}
        </label>

        <button type="submit" disabled={enviando}>
          {modo === "login" ? "Entrar" : "Criar conta"}
        </button>

        <button
          type="button"
          className="auth-alternar"
          onClick={() => {
            setModo((atual) => (atual === "login" ? "registro" : "login"));
            setErros({});
            setErroGeral("");
          }}
        >
          {modo === "login"
            ? "Não tem conta? Criar uma"
            : "Já tem conta? Entrar"}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;
