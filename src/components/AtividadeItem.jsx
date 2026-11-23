function formatarPrazo(prazo) {
  const [ano, mes, dia] = prazo.split("-");
  return `${dia}/${mes}/${ano}`;
}

function obterDataLocal(isoDate) {
  const [ano, mes, dia] = isoDate.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

function inicioDoDia(data) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function calcularDestaque(atividade) {
  if (atividade.status === "concluida") {
    return { classe: "destaque-concluida", rotulo: "Concluída" };
  }

  const hoje = inicioDoDia(new Date());
  const prazo = obterDataLocal(atividade.prazo);
  const diferencaMs = prazo.getTime() - hoje.getTime();
  const diferencaDias = Math.round(diferencaMs / (1000 * 60 * 60 * 24));

  if (diferencaDias < 0) {
    return { classe: "destaque-atrasada", rotulo: "Atrasada" };
  }

  if (diferencaDias <= 2) {
    return { classe: "destaque-em-breve", rotulo: "Vence em breve" };
  }

  return { classe: "", rotulo: "" };
}

const PRIORIDADES = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const TIPOS = {
  trabalho: "Trabalho",
  prova: "Prova",
  entrega: "Entrega",
};

function AtividadeItem({ atividade, nomeDisciplina }) {
  const destaque = calcularDestaque(atividade);
  const disciplina = nomeDisciplina || "Disciplina indisponível";

  return (
    <li className={`atividade-item ${destaque.classe}`.trim()}>
      <div className="atividade-conteudo">
        <h3 className="atividade-titulo">{atividade.titulo}</h3>
        <p>
          <strong>Disciplina:</strong> {disciplina}
        </p>
        <p>
          <strong>Tipo:</strong> {TIPOS[atividade.tipo] || atividade.tipo}
        </p>
        <p>
          <strong>Prazo:</strong> {formatarPrazo(atividade.prazo)}
        </p>
        <p>
          <strong>Prioridade:</strong>{" "}
          {PRIORIDADES[atividade.prioridade] || atividade.prioridade}
        </p>
      </div>
      {destaque.rotulo ? (
        <span className="atividade-rotulo">{destaque.rotulo}</span>
      ) : null}
    </li>
  );
}

export default AtividadeItem;
