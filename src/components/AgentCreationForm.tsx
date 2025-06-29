
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Image, Save, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AgentCreationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    delay: 0,
    summary: '',
    instructions: '',
    image: null as File | null
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | number) => {
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
    console.log('Saving agent:', formData);
    // Add save logic here
  };

  const handleTest = () => {
    console.log('Testing agent:', formData);
    // Add test logic here
  };

  return (
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
                  {formData.name || 'Novo Agente'}
                </h1>
                <p className="text-sm text-gray-500">
                  {formData.summary || 'Configurar agente'}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div>
                  <Label htmlFor="image">Imagem do Agente</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-center">
                          <Image className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Clique para fazer upload</p>
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

                {/* Basic Info */}
                <div className="space-y-4">
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

                  <div>
                    <Label htmlFor="delay">Delay (segundos)</Label>
                    <Input
                      id="delay"
                      type="number"
                      value={formData.delay}
                      onChange={(e) => handleInputChange('delay', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="summary">Resumo</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Descreva brevemente o que este agente faz..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          {/* Instruções Tab */}
          <TabsContent value="instrucoes" className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Instruções do Agente</h2>
              <div>
                <Label htmlFor="instructions">Prompt</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="Digite as instruções detalhadas para o agente..."
                  rows={12}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Defina como o agente deve se comportar e responder às solicitações.
                </p>
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
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
              <h2 className="text-lg font-semibold mb-4">Histórico de Versões</h2>
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma versão anterior encontrada.</p>
                <p className="text-sm text-gray-400 mt-2">
                  As versões anteriores aparecerão aqui após salvar o agente.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
