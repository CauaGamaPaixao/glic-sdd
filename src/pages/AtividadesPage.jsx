import { useCallback, useEffect, useState } from "react";
import { criarAtividade, listarAtividades } from "../api/atividades.js";
import { listarDisciplinas } from "../api/disciplinas.js";
import AtividadeForm from "../components/AtividadeForm.jsx";
import AtividadeList from "../components/AtividadeList.jsx";
import Carregando from "../components/Carregando.jsx";
import ErroApi from "../components/ErroApi.jsx";
import ListaVazia from "../components/ListaVazia.jsx";

function ordenarPorPrazo(atividades) {
  return [...atividades].sort((a, b) => a.prazo.localeCompare(b.prazo));
}

function AtividadesPage() {
  const [atividades, setAtividades] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(false);

  // Busca atividades e disciplinas em paralelo; se qualquer uma falhar,
  // a tela inteira mostra o estado de erro (ver design.md).
  const carregarDados = useCallback(() => {
    return Promise.all([listarAtividades(), listarDisciplinas()])
      .then(([atividadesCarregadas, disciplinasCarregadas]) => {
        setAtividades(ordenarPorPrazo(atividadesCarregadas));
        setDisciplinas(disciplinasCarregadas);
      })
      .catch(() => {
        setErroCarregamento(true);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  function tentarNovamente() {
    setCarregando(true);
    setErroCarregamento(false);
    carregarDados();
  }

  async function aoSalvar(dados) {
    const atividadeCriada = await criarAtividade(dados);
    setAtividades((atuais) => ordenarPorPrazo([...atuais, atividadeCriada]));
  }

  return (
    <main className="pagina-atividades">
      <header className="cabecalho-pagina">
        <h1>GLIC Estudos</h1>
        <p>Agenda de atividades acadêmicas</p>
      </header>

      {carregando ? <Carregando /> : null}

      {!carregando && erroCarregamento ? (
        <ErroApi
          mensagem="Não foi possível carregar as atividades."
          onTentarNovamente={tentarNovamente}
        />
      ) : null}

      {!carregando && !erroCarregamento ? (
        <>
          <AtividadeForm disciplinas={disciplinas} onSalvar={aoSalvar} />

          <section className="secao-lista" aria-labelledby="titulo-lista">
            <h2 id="titulo-lista">Atividades</h2>
            {atividades.length === 0 ? (
              <ListaVazia />
            ) : (
              <AtividadeList atividades={atividades} disciplinas={disciplinas} />
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}

export default AtividadesPage;
