import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { AgentFolder, Agent } from './types/agentTypes';
import AgentListHeader from './AgentListHeader';
import AgentSearchControls from './AgentSearchControls';
import AgentActionBar from './AgentActionBar';
import AgentTableHeader from './AgentTableHeader';
import AgentFolderItem from './AgentFolderItem';
import FolderCreationModal from './FolderCreationModal';
import { useNavigate } from 'react-router-dom';
import { useAgents } from '../contexts/AgentContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
        primaryAgent: false,
        isActive: true
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
        primaryAgent: true,
        isActive: true
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
        primaryAgent: false,
        isActive: true
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
        primaryAgent: false,
        isActive: true
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
        primaryAgent: false,
        isActive: true
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
        primaryAgent: false,
        isActive: true
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
        primaryAgent: false,
        isActive: true
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
  const [sortBy, setSortBy] = useState('folders-asc');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const { toast } = useToast();

  const toggleFolder = (folderId: string) => {
    // If sorting by name or date, don't allow folder toggling
    if (sortBy.startsWith('name-') || sortBy === 'lastModified' || sortBy === 'created') {
      return;
    }
    
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

    // If sorting by name or date, disable drag and drop
    if (sortBy.startsWith('name-') || sortBy === 'lastModified' || sortBy === 'created') {
      toast({
        title: "Ação não permitida",
        description: "Arrastar e soltar não está disponível na visualização unificada.",
        variant: "destructive",
        duration: 3000,
      });
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

  // Sort agents within each folder based on sortBy
  const sortedFolders = filteredFolders.map(folder => ({
    ...folder,
    agents: [...folder.agents].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
        case 'name-desc':
          const nameComparison = a.name.localeCompare(b.name);
          return sortBy === 'name-asc' ? nameComparison : -nameComparison;
        case 'lastModified':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        case 'created':
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        default:
          return 0;
      }
    })
  }));

  // Sort folders and handle different view modes
  let displayFolders = sortedFolders;
  
  if (sortBy.startsWith('name-') || sortBy === 'lastModified' || sortBy === 'created') {
    // Flatten all agents and sort by the selected criteria, ignoring folders
    const allAgents = sortedFolders.flatMap(folder => 
      folder.agents.map(agent => ({ ...agent, folderName: folder.name }))
    ).sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'lastModified':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        case 'created':
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        default:
          return 0;
      }
    });
    
    // Create a single "Todos os Agentes" folder for unified sorting
    displayFolders = [{
      id: 'all-agents',
      name: 'Todos os Agentes',
      isExpanded: true,
      agents: allAgents.map(agent => ({
        ...agent,
        name: `${agent.name} - ${agent.folderName}`
      }))
    }];
  } else {
    // Normal folder view - sort folders based on sortBy
    displayFolders = sortedFolders.sort((a, b) => {
      // Always keep "Sem pasta" first
      if (a.id === 'sem-pasta') return -1;
      if (b.id === 'sem-pasta') return 1;
      
      // Sort other folders based on sortBy
      if (sortBy.startsWith('folders-')) {
        const folderComparison = a.name.localeCompare(b.name);
        return sortBy === 'folders-asc' ? folderComparison : -folderComparison;
      }
      
      // Default: alphabetical ascending
      return a.name.localeCompare(b.name);
    });
  }

  const handleAgentClick = (agent: Agent) => {
    navigate('/criar-agente', { state: { agent } });
  };

  const handleDeleteSelectedAgents = () => {
    if (selectedAgents.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAgents = () => {
    // Get agent names for confirmation message
    const agentNames = folders
      .flatMap(folder => folder.agents)
      .filter(agent => selectedAgents.includes(agent.id))
      .map(agent => agent.name);

    // Remove agents from all folders
    const newFolders = folders.map(folder => ({
      ...folder,
      agents: folder.agents.filter(agent => !selectedAgents.includes(agent.id))
    }));

    setFolders(newFolders);
    setSelectedAgents([]); // Clear selection
    setIsDeleteDialogOpen(false);

    // Show success message
    const message = agentNames.length === 1 
      ? `Agente "${agentNames[0]}" excluído com sucesso.`
      : `${agentNames.length} agentes excluídos com sucesso.`;

    toast({
      title: "Agentes excluídos",
      description: message,
      duration: 3000,
    });
  };

  const handleClearSelection = () => {
    setSelectedAgents([]);
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

      <AgentActionBar
        selectedCount={selectedAgents.length}
        onDeleteSelected={handleDeleteSelectedAgents}
        onClearSelection={handleClearSelection}
      />

      <div className="flex-1 overflow-auto">
        <AgentTableHeader />

        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="bg-white">
            {displayFolders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum agente encontrado.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Crie um novo agente para começar.
                </p>
              </div>
            ) : (
              displayFolders.map((folder) => (
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

      <FolderCreationModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir agentes</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir {selectedAgents.length} agente{selectedAgents.length > 1 ? 's' : ''} selecionado{selectedAgents.length > 1 ? 's' : ''}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteAgents}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
