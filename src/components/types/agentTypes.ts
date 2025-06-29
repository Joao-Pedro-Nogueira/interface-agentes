
export interface Agent {
  id: string;
  name: string;
  description: string;
  tools: string[];
  lastRun: string;
  lastModified: string;
  created: string;
}

export interface AgentFolder {
  id: string;
  name: string;
  agents: Agent[];
  isExpanded: boolean;
}
