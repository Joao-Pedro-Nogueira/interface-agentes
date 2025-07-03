import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RotateCcw, Eye, Clock, Tag, Check, X, MessageSquare, Trash2 } from 'lucide-react';
import { AgentVersion } from './types/agentTypes';

interface AgentVersionHistoryProps {
  versions: AgentVersion[];
  onViewVersion: (version: AgentVersion) => void;
  onRestoreVersion: (versionId: string) => void;
  onUpdateVersionName: (versionId: string, newName: string) => void;
  onUpdateVersionObservations: (versionId: string, observations: string) => void;
  onDeleteVersion: (versionId: string) => void;
}

export default function AgentVersionHistory({ 
  versions, 
  onViewVersion, 
  onRestoreVersion,
  onUpdateVersionName,
  onUpdateVersionObservations,
  onDeleteVersion
}: AgentVersionHistoryProps) {
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'name' | 'observations' | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingObservations, setEditingObservations] = useState('');
  const [deletingVersionId, setDeletingVersionId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingVersionId && editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingVersionId, editingField]);

  const handleDoubleClickName = (version: AgentVersion) => {
    setEditingVersionId(version.id);
    setEditingField('name');
    setEditingName(version.version);
  };

  const handleDoubleClickObservations = (version: AgentVersion) => {
    setEditingVersionId(version.id);
    setEditingField('observations');
    setEditingObservations(version.observations || '');
  };

  const handleSave = () => {
    if (editingVersionId && editingField) {
      if (editingField === 'name' && editingName.trim()) {
        onUpdateVersionName(editingVersionId, editingName.trim());
      } else if (editingField === 'observations') {
        onUpdateVersionObservations(editingVersionId, editingObservations.trim());
      }
      setEditingVersionId(null);
      setEditingField(null);
      setEditingName('');
      setEditingObservations('');
    }
  };

  const handleCancel = () => {
    setEditingVersionId(null);
    setEditingField(null);
    setEditingName('');
    setEditingObservations('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDeleteClick = (versionId: string) => {
    setDeletingVersionId(versionId);
  };

  const handleConfirmDelete = () => {
    if (deletingVersionId) {
      onDeleteVersion(deletingVersionId);
      setDeletingVersionId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingVersionId(null);
  };

  // Reset editing state when versions change (in case of external updates)
  useEffect(() => {
    if (editingVersionId && editingField) {
      const currentVersion = versions.find(v => v.id === editingVersionId);
      if (currentVersion) {
        if (editingField === 'name') {
          setEditingName(currentVersion.version);
        } else if (editingField === 'observations') {
          setEditingObservations(currentVersion.observations || '');
        }
      }
    }
  }, [versions, editingVersionId, editingField]);

  // Exit editing mode when versions are updated externally
  useEffect(() => {
    if (editingVersionId) {
      const currentVersion = versions.find(v => v.id === editingVersionId);
      if (!currentVersion) {
        setEditingVersionId(null);
        setEditingField(null);
        setEditingName('');
        setEditingObservations('');
      }
    }
  }, [versions, editingVersionId]);

  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">Nenhuma versão anterior encontrada.</p>
        <p className="text-sm text-gray-400 mt-2">
          As versões anteriores aparecerão aqui após salvar o agente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-gray-600" />
        <h3 className="text-sm font-medium text-gray-700">
          {versions.length} {versions.length === 1 ? 'versão' : 'versões'} encontrada{versions.length !== 1 ? 's' : ''}
        </h3>
      </div>
      
      {versions.slice().reverse().map((version) => (
        <Card key={`${version.id}-${version.version}`} className="border border-gray-200 hover:border-gray-300 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {editingVersionId === version.id && editingField === 'name' ? (
                    <div className="flex items-center gap-2">
                      <Input
                        ref={inputRef}
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-8 w-32 text-sm"
                        placeholder="Nome da versão"
                      />
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                        disabled={!editingName.trim()}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancel}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <CardTitle 
                      className="text-base cursor-pointer hover:text-blue-600 transition-colors select-none"
                      onDoubleClick={() => handleDoubleClickName(version)}
                      title="Duplo clique para editar nome"
                    >
                      Versão {version.version}
                    </CardTitle>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {version.timestamp}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewVersion(version)}
                  className="h-8 px-2 hover:bg-gray-100"
                  title="Visualizar versão"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestoreVersion(version.id)}
                  className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  title="Restaurar versão"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(version.id)}
                  className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                  title="Deletar versão"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 mb-3">{version.changes}</p>
            
            {/* Observations Section */}
            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Observações</span>
              </div>
              
              {editingVersionId === version.id && editingField === 'observations' ? (
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={editingObservations}
                    onChange={(e) => setEditingObservations(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 text-sm"
                    placeholder="Adicione observações sobre esta versão..."
                  />
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors select-none min-h-[20px]"
                  onDoubleClick={() => handleDoubleClickObservations(version)}
                  title="Duplo clique para editar observações"
                >
                  {version.observations || 'Clique duas vezes para adicionar observações...'}
                </div>
              )}
            </div>
            
            {/* Quick info about the version */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <span className="font-medium">Nome:</span> {version.agentData.name}
                </div>
                <div>
                  <span className="font-medium">Delay:</span> {version.agentData.delay}s
                </div>
                <div>
                  <span className="font-medium">Assinatura:</span> {version.agentData.signature ? 'Sim' : 'Não'}
                </div>
                <div>
                  <span className="font-medium">Primário:</span> {version.agentData.primaryAgent ? 'Sim' : 'Não'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Delete Confirmation Modal */}
      {deletingVersionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Deletar Versão</h3>
                <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja deletar esta versão? Todos os dados da versão serão perdidos permanentemente.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                className="px-4"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="px-4 bg-red-600 hover:bg-red-700"
              >
                Deletar Versão
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 