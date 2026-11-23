import { requisitar } from "./config.js";

export function listarAtividades() {
  return requisitar("/atividades?_sort=prazo&_order=asc");
}

export function criarAtividade(dados) {
  return requisitar("/atividades", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
}
