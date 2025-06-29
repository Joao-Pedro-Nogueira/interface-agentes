
interface AgentSelectionFooterProps {
  selectedCount: number;
}

export default function AgentSelectionFooter({ selectedCount }: AgentSelectionFooterProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {selectedCount} agente{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
        </span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
            Mover para pasta
          </button>
          <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
