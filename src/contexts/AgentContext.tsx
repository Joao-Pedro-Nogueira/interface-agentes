import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Agent, AgentFolder } from '../components/types/agentTypes';

interface AgentContextType {
  folders: AgentFolder[];
  setFolders: (folders: AgentFolder[]) => void;
  updateAgent: (updatedAgent: Agent) => void;
  createAgent: (agent: Agent, folderId?: string) => void;
  deleteAgent: (agentId: string) => void;
  createFolder: (name: string) => boolean;
  deleteFolder: (folderId: string) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

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

export function AgentProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<AgentFolder[]>(mockAgents);

  const updateAgent = (updatedAgent: Agent) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => ({
        ...folder,
        agents: folder.agents.map(agent =>
          agent.id === updatedAgent.id ? updatedAgent : agent
        )
      }))
    );
  };

  const createAgent = (agent: Agent, folderId?: string) => {
    const targetFolderId = folderId || 'sem-pasta';
    setFolders(prevFolders => 
      prevFolders.map(folder => {
        if (folder.id === targetFolderId) {
          return {
            ...folder,
            agents: [...folder.agents, agent]
          };
        }
        return folder;
      })
    );
  };

  const deleteAgent = (agentId: string) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => ({
        ...folder,
        agents: folder.agents.filter(agent => agent.id !== agentId)
      }))
    );
  };

  const createFolder = (name: string): boolean => {
    // Check if folder name already exists
    const existingFolder = folders.find(folder => 
      folder.name.toLowerCase() === name.toLowerCase() && folder.id !== 'sem-pasta'
    );
    
    if (existingFolder) {
      return false;
    }

    const newFolder: AgentFolder = {
      id: `folder-${Date.now()}`,
      name,
      isExpanded: true,
      agents: []
    };

    setFolders([...folders, newFolder]);
    return true;
  };

  const deleteFolder = (folderId: string) => {
    if (folderId === 'sem-pasta') {
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
  };

  return (
    <AgentContext.Provider value={{
      folders,
      setFolders,
      updateAgent,
      createAgent,
      deleteAgent,
      createFolder,
      deleteFolder
    }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgents() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
} 