
import { Draggable } from 'react-beautiful-dnd';
import { move } from 'lucide-react';
import { Agent } from './types/agentTypes';

interface AgentItemProps {
  agent: Agent;
  index: number;
  isSelected: boolean;
  onToggleSelection: () => void;
}

export default function AgentItem({ agent, index, isSelected, onToggleSelection }: AgentItemProps) {
  return (
    <Draggable draggableId={agent.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`agent-item px-4 py-4 ${
            snapshot.isDragging ? 'bg-blue-50 shadow-lg border border-blue-200 rounded-lg' : ''
          }`}
        >
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1 flex items-center space-x-2">
              <div
                {...provided.dragHandleProps}
                className="cursor-move p-1 hover:bg-gray-100 rounded"
              >
                <move className="w-4 h-4 text-gray-400" />
              </div>
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
                {agent.tools.map((tool, toolIndex) => (
                  <span key={toolIndex} className="text-sm">{tool}</span>
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
      )}
    </Draggable>
  );
}
