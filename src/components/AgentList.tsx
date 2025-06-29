
import { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronUp, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Agent {
  id: string;
  name: string;
  description: string;
  tools: string[];
  lastRun: string;
  lastModified: string;
  created: string;
}

interface AgentFolder {
  id: string;
  name: string;
  agents: Agent[];
  isExpanded: boolean;
}

const mockAgents: AgentFolder[] = [
  {
    id: 'root',
    name: 'Agentes',
    isExpanded: true,
    agents: [
      {
        id: '1',
        name: 'Agente sem título',
        description: '',
        tools: [],
        lastRun: '-',
        lastModified: '16 minutos atrás',
        created: '16 minutos atrás'
      }
    ]
  },
  {
    id: 'pedro',
    name: 'Pedro',
    isExpanded: true,
    agents: [
      {
        id: '2',
        name: 'pedro',
        description: '',
        tools: [],
        lastRun: '-',
        lastModified: 'mês passado',
        created: 'mês passado'
      }
    ]
  },
  {
    id: 'exemplo',
    name: 'exemplo',
    isExpanded: true,
    agents: [
      {
        id: '3',
        name: 'SEO Optimized Blog Writer',
        description: 'Escreve blogs otimizados para SEO',
        tools: ['🔧'],
        lastRun: '-',
        lastModified: 'mês passado',
        created: 'mês passado'
      },
      {
        id: '4',
        name: 'SEO Optimized Blog Writer',
        description: 'Escreve blogs otimizados para SEO',
        tools: ['🔧'],
        lastRun: '-',
        lastModified: 'mês passado',
        created: 'mês passado'
      },
      {
        id: '5',
        name: 'Agente sem título',
        description: '',
        tools: [],
        lastRun: '5 meses atrás',
        lastModified: '5 meses atrás',
        created: '5 meses atrás'
      }
    ]
  }
];

export default function AgentList() {
  const [folders, setFolders] = useState<AgentFolder[]>(mockAgents);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastModified');

  const toggleFolder = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, isExpanded: !folder.isExpanded }
        : folder
    ));
  };

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const filteredFolders = folders.map(folder => ({
    ...folder,
    agents: folder.agents.filter(agent =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(folder => folder.agents.length > 0);

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
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

      {/* Search and Controls */}
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

      {/* Agent List */}
      <div className="flex-1 overflow-auto">
        {/* Table Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
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

        {/* Folders and Agents */}
        <div className="bg-white">
          {filteredFolders.map((folder) => (
            <div key={folder.id}>
              {/* Folder Header */}
              <div 
                className="folder-header px-6 py-3 bg-gray-50 border-b border-gray-100"
                onClick={() => toggleFolder(folder.id)}
              >
                <div className="flex items-center">
                  {folder.isExpanded ? (
                    <ChevronDown className="w-4 h-4 mr-2 text-gray-500" />
                  ) : (
                    <ChevronUp className="w-4 h-4 mr-2 text-gray-500" />
                  )}
                  <Folder className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-900">{folder.name}</span>
                  <span className="ml-2 text-sm text-gray-500">({folder.agents.length})</span>
                </div>
              </div>

              {/* Agents in Folder */}
              {folder.isExpanded && folder.agents.map((agent) => (
                <div key={agent.id} className="agent-item px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(agent.id)}
                        onChange={() => toggleAgentSelection(agent.id)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <div className="flex items-center">
                        <Search className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-900">{agent.name}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-3">
                      <span className="text-gray-600">{agent.description || '-'}</span>
                    </div>
                    
                    <div className="col-span-1">
                      <div className="flex space-x-1">
                        {agent.tools.map((tool, index) => (
                          <span key={index} className="text-sm">{tool}</span>
                        ))}
                        {agent.tools.length === 0 && <span className="text-gray-400">-</span>}
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <span className="text-gray-600">{agent.lastRun}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-gray-600">{agent.lastModified}</span>
                    </div>
                    
                    <div className="col-span-1">
                      <span className="text-gray-600">{agent.created}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Selection Footer */}
      {selectedAgents.length > 0 && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedAgents.length} agente{selectedAgents.length > 1 ? 's' : ''} selecionado{selectedAgents.length > 1 ? 's' : ''}
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
      )}
    </div>
  );
}
