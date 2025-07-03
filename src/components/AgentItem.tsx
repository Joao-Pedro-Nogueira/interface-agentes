import { Draggable } from 'react-beautiful-dnd';
import { Move } from 'lucide-react';
import { Agent } from './types/agentTypes';

interface AgentItemProps {
  agent: Agent;
  index: number;
  isSelected: boolean;
  onToggleSelection: () => void;
  onClick?: () => void;
}

export default function AgentItem({ agent, index, isSelected, onToggleSelection, onClick }: AgentItemProps) {
  return (
    <Draggable draggableId={agent.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`agent-item px-4 h-16 flex items-center transition-all duration-150 ${
            snapshot.isDragging 
              ? 'bg-blue-50 shadow-lg border border-blue-200 rounded' 
              : 'hover:bg-gray-50 border-b border-gray-100'
          }`}
          onClick={onClick}
          style={{ 
            cursor: onClick ? 'pointer' : undefined,
            ...provided.draggableProps.style
          }}
        >
          <div className="grid grid-cols-12 gap-4 items-center w-full">
            <div className="col-span-1 flex items-center space-x-2">
              <div
                {...provided.dragHandleProps}
                className={`cursor-move p-1 rounded transition-colors duration-150 ${
                  snapshot.isDragging 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                }`}
              >
                <Move className="w-4 h-4" />
              </div>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelection}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                onClick={e => e.stopPropagation()}
              />
            </div>
            
            <div className="col-span-3">
              <span className="font-medium text-gray-900">
                {agent.name}
              </span>
            </div>
            
            <div className="col-span-5">
              <span className="text-gray-600 text-sm">
                {agent.summary || '-'}
              </span>
            </div>
            
            <div className="col-span-2">
              <span className="text-gray-600 text-sm">
                {agent.keywords || '-'}
              </span>
            </div>
            
            <div className="col-span-1">
              <div className="flex flex-col gap-1">
                {/* Status de Ativação */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium justify-center  ${
                  agent.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {agent.isActive ? 'Ativado' : 'Desativado'}
                </span>
                
                {/* Agente Primário */}
                {agent.primaryAgent && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 justify-center">
                    Primário
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
