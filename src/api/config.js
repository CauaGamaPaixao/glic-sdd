export const API_URL = "http://localhost:3001";

export async function requisitar(caminho, opcoes) {
  let resposta;

  try {
    resposta = await fetch(`${API_URL}${caminho}`, opcoes);
  } catch {
    // Falha de rede (API fora do ar): padroniza a mensagem, conforme design.md.
    throw new Error(`Não foi possível acessar a API em ${API_URL}.`);
  }

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status} ao acessar ${caminho}`);
  }

  return resposta.json();
}
