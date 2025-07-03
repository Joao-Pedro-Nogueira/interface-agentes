import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Eye, Clock, Tag } from 'lucide-react';
import { AgentVersion } from './types/agentTypes';

interface AgentVersionHistoryProps {
  versions: AgentVersion[];
  onViewVersion: (version: AgentVersion) => void;
  onRestoreVersion: (versionId: string) => void;
}

export default function AgentVersionHistory({ 
  versions, 
  onViewVersion, 
  onRestoreVersion 
}: AgentVersionHistoryProps) {
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
          {versions.length} versão{versions.length !== 1 ? 'ões' : ''} encontrada{versions.length !== 1 ? 's' : ''}
        </h3>
      </div>
      
      {versions.slice().reverse().map((version) => (
        <Card key={version.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Versão {version.version}</CardTitle>
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
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600">{version.changes}</p>
            
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
    </div>
  );
} 