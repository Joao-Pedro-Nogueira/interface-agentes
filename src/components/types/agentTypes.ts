export interface AgentVersion {
  id: string;
  version: string;
  timestamp: string;
  changes: string;
  observations?: string;
  agentData: Omit<Agent, 'versions'>;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  tools: string[];
  lastRun: string;
  lastModified: string;
  created: string;
  image?: string;
  delay: number;
  summary: string;
  keywords: string;
  signature: boolean;
  audioAccessibility: boolean;
  primaryAgent: boolean;
  versions?: AgentVersion[];
}

export interface AgentFolder {
  id: string;
  name: string;
  agents: Agent[];
  isExpanded: boolean;
}
