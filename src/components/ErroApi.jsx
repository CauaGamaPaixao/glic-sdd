function ErroApi({ mensagem, onTentarNovamente }) {
  return (
    <div className="erro-api" role="alert">
      <p>{mensagem}</p>
      <button type="button" onClick={onTentarNovamente}>
        Tentar novamente
      </button>
    </div>
  );
}

export default ErroApi;
