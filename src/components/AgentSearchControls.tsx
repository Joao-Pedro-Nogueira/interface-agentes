
import { Search, Plus } from 'lucide-react';

interface AgentSearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function AgentSearchControls({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy
}: AgentSearchControlsProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Nova Pasta
          </button>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Ordenar:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="lastModified">Última modificação</option>
              <option value="name">Nome</option>
              <option value="created">Data de criação</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
