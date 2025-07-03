import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Image, Save, Play, HelpCircle, RotateCcw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AutocompleteModal from './AutocompleteModal';
import HighlightedTextarea from './HighlightedTextarea';
import AgentVersionHistory from './AgentVersionHistory';
import AgentVersionModal from './AgentVersionModal';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { Agent, AgentVersion } from './types/agentTypes';
import { useAgents } from '../contexts/AgentContext';
import { useToast } from '@/hooks/use-toast';

export default function AgentCreationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateAgent, saveAgentVersion, restoreAgentVersion, updateVersionName, updateVersionObservations, deleteVersion, folders } = useAgents();
  const { toast } = useToast();
  const agentIdFromState = location.state?.agent?.id as string | undefined;
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    delay: 0,
    summary: '',
    keywords: '',
    signature: false,
    audioAccessibility: false,
    primaryAgent: false,
    instructions: '',
    image: null as File | null,
    folderId: 'sem-pasta',
    description: '',
    tools: [],
    lastRun: '-',
    lastModified: '-',
    created: '-',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<AgentVersion | null>(null);
  const [currentAgent, setCurrentAgent] = useState<Agent | undefined>(undefined);
  
  // Mock folders data - in a real app this would come from props or context
  const mockFolders = [
    { id: 'pedro', name: 'Pedro' },
    { id: 'exemplo', name: 'exemplo' }
  ];

  const handleInstructionsInsert = (value: string, position: number) => {
    console.log('Inserting value:', value, 'at position:', position);
    
    const textarea = autocomplete.textareaRef.current;
    if (!textarea) return;

    const currentText = formData.instructions;
    const newInstructions = 
      currentText.substring(0, position) + 
      value + 
      currentText.substring(position + 1); // +1 to skip the '@' character
    
    console.log('New instructions:', newInstructions);
    setFormData(prev => ({ ...prev, instructions: newInstructions }));
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      if (textarea) {
        const newPosition = position + value.length;
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
      }
    }, 0);
  };

  const autocomplete = useAutocomplete({
    onInsert: handleInstructionsInsert
  });

  useEffect(() => {
    if (autocomplete.isOpen) {
      console.log('Adding click outside listener');
      document.addEventListener('mousedown', autocomplete.handleClickOutside);
      return () => {
        console.log('Removing click outside listener');
        document.removeEventListener('mousedown', autocomplete.handleClickOutside);
      };
    }
  }, [autocomplete.isOpen, autocomplete.handleClickOutside]);

  // Get current agent from context and sync form data
  useEffect(() => {
    if (agentIdFromState) {
      const agent = folders
        .flatMap(folder => folder.agents)
        .find(agent => agent.id === agentIdFromState);
      
      if (agent) {
        setCurrentAgent(agent);
        setFormData(prev => ({
          ...prev,
          id: agent.id,
          name: agent.name,
          delay: agent.delay || 0,
          summary: agent.summary || '',
          keywords: agent.keywords || '',
          signature: agent.signature || false,
          audioAccessibility: agent.audioAccessibility || false,
          primaryAgent: agent.primaryAgent || false,
          description: agent.description || '',
          tools: agent.tools || [],
          lastRun: agent.lastRun || '-',
          lastModified: agent.lastModified || '-',
          created: agent.created || '-',
        }));
      }
    }
  }, [folders, agentIdFromState]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (currentAgent) {
      // Update existing agent
      const updatedAgent: Agent = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        tools: formData.tools,
        lastRun: formData.lastRun,
        lastModified: 'agora',
        created: formData.created,
        delay: formData.delay,
        summary: formData.summary,
        keywords: formData.keywords,
        signature: formData.signature,
        audioAccessibility: formData.audioAccessibility,
        primaryAgent: formData.primaryAgent,
        versions: currentAgent.versions
      };
      
      updateAgent(updatedAgent);
      
      // Save version with changes description
      const changes = `Atualização do agente: ${formData.name}`;
      saveAgentVersion(formData.id, changes);
      
      toast({
        title: "Agente atualizado",
        description: `O agente "${formData.name}" foi atualizado com sucesso.`
      });
    } else {
      // Create new agent logic here if needed
      toast({
        title: "Agente criado",
        description: `O agente "${formData.name}" foi criado com sucesso.`
      });
    }
    
    navigate('/');
  };

  const handleTest = () => {
    console.log('Testing agent:', formData);
    // Add test logic here
  };

  const handleRestoreVersion = (versionId: string) => {
    if (currentAgent) {
      restoreAgentVersion(currentAgent.id, versionId);
      
      // Update form data with restored version
      const versionToRestore = currentAgent.versions?.find(v => v.id === versionId);
      if (versionToRestore) {
        setFormData(prev => ({
          ...prev,
          name: versionToRestore.agentData.name,
          delay: versionToRestore.agentData.delay,
          summary: versionToRestore.agentData.summary,
          keywords: versionToRestore.agentData.keywords,
          signature: versionToRestore.agentData.signature,
          audioAccessibility: versionToRestore.agentData.audioAccessibility,
          primaryAgent: versionToRestore.agentData.primaryAgent,
          description: versionToRestore.agentData.description,
          tools: versionToRestore.agentData.tools,
          lastRun: versionToRestore.agentData.lastRun,
          lastModified: 'agora',
          created: versionToRestore.agentData.created,
        }));
      }
      
      toast({
        title: "Versão restaurada",
        description: "A versão selecionada foi restaurada com sucesso."
      });
    }
  };

  const handleViewVersion = (version: AgentVersion) => {
    setSelectedVersion(version);
  };

  const handleCloseVersionView = () => {
    setSelectedVersion(null);
  };

  const handleUpdateVersionName = (versionId: string, newName: string) => {
    if (currentAgent) {
      updateVersionName(currentAgent.id, versionId, newName);
      toast({
        title: "Nome da versão atualizado",
        description: `A versão foi renomeada para "${newName}".`
      });
    }
  };

  const handleUpdateVersionObservations = (versionId: string, observations: string) => {
    if (currentAgent) {
      updateVersionObservations(currentAgent.id, versionId, observations);
      toast({
        title: "Observações atualizadas",
        description: "As observações da versão foram atualizadas com sucesso."
      });
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    if (currentAgent) {
      deleteVersion(currentAgent.id, versionId);
      toast({
        title: "Versão deletada",
        description: "A versão foi deletada com sucesso."
      });
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Agent" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-white font-bold">A</span>
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-semibold">
                    {currentAgent ? 'Editar Agente' : 'Novo Agente'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {currentAgent ? `Editando: ${formData.name}` : 'Configurar agente'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleTest}>
                <Play className="w-4 h-4 mr-2" />
                Testar
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto p-6">
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
              <TabsTrigger value="biblioteca">Biblioteca</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            {/* Geral Tab */}
            <TabsContent value="geral" className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Configurações Gerais</h2>
                
                {/* Image Upload and Basic Info Row */}
                <div className="flex gap-6 mb-6">
                  {/* Image Upload - Square */}
                  <div className="flex-shrink-0">
                    <Label htmlFor="image">Imagem do Agente</Label>
                    <div className="mt-2">
                      <div className="relative flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="text-center pointer-events-none">
                            <Image className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">Upload</p>
                          </div>
                        )}
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name, Delay and Folder */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <Label htmlFor="name">Nome do Agente</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Digite o nome do agente"
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Label htmlFor="delay">Delay (segundos)</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tempo de espera antes de iniciar a execução do agente</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          id="delay"
                          type="number"
                          value={formData.delay}
                          onChange={(e) => handleInputChange('delay', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div className="flex-1">
                        <Label htmlFor="folder">Pasta do agente</Label>
                        <Select 
                          value={formData.folderId} 
                          onValueChange={(value) => handleInputChange('folderId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma pasta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sem-pasta">Sem pasta</SelectItem>
                            {mockFolders.map((folder) => (
                              <SelectItem key={folder.id} value={folder.id}>
                                {folder.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remaining Fields - Full Width */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor="keywords">Keywords Iniciais</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Palavras-chave que definem o contexto do agente</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="keywords"
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => handleInputChange('keywords', e.target.value)}
                      placeholder="Digite as keywords separadas por vírgula"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor="summary">Resumo</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Descrição resumida das funcionalidades do agente</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                      placeholder="Descreva brevemente o que este agente faz..."
                      rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    />
                  </div>

                  {/* Toggle Switches */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <Switch
                        id="signature"
                        checked={formData.signature}
                        onCheckedChange={(checked) => handleInputChange('signature', checked)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="signature">Assinatura</Label>
                        <p className="text-sm text-gray-500">Adicionar assinatura ao final das respostas</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        id="audioAccessibility"
                        checked={formData.audioAccessibility}
                        onCheckedChange={(checked) => handleInputChange('audioAccessibility', checked)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="audioAccessibility">Acessibilidade de Áudio</Label>
                        <p className="text-sm text-gray-500">Permitir respostas em formato de áudio</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        id="primaryAgent"
                        checked={formData.primaryAgent}
                        onCheckedChange={(checked) => handleInputChange('primaryAgent', checked)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="primaryAgent">Agente Primário</Label>
                        <p className="text-sm text-gray-500">Definir como agente principal do sistema</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Instruções Tab */}
            <TabsContent value="instrucoes" className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Instruções do Agente</h2>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="instructions">Prompt</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Instruções detalhadas que definem o comportamento do agente</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <HighlightedTextarea
                    ref={autocomplete.textareaRef}
                    id="instructions"
                    value={formData.instructions}
                    onChange={(value) => handleInputChange('instructions', value)}
                    onKeyDown={autocomplete.handleKeyDown}
                    placeholder="Digite as instruções detalhadas para o agente... Use @ para inserir variáveis dinâmicas."
                    rows={12}
                    className="mt-2"
                  />
                  
                  {/* Character Counter and Progress Bar */}
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        {formData.instructions.length} / 5000 caracteres
                      </span>
                      <span className={`font-medium ${
                        formData.instructions.length > 4500 
                          ? 'text-red-600' 
                          : formData.instructions.length > 4000 
                            ? 'text-yellow-600' 
                            : 'text-gray-600'
                      }`}>
                        {Math.round((formData.instructions.length / 5000) * 100)}%
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          formData.instructions.length > 4500 
                            ? 'bg-red-500' 
                            : formData.instructions.length > 4000 
                              ? 'bg-yellow-500' 
                              : 'bg-blue-500'
                        }`}
                        style={{ 
                          width: `${Math.min((formData.instructions.length / 5000) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-3">
                    Defina como o agente deve se comportar e responder às solicitações. Use @ para inserir variáveis dinâmicas.
                  </p>
                  
                  {autocomplete.isOpen && (
                    <AutocompleteModal
                      position={autocomplete.position}
                      onSelect={autocomplete.handleSelect}
                      onClose={autocomplete.handleClose}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Biblioteca Tab */}
            <TabsContent value="biblioteca" className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Biblioteca de Arquivos</h2>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    Arraste arquivos aqui ou clique para fazer upload
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" size="sm">
                    Selecionar Arquivos
                  </Button>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Arquivos Enviados</h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Histórico Tab */}
            <TabsContent value="historico" className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Histórico de Versão</h2>
                
                <AgentVersionHistory
                  versions={currentAgent?.versions || []}
                  onViewVersion={handleViewVersion}
                  onRestoreVersion={handleRestoreVersion}
                  onUpdateVersionName={handleUpdateVersionName}
                  onUpdateVersionObservations={handleUpdateVersionObservations}
                  onDeleteVersion={handleDeleteVersion}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Version View Modal */}
        <AgentVersionModal
          version={selectedVersion}
          onClose={handleCloseVersionView}
        />
      </div>
    </TooltipProvider>
  );
}
