
import { Agent } from './types/agentTypes';

interface AgentItemProps {
  agent: Agent;
  isSelected: boolean;
  onToggleSelection: () => void;
}

export default function AgentItem({ agent, isSelected, onToggleSelection }: AgentItemProps) {
  return (
    <div className="agent-item px-4 py-4">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelection}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
        </div>
        
        <div className="col-span-3">
          <span className="font-medium text-gray-900">{agent.name}</span>
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
  );
}
