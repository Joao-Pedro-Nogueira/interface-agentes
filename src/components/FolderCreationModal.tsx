import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FolderCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (name: string) => boolean;
}

export default function FolderCreationModal({
  isOpen,
  onClose,
  onCreateFolder
}: FolderCreationModalProps) {
  const [folderName, setFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) return;

    setIsLoading(true);
    const success = onCreateFolder(folderName.trim());
    
    if (success) {
      setFolderName('');
      onClose();
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    setFolderName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Pasta</DialogTitle>
          <DialogDescription>
            Digite o nome da pasta para organizar seus agentes.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folder-name" className="text-right">
                Nome
              </Label>
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Digite o nome da pasta"
                className="col-span-3"
                maxLength={50}
              />
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
              disabled={!folderName.trim() || isLoading}
            >
              {isLoading ? 'Criando...' : 'Criar Pasta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}