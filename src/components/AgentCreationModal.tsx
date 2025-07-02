import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AgentFolder } from './types/agentTypes';

interface AgentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (name: string, folderId?: string) => void;
  folders: AgentFolder[];
}

export default function AgentCreationModal({
  isOpen,
  onClose,
  onCreateAgent,
  folders
}: AgentCreationModalProps) {
  const [agentName, setAgentName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agentName.trim()) return;

    setIsLoading(true);
    onCreateAgent(agentName.trim(), selectedFolderId);
    
    setAgentName('');
    setSelectedFolderId(undefined);
    onClose();
    setIsLoading(false);
  };

  const handleClose = () => {
    setAgentName('');
    setSelectedFolderId(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Agente</DialogTitle>
          <DialogDescription>
            Digite o nome do agente e escolha a pasta onde ele será criado.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="agent-name" className="text-right">
                Nome
              </Label>
              <Input
                id="agent-name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Digite o nome do agente"
                className="col-span-3"
                maxLength={100}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folder-select" className="text-right">
                Pasta
              </Label>
              <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma pasta (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem-pasta">Sem pasta</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!agentName.trim() || isLoading}
            >
              {isLoading ? 'Criando...' : 'Criar Agente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}