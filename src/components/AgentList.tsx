import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { AgentFolder, Agent } from './types/agentTypes';
import AgentListHeader from './AgentListHeader';
import AgentSearchControls from './AgentSearchControls';
import AgentTableHeader from './AgentTableHeader';
import AgentFolderItem from './AgentFolderItem';
import AgentSelectionFooter from './AgentSelectionFooter';
import FolderCreationModal from './FolderCreationModal';
import { useNavigate } from 'react-router-dom';
import { useAgents } from '../contexts/AgentContext';

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
        name: 'Carlos (Assistente Geral)',
        description: 'Assistente virtual para tarefas gerais',
        tools: ['🤖', '📝', '🔍'],
        lastRun: '16 minutos atrás',
        lastModified: '16 minutos atrás',
        created: '16 minutos atrás',
        delay: 3,
        summary: 'Assistente virtual versátil para auxiliar em diversas tarefas',
        keywords: 'assistente, geral, tarefas, automação, produtividade',
        signature: false,
        audioAccessibility: true,
        primaryAgent: false
      }
    ]
  }
];

const otherFolders: AgentFolder[] = [
  {
    id: 'vendas',
    name: 'Vendas',
    isExpanded: true,
    agents: [
      {
        id: '2',
        name: 'Rafaela (Vendas)',
        description: 'Especialista em prospecção e fechamento de vendas',
        tools: ['📞', '📊', '💼'],
        lastRun: '2 horas atrás',
        lastModified: '1 dia atrás',
        created: '1 semana atrás',
        delay: 15,
        summary: 'Agente especializado em prospecção de clientes e fechamento de vendas B2B',
        keywords: 'vendas, prospecção, B2B, fechamento, CRM',
        signature: true,
        audioAccessibility: true,
        primaryAgent: true
      },
      {
        id: '3',
        name: 'Isa (Marketing)',
        description: 'Estratégias de marketing digital e campanhas',
        tools: ['📱', '📈', '🎯'],
        lastRun: '5 horas atrás',
        lastModified: '3 dias atrás',
        created: '2 semanas atrás',
        delay: 8,
        summary: 'Especialista em marketing digital, campanhas e análise de performance',
        keywords: 'marketing, digital, campanhas, analytics, redes sociais',
        signature: false,
        audioAccessibility: true,
        primaryAgent: false
      }
    ]
  },
  {
    id: 'documentos',
    name: 'Documentos',
    isExpanded: true,
    agents: [
      {
        id: '4',
        name: 'Roberto (Contratos)',
        description: 'Análise e elaboração de contratos comerciais',
        tools: ['📄', '⚖️', '✍️'],
        lastRun: '1 dia atrás',
        lastModified: '1 semana atrás',
        created: '1 mês atrás',
        delay: 25,
        summary: 'Especialista em análise jurídica e elaboração de contratos comerciais',
        keywords: 'contratos, jurídico, análise, documentos, compliance',
        signature: true,
        audioAccessibility: false,
        primaryAgent: false
      },
      {
        id: '5',
        name: 'Ana (Relatórios)',
        description: 'Criação de relatórios executivos e dashboards',
        tools: ['📊', '📋', '📈'],
        lastRun: '3 dias atrás',
        lastModified: '2 semanas atrás',
        created: '1 mês atrás',
        delay: 12,
        summary: 'Especialista em criação de relatórios executivos e dashboards analíticos',
        keywords: 'relatórios, dashboards, análise, dados, executivo',
        signature: false,
        audioAccessibility: false,
        primaryAgent: false
      }
    ]
  },
  {
    id: 'atendimento',
    name: 'Atendimento',
    isExpanded: true,
    agents: [
      {
        id: '6',
        name: 'Leonardo (Tira-dúvidas)',
        description: 'Suporte técnico e esclarecimento de dúvidas',
        tools: ['❓', '🔧', '💬'],
        lastRun: '30 minutos atrás',
        lastModified: '2 dias atrás',
        created: '3 semanas atrás',
        delay: 5,
        summary: 'Agente de suporte técnico especializado em esclarecimento de dúvidas',
        keywords: 'suporte, técnico, dúvidas, ajuda, FAQ',
        signature: false,
        audioAccessibility: true,
        primaryAgent: false
      },
      {
        id: '7',
        name: 'Marina (SAC)',
        description: 'Atendimento ao cliente e resolução de problemas',
        tools: ['🎧', '📞', '✅'],
        lastRun: '1 hora atrás',
        lastModified: '1 dia atrás',
        created: '2 semanas atrás',
        delay: 20,
        summary: 'Especialista em atendimento ao cliente e resolução de problemas',
        keywords: 'SAC, atendimento, cliente, problemas, satisfação',
        signature: true,
        audioAccessibility: true,
        primaryAgent: false
      }
    ]
  }
];

const mockAgents = [...initialFolders, ...otherFolders];

export default function AgentList() {
  const navigate = useNavigate();
  const { folders, setFolders, createFolder, deleteFolder } = useAgents();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastModified');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
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

  const handleCreateFolder = (name: string) => {
    const success = createFolder(name);
    
    if (success) {
      toast({
        title: "Pasta criada",
        description: `A pasta "${name}" foi criada com sucesso.`
      });
    } else {
      toast({
        title: "Erro",
        description: "Já existe uma pasta com este nome.",
        variant: "destructive"
      });
    }
    
    return success;
  };

  const handleDeleteFolder = (folderId: string) => {
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

    deleteFolder(folderId);

    toast({
      title: "Pasta excluída",
      description: `A pasta "${folderToDelete.name}" foi excluída e seus agentes foram movidos para "Sem pasta".`
    });
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
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
    
    // Enhanced success feedback
    const isSameFolder = sourceFolderId === destinationFolderId;
    const message = isSameFolder 
      ? `Agente "${draggedAgent.name}" reordenado na pasta "${destinationFolder.name}"`
      : `Agente "${draggedAgent.name}" movido para "${destinationFolder.name}"`;
    
    toast({
      title: "Agente movido",
      description: message,
      duration: 3000,
    });
  };

  const filteredFolders = folders.map(folder => ({
    ...folder,
    agents: folder.agents.filter(agent =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  // Ensure "Sem pasta" is always first
  const sortedFolders = filteredFolders.sort((a, b) => {
    if (a.id === 'sem-pasta') return -1;
    if (b.id === 'sem-pasta') return 1;
    return a.name.localeCompare(b.name);
  });

  const handleAgentClick = (agent: Agent) => {
    navigate('/criar-agente', { state: { agent } });
  };

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
        onCreateFolder={() => setIsFolderModalOpen(true)}
      />

      <div className="flex-1 overflow-auto">
        <AgentTableHeader />

        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                  onDeleteFolder={handleDeleteFolder}
                  onAgentClick={handleAgentClick}
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
        onCreateFolder={handleCreateFolder}
      />

    </div>
  );
}
