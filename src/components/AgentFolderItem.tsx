
import { ChevronDown, ChevronUp, Folder } from 'lucide-react';
import { Agent, AgentFolder } from './types/agentTypes';
import AgentItem from './AgentItem';

interface AgentFolderItemProps {
  folder: AgentFolder;
  selectedAgents: string[];
  toggleFolder: (folderId: string) => void;
  toggleAgentSelection: (agentId: string) => void;
}

export default function AgentFolderItem({
  folder,
  selectedAgents,
  toggleFolder,
  toggleAgentSelection
}: AgentFolderItemProps) {
  return (
    <div>
      {/* Folder Header */}
      <div 
        className="folder-header px-4 py-3 bg-gray-50 border-b border-gray-100"
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
        <AgentItem
          key={agent.id}
          agent={agent}
          isSelected={selectedAgents.includes(agent.id)}
          onToggleSelection={() => toggleAgentSelection(agent.id)}
        />
      ))}
    </div>
  );
}
