
import { useState } from 'react';
import { AgentFolder } from './types/agentTypes';
import AgentListHeader from './AgentListHeader';
import AgentSearchControls from './AgentSearchControls';
import AgentTableHeader from './AgentTableHeader';
import AgentFolderItem from './AgentFolderItem';
import AgentSelectionFooter from './AgentSelectionFooter';

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
      <AgentListHeader />
      
      <AgentSearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="flex-1 overflow-auto">
        <AgentTableHeader />

        <div className="bg-white">
          {filteredFolders.map((folder) => (
            <AgentFolderItem
              key={folder.id}
              folder={folder}
              selectedAgents={selectedAgents}
              toggleFolder={toggleFolder}
              toggleAgentSelection={toggleAgentSelection}
            />
          ))}
        </div>
      </div>

      <AgentSelectionFooter selectedCount={selectedAgents.length} />
    </div>
  );
}
