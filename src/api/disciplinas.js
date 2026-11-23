import { requisitar } from "./config.js";

export function listarDisciplinas() {
  return requisitar("/disciplinas");
}
