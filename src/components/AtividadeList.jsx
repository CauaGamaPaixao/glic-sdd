import AtividadeItem from "./AtividadeItem.jsx";

function AtividadeList({ atividades, disciplinas }) {
  const disciplinasPorId = new Map(
    disciplinas.map((disciplina) => [disciplina.id, disciplina.nome]),
  );

  return (
    <ul className="atividade-lista">
      {atividades.map((atividade) => (
        <AtividadeItem
          key={atividade.id}
          atividade={atividade}
          nomeDisciplina={disciplinasPorId.get(atividade.disciplinaId)}
        />
      ))}
    </ul>
  );
}

export default AtividadeList;
