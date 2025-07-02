
import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { AgentFolder, Agent } from './types/agentTypes';
import AgentListHeader from './AgentListHeader';
import AgentSearchControls from './AgentSearchControls';
import AgentTableHeader from './AgentTableHeader';
import AgentFolderItem from './AgentFolderItem';
import AgentSelectionFooter from './AgentSelectionFooter';
import FolderCreationModal from './FolderCreationModal';

import { useToast } from '@/hooks/use-toast';

// Initial data with "Sem pasta" folder
const initialFolders: AgentFolder[] = [
  {
    id: 'sem-pasta',
    name: 'Sem pasta',
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
  }
];

const otherFolders: AgentFolder[] = [
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

const mockAgents = [...initialFolders, ...otherFolders];

export default function AgentList() {
  const [folders, setFolders] = useState<AgentFolder[]>(mockAgents);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastModified');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  
  const { toast } = useToast();

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

  const createFolder = (name: string) => {
    // Check if folder name already exists
    const existingFolder = folders.find(folder => 
      folder.name.toLowerCase() === name.toLowerCase() && folder.id !== 'sem-pasta'
    );
    
    if (existingFolder) {
      toast({
        title: "Erro",
        description: "Já existe uma pasta com este nome.",
        variant: "destructive"
      });
      return false;
    }

    const newFolder: AgentFolder = {
      id: `folder-${Date.now()}`,
      name,
      isExpanded: true,
      agents: []
    };

    setFolders([...folders, newFolder]);
    toast({
      title: "Pasta criada",
      description: `A pasta "${name}" foi criada com sucesso.`
    });
    return true;
  };

  const createAgent = (name: string, folderId?: string) => {
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name,
      description: '',
      tools: [],
      lastRun: '-',
      lastModified: 'agora',
      created: 'agora'
    };

    const targetFolderId = folderId || 'sem-pasta';
    const newFolders = folders.map(folder => {
      if (folder.id === targetFolderId) {
        return {
          ...folder,
          agents: [...folder.agents, newAgent]
        };
      }
      return folder;
    });

    setFolders(newFolders);
    toast({
      title: "Agente criado",
      description: `O agente "${name}" foi criado com sucesso.`
    });
  };

  const deleteFolder = (folderId: string) => {
    if (folderId === 'sem-pasta') {
      toast({
        title: "Erro",
        description: "A seção 'Sem pasta' não pode ser excluída.",
        variant: "destructive"
      });
      return;
    }

    const folderToDelete = folders.find(f => f.id === folderId);
    if (!folderToDelete) return;

    // Move all agents from deleted folder to "Sem pasta"
    const semPastaFolder = folders.find(f => f.id === 'sem-pasta');
    if (semPastaFolder) {
      semPastaFolder.agents = [...semPastaFolder.agents, ...folderToDelete.agents];
    }

    // Remove the folder
    const newFolders = folders.filter(f => f.id !== folderId);
    setFolders(newFolders);

    toast({
      title: "Pasta excluída",
      description: `A pasta "${folderToDelete.name}" foi excluída e seus agentes foram movidos para "Sem pasta".`
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceFolderId = source.droppableId;
    const destinationFolderId = destination.droppableId;

    const newFolders = [...folders];
    const sourceFolder = newFolders.find(f => f.id === sourceFolderId);
    const destinationFolder = newFolders.find(f => f.id === destinationFolderId);

    if (!sourceFolder || !destinationFolder) {
      return;
    }

    const draggedAgent = sourceFolder.agents.find(agent => agent.id === draggableId);
    if (!draggedAgent) {
      return;
    }

    // Remove agent from source folder
    sourceFolder.agents = sourceFolder.agents.filter(agent => agent.id !== draggableId);

    // Add agent to destination folder
    destinationFolder.agents.splice(destination.index, 0, draggedAgent);

    setFolders(newFolders);
    
    toast({
      title: "Agente movido",
      description: `Agente movido para "${destinationFolder.name}".`
    });
  };

  const filteredFolders = folders.map(folder => ({
    ...folder,
    agents: folder.agents.filter(agent =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(folder => folder.agents.length > 0 || folder.id === 'sem-pasta');

  // Ensure "Sem pasta" is always first
  const sortedFolders = filteredFolders.sort((a, b) => {
    if (a.id === 'sem-pasta') return -1;
    if (b.id === 'sem-pasta') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex-1 bg-gray-50">
      <AgentListHeader 
        onCreateFolder={() => setIsFolderModalOpen(true)}
      />
      
      <AgentSearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="flex-1 overflow-auto">
        <AgentTableHeader />

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="bg-white">
            {sortedFolders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum agente encontrado.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Crie um novo agente para começar.
                </p>
              </div>
            ) : (
              sortedFolders.map((folder) => (
                <AgentFolderItem
                  key={folder.id}
                  folder={folder}
                  selectedAgents={selectedAgents}
                  toggleFolder={toggleFolder}
                  toggleAgentSelection={toggleAgentSelection}
                  onDeleteFolder={deleteFolder}
                />
              ))
            )}
          </div>
        </DragDropContext>
      </div>

      <AgentSelectionFooter selectedCount={selectedAgents.length} />

      <FolderCreationModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreateFolder={createFolder}
      />

    </div>
  );
}
