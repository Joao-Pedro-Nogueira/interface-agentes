
import { Plus, FolderPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AgentListHeaderProps {
  onCreateFolder: () => void;
  onCreateAgent: () => void;
}

export default function AgentListHeader({ onCreateFolder, onCreateAgent }: AgentListHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Agentes</h1>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onCreateFolder}
            className="inline-flex items-center"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Criar pasta
          </Button>
          <Button
            onClick={onCreateAgent}
            className="inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar novo agente
          </Button>
          <Link
            to="/criar-agente"
            className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agente avançado
          </Link>
        </div>
      </div>
    </div>
  );
}
