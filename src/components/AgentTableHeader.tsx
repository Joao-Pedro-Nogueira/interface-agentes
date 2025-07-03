export default function AgentTableHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 h-12 flex items-center">
      <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-full">
        <div className="col-span-1">Ações</div>
        <div className="col-span-3">Nome do Agente</div>
        <div className="col-span-5">Resumo</div>
        <div className="col-span-2">Keywords</div>
        <div className="col-span-1">Status</div>
      </div>
    </div>
  );
}
