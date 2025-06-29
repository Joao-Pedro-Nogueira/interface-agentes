
export default function AgentTableHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="col-span-1"></div>
        <div className="col-span-3">Nome do Agente</div>
        <div className="col-span-3">Descrição</div>
        <div className="col-span-1">Ferramentas</div>
        <div className="col-span-1">Última execução</div>
        <div className="col-span-2">Última modificação</div>
        <div className="col-span-1">Criado</div>
      </div>
    </div>
  );
}
