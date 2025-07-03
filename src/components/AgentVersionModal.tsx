import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Calendar, Tag, Settings, FileText, Mic, Star, MessageSquare } from 'lucide-react';
import { AgentVersion } from './types/agentTypes';

interface AgentVersionModalProps {
  version: AgentVersion | null;
  onClose: () => void;
}

export default function AgentVersionModal({ version, onClose }: AgentVersionModalProps) {
  if (!version) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">
                  Versão {version.version}
                </h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                {version.timestamp}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">{version.changes}</p>
          {version.observations && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Observações</span>
              </div>
              <p className="text-sm text-blue-700">{version.observations}</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Informações Básicas</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Nome do Agente</Label>
                <p className="text-sm text-gray-900 mt-1">{version.agentData.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Delay</Label>
                <p className="text-sm text-gray-900 mt-1">{version.agentData.delay} segundos</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Resumo</Label>
                <p className="text-sm text-gray-900 mt-1">
                  {version.agentData.summary || 'Nenhum resumo disponível'}
                </p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Keywords</Label>
                <p className="text-sm text-gray-900 mt-1">
                  {version.agentData.keywords || 'Nenhuma keyword definida'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Configuration Flags */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Configurações</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${version.agentData.signature ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-700">Assinatura</span>
                <Badge variant={version.agentData.signature ? "default" : "secondary"} className="text-xs">
                  {version.agentData.signature ? 'Ativada' : 'Desativada'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Mic className={`w-4 h-4 ${version.agentData.audioAccessibility ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-700">Acessibilidade de Áudio</span>
                <Badge variant={version.agentData.audioAccessibility ? "default" : "secondary"} className="text-xs">
                  {version.agentData.audioAccessibility ? 'Ativada' : 'Desativada'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${version.agentData.primaryAgent ? 'text-yellow-500' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-700">Agente Primário</span>
                <Badge variant={version.agentData.primaryAgent ? "default" : "secondary"} className="text-xs">
                  {version.agentData.primaryAgent ? 'Sim' : 'Não'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Metadados</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-xs font-medium text-gray-500">Criado</Label>
                <p className="text-gray-900 mt-1">{version.agentData.created}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-500">Última Modificação</Label>
                <p className="text-gray-900 mt-1">{version.agentData.lastModified}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-500">Última Execução</Label>
                <p className="text-gray-900 mt-1">{version.agentData.lastRun}</p>
              </div>
            </div>
          </div>

          {version.agentData.description && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                <p className="text-sm text-gray-900 mt-1">{version.agentData.description}</p>
              </div>
            </>
          )}

          {version.agentData.tools && version.agentData.tools.length > 0 && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-gray-700">Ferramentas</Label>
                <div className="flex gap-2 mt-1">
                  {version.agentData.tools.map((tool, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 