
import { ChevronDown, ChevronUp, Folder, Trash2, MoreHorizontal } from 'lucide-react';
import { Droppable } from 'react-beautiful-dnd';
import { Agent, AgentFolder } from './types/agentTypes';
import AgentItem from './AgentItem';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface AgentFolderItemProps {
  folder: AgentFolder;
  selectedAgents: string[];
  toggleFolder: (folderId: string) => void;
  toggleAgentSelection: (agentId: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export default function AgentFolderItem({
  folder,
  selectedAgents,
  toggleFolder,
  toggleAgentSelection,
  onDeleteFolder
}: AgentFolderItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteFolder(folder.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div>
      {/* Folder Header */}
      <div 
        className="folder-header px-4 py-3 bg-gray-50 border-b border-gray-100 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center flex-1"
            onClick={() => toggleFolder(folder.id)}
          >
            {folder.isExpanded ? (
              <ChevronDown className="w-4 h-4 mr-2 text-gray-500" />
            ) : (
              <ChevronUp className="w-4 h-4 mr-2 text-gray-500" />
            )}
            <Folder className="w-4 h-4 mr-2 text-gray-600" />
            <span className="font-medium text-gray-900">{folder.name}</span>
            <span className="ml-2 text-sm text-gray-500">({folder.agents.length})</span>
          </div>

          {/* Folder Actions - Only show for non-"Sem pasta" folders */}
          {folder.id !== 'sem-pasta' && (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir pasta
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir pasta</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza de que deseja excluir a pasta "{folder.name}"? 
                    Todos os agentes dentro dela serão movidos para "Sem pasta".
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleConfirmDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Agents in Folder */}
      {folder.isExpanded && (
        <Droppable droppableId={folder.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[4px] ${
                snapshot.isDraggingOver ? 'bg-blue-50 border-l-4 border-blue-400' : ''
              }`}
            >
              {folder.agents.map((agent, index) => (
                <AgentItem
                  key={agent.id}
                  agent={agent}
                  index={index}
                  isSelected={selectedAgents.includes(agent.id)}
                  onToggleSelection={() => toggleAgentSelection(agent.id)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
}
