import { Trash2, FolderOpen } from 'lucide-react';

interface AgentActionBarProps {
  selectedCount: number;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
  onMoveToFolder?: () => void;
}

export default function AgentActionBar({ 
  selectedCount, 
  onDeleteSelected, 
  onClearSelection,
  onMoveToFolder 
}: AgentActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-6 py-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-blue-900">
            {selectedCount} agente{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
          </span>
          <button 
            onClick={onClearSelection}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Limpar seleção
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          {onMoveToFolder && (
            <button 
              onClick={onMoveToFolder}
              className="inline-flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Mover para pasta
            </button>
          )}
          
          <button 
            onClick={onDeleteSelected}
            className="inline-flex items-center px-3 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir {selectedCount > 1 ? 'agentes' : 'agente'}
          </button>
        </div>
      </div>
    </div>
  );
} 