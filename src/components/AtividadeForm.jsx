import { useRef, useState } from "react";

const ESTADO_INICIAL = {
  titulo: "",
  disciplinaId: "",
  tipo: "",
  prazo: "",
  prioridade: "media",
};

function inicioDoDia(data) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function obterDataLocal(isoDate) {
  const [ano, mes, dia] = isoDate.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

function validar(valores) {
  const erros = {};
  const titulo = valores.titulo.trim();

  if (titulo.length < 3 || titulo.length > 80) {
    erros.titulo = "O título deve ter entre 3 e 80 caracteres.";
  }

  if (!valores.disciplinaId) {
    erros.disciplinaId = "Selecione uma disciplina.";
  }

  if (!valores.tipo) {
    erros.tipo = "Selecione um tipo.";
  }

  if (!valores.prazo) {
    erros.prazo = "Informe o prazo.";
  } else {
    const hoje = inicioDoDia(new Date());
    const prazo = obterDataLocal(valores.prazo);
    if (prazo.getTime() < hoje.getTime()) {
      erros.prazo = "O prazo não pode ser anterior a hoje.";
    }
  }

  return erros;
}

function AtividadeForm({ disciplinas, onSalvar }) {
  const [valores, setValores] = useState(ESTADO_INICIAL);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  // Trava síncrona: o atributo disabled só é aplicado no próximo render,
  // então dois submits no mesmo instante passariam sem ela (achado da verificação).
  const enviandoRef = useRef(false);

  function aoAlterar(evento) {
    const { name, value } = evento.target;
    setValores((atual) => ({ ...atual, [name]: value }));
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    if (enviandoRef.current) {
      return;
    }
    setMensagemSucesso("");
    setMensagemErro("");

    const errosValidacao = validar(valores);
    setErros(errosValidacao);

    if (Object.keys(errosValidacao).length > 0) {
      return;
    }

    const dados = {
      titulo: valores.titulo.trim(),
      disciplinaId: Number(valores.disciplinaId),
      tipo: valores.tipo,
      prazo: valores.prazo,
      prioridade: valores.prioridade,
      status: "pendente",
    };

    enviandoRef.current = true;
    setEnviando(true);
    try {
      await onSalvar(dados);
      setValores(ESTADO_INICIAL);
      setErros({});
      setMensagemSucesso("Atividade cadastrada!");
    } catch {
      setMensagemErro("Não foi possível salvar a atividade. Tente novamente.");
    } finally {
      enviandoRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <form className="atividade-form" onSubmit={aoEnviar} noValidate>
      <h2>Cadastrar atividade</h2>

      <div className="campo-form">
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          value={valores.titulo}
          onChange={aoAlterar}
        />
        {erros.titulo ? <p className="erro-campo">{erros.titulo}</p> : null}
      </div>

      <div className="campo-form">
        <label htmlFor="disciplinaId">Disciplina</label>
        <select
          id="disciplinaId"
          name="disciplinaId"
          value={valores.disciplinaId}
          onChange={aoAlterar}
        >
          <option value="">Selecione uma disciplina</option>
          {disciplinas.map((disciplina) => (
            <option key={disciplina.id} value={disciplina.id}>
              {disciplina.nome}
            </option>
          ))}
        </select>
        {erros.disciplinaId ? (
          <p className="erro-campo">{erros.disciplinaId}</p>
        ) : null}
      </div>

      <div className="campo-form">
        <label htmlFor="tipo">Tipo</label>
        <select id="tipo" name="tipo" value={valores.tipo} onChange={aoAlterar}>
          <option value="">Selecione um tipo</option>
          <option value="trabalho">Trabalho</option>
          <option value="prova">Prova</option>
          <option value="entrega">Entrega</option>
        </select>
        {erros.tipo ? <p className="erro-campo">{erros.tipo}</p> : null}
      </div>

      <div className="campo-form">
        <label htmlFor="prazo">Prazo</label>
        <input
          id="prazo"
          name="prazo"
          type="date"
          value={valores.prazo}
          onChange={aoAlterar}
        />
        {erros.prazo ? <p className="erro-campo">{erros.prazo}</p> : null}
      </div>

      <div className="campo-form">
        <label htmlFor="prioridade">Prioridade</label>
        <select
          id="prioridade"
          name="prioridade"
          value={valores.prioridade}
          onChange={aoAlterar}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <button type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : "Salvar atividade"}
      </button>

      {mensagemSucesso ? (
        <p className="mensagem-sucesso" role="status">
          {mensagemSucesso}
        </p>
      ) : null}
      {mensagemErro ? (
        <p className="mensagem-erro" role="alert">
          {mensagemErro}
        </p>
      ) : null}
    </form>
  );
}

export default AtividadeForm;
