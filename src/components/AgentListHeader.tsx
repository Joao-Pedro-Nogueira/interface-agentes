
import { Plus, FolderPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AgentListHeaderProps {
  onCreateFolder: () => void;
}

export default function AgentListHeader({ onCreateFolder }: AgentListHeaderProps) {
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
          <Link
            to="/criar-agente"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Agente
          </Link>
        </div>
      </div>
    </div>
  );
}
