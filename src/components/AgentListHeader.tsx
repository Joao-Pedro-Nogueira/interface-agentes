
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AgentListHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Agentes</h1>
        <Link
          to="/criar-agente"
          className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Agente
        </Link>
      </div>
    </div>
  );
}
