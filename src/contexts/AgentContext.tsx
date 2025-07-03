import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Agent, AgentFolder, AgentVersion } from '../components/types/agentTypes';

interface AgentContextType {
  folders: AgentFolder[];
  setFolders: (folders: AgentFolder[]) => void;
  updateAgent: (updatedAgent: Agent) => void;
  createAgent: (agent: Agent, folderId?: string) => void;
  deleteAgent: (agentId: string) => void;
  createFolder: (name: string) => boolean;
  deleteFolder: (folderId: string) => void;
  saveAgentVersion: (agentId: string, changes: string) => void;
  restoreAgentVersion: (agentId: string, versionId: string) => void;
  updateVersionName: (agentId: string, versionId: string, newName: string) => void;
  updateVersionObservations: (agentId: string, versionId: string, observations: string) => void;
  deleteVersion: (agentId: string, versionId: string) => void;
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
        versions: [
          {
            id: 'v1-1',
            version: '1.0.0',
            timestamp: '16 minutos atrás',
            changes: 'Versão inicial do agente',
            observations: '',
            agentData: {
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
            }
          }
        ]
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
        versions: [
          {
            id: 'v2-1',
            version: '1.0.0',
            timestamp: '1 dia atrás',
            changes: 'Versão inicial do agente',
            observations: '',
            agentData: {
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
            }
          }
        ]
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
        versions: [
          {
            id: 'v3-1',
            version: '1.0.0',
            timestamp: '3 dias atrás',
            changes: 'Versão inicial do agente',
            observations: '',
            agentData: {
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
            }
          }
        ]
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
        versions: [
          {
            id: 'v4-1',
            version: '1.0.0',
            timestamp: '1 semana atrás',
            changes: 'Versão inicial do agente',
            observations: '',
            agentData: {
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
            }
          }
        ]
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
        versions: [
          {
            id: 'v5-1',
            version: '1.0.0',
            timestamp: '2 semanas atrás',
            changes: 'Versão inicial do agente',
            observations: '',
            agentData: {
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
            }
          }
        ]
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
        versions: [
          {
            id: 'v6-1',
            version: '1.0.0',
            timestamp: '2 dias atrás',
            changes: 'Versão inicial do agente',
            observations: '',
            agentData: {
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
            }
          }
        ]
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
        versions: [
          {
            id: 'v7-1',
            version: '1.0.0',
            timestamp: '1 dia atrás',
            changes: 'Versão inicial do agente',
            observations: '',
            agentData: {
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
            }
          }
        ]
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

  const saveAgentVersion = (agentId: string, changes: string) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => ({
        ...folder,
        agents: folder.agents.map(agent => {
          if (agent.id === agentId) {
            const currentVersion = agent.versions?.length || 0;
            const newVersion: AgentVersion = {
              id: `v${agentId}-${currentVersion + 1}`,
              version: `${Math.floor(currentVersion / 10) + 1}.${(currentVersion % 10) + 1}.0`,
              timestamp: 'agora',
              changes,
              agentData: {
                id: agent.id,
                name: agent.name,
                description: agent.description,
                tools: agent.tools,
                lastRun: agent.lastRun,
                lastModified: agent.lastModified,
                created: agent.created,
                delay: agent.delay,
                summary: agent.summary,
                keywords: agent.keywords,
                signature: agent.signature,
                audioAccessibility: agent.audioAccessibility,
                primaryAgent: agent.primaryAgent,
              }
            };

            return {
              ...agent,
              versions: [...(agent.versions || []), newVersion]
            };
          }
          return agent;
        })
      }))
    );
  };

  const restoreAgentVersion = (agentId: string, versionId: string) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => ({
        ...folder,
        agents: folder.agents.map(agent => {
          if (agent.id === agentId) {
            const versionToRestore = agent.versions?.find(v => v.id === versionId);
            if (versionToRestore) {
              return {
                ...agent,
                ...versionToRestore.agentData,
                lastModified: 'agora'
              };
            }
          }
          return agent;
        })
      }))
    );
  };

  const updateVersionName = (agentId: string, versionId: string, newName: string) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => ({
        ...folder,
        agents: folder.agents.map(agent => {
          if (agent.id === agentId) {
            const updatedVersions = agent.versions?.map(version =>
              version.id === versionId ? { ...version, version: newName } : version
            );
            return {
              ...agent,
              versions: updatedVersions
            };
          }
          return agent;
        })
      }))
    );
  };

  const updateVersionObservations = (agentId: string, versionId: string, observations: string) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => ({
        ...folder,
        agents: folder.agents.map(agent => {
          if (agent.id === agentId) {
            const updatedVersions = agent.versions?.map(version =>
              version.id === versionId ? { ...version, observations } : version
            );
            return {
              ...agent,
              versions: updatedVersions
            };
          }
          return agent;
        })
      }))
    );
  };

  const deleteVersion = (agentId: string, versionId: string) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => ({
        ...folder,
        agents: folder.agents.map(agent => {
          if (agent.id === agentId) {
            const updatedVersions = agent.versions?.filter(v => v.id !== versionId);
            return {
              ...agent,
              versions: updatedVersions
            };
          }
          return agent;
        })
      }))
    );
  };

  return (
    <AgentContext.Provider value={{
      folders,
      setFolders,
      updateAgent,
      createAgent,
      deleteAgent,
      createFolder,
      deleteFolder,
      saveAgentVersion,
      restoreAgentVersion,
      updateVersionName,
      updateVersionObservations,
      deleteVersion
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