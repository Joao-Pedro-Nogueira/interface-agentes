
import { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AutocompleteItem {
  id: string;
  label: string;
  value: string;
}

interface AutocompleteCategory {
  id: string;
  label: string;
  items: AutocompleteItem[];
}

interface AutocompleteModalProps {
  position: { x: number; y: number };
  onSelect: (value: string) => void;
  onClose: () => void;
}

const CATEGORIES: AutocompleteCategory[] = [
  {
    id: 'status',
    label: 'Status',
    items: [
      { id: 'aguardando', label: 'Aguardando', value: '{{status:Aguardando}}' },
      { id: 'pausado', label: 'Pausado', value: '{{status:Pausado}}' },
      { id: 'concluido', label: 'Concluído', value: '{{status:Concluído}}' }
    ]
  },
  {
    id: 'departamentos',
    label: 'Departamentos',
    items: [
      { id: 'vendas', label: 'Vendas', value: '{{departamento:Vendas}}' },
      { id: 'marketing', label: 'Marketing', value: '{{departamento:Marketing}}' },
      { id: 'suporte', label: 'Suporte', value: '{{departamento:Suporte}}' },
      { id: 'rh', label: 'Recursos Humanos', value: '{{departamento:RH}}' }
    ]
  },
  {
    id: 'etiquetas',
    label: 'Etiquetas',
    items: [
      { id: 'urgente', label: 'Urgente', value: '{{etiqueta:Urgente}}' },
      { id: 'importante', label: 'Importante', value: '{{etiqueta:Importante}}' },
      { id: 'baixa', label: 'Baixa Prioridade', value: '{{etiqueta:Baixa}}' }
    ]
  },
  {
    id: 'responsaveis',
    label: 'Responsáveis',
    items: [
      { id: 'joao', label: 'João Silva', value: '{{responsavel:João Silva}}' },
      { id: 'maria', label: 'Maria Santos', value: '{{responsavel:Maria Santos}}' },
      { id: 'pedro', label: 'Pedro Costa', value: '{{responsavel:Pedro Costa}}' }
    ]
  },
  {
    id: 'ferramentas',
    label: 'Ferramentas',
    items: [
      { id: 'email', label: 'Email', value: '{{ferramenta:Email}}' },
      { id: 'chat', label: 'Chat', value: '{{ferramenta:Chat}}' },
      { id: 'api', label: 'API', value: '{{ferramenta:API}}' }
    ]
  },
  {
    id: 'mensagens',
    label: 'Mensagens',
    items: [
      { id: 'bom-dia', label: 'Bom dia', value: '{{mensagem:Bom dia}}' },
      { id: 'obrigado', label: 'Obrigado', value: '{{mensagem:Obrigado}}' },
      { id: 'ate-logo', label: 'Até logo', value: '{{mensagem:Até logo}}' }
    ]
  }
];

export default function AutocompleteModal({ position, onSelect, onClose }: AutocompleteModalProps) {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [currentView, setCurrentView] = useState<'categories' | 'items'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<AutocompleteCategory | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (currentView === 'categories') {
        if (e.key === 'ArrowDown') {
          setSelectedCategoryIndex(prev => 
            prev < CATEGORIES.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === 'ArrowUp') {
          setSelectedCategoryIndex(prev => 
            prev > 0 ? prev - 1 : CATEGORIES.length - 1
          );
        } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
          const category = CATEGORIES[selectedCategoryIndex];
          setSelectedCategory(category);
          setCurrentView('items');
          setSelectedItemIndex(0);
        }
      } else if (currentView === 'items' && selectedCategory) {
        if (e.key === 'ArrowDown') {
          setSelectedItemIndex(prev => 
            prev < selectedCategory.items.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === 'ArrowUp') {
          setSelectedItemIndex(prev => 
            prev > 0 ? prev - 1 : selectedCategory.items.length - 1
          );
        } else if (e.key === 'Enter') {
          onSelect(selectedCategory.items[selectedItemIndex].value);
        } else if (e.key === 'ArrowLeft') {
          setCurrentView('categories');
          setSelectedCategory(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentView, selectedCategoryIndex, selectedItemIndex, selectedCategory, onSelect, onClose]);

  const handleCategoryClick = (category: AutocompleteCategory) => {
    setSelectedCategory(category);
    setCurrentView('items');
    setSelectedItemIndex(0);
  };

  const handleItemClick = (item: AutocompleteItem) => {
    onSelect(item.value);
  };

  const handleBackClick = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
  };

  return (
    <div
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 max-w-64"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {currentView === 'categories' ? (
        <div className="p-2">
          <div className="text-xs text-gray-500 px-2 py-1 border-b border-gray-100 mb-1">
            Selecione uma categoria
          </div>
          {CATEGORIES.map((category, index) => (
            <button
              key={category.id}
              className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 flex items-center justify-between ${
                index === selectedCategoryIndex ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <span>{category.label}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ))}
        </div>
      ) : (
        selectedCategory && (
          <div className="p-2">
            <div className="flex items-center px-2 py-1 border-b border-gray-100 mb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="h-6 w-6 p-0 mr-2"
              >
                <ArrowLeft className="w-3 h-3" />
              </Button>
              <span className="text-xs text-gray-500">{selectedCategory.label}</span>
            </div>
            {selectedCategory.items.map((item, index) => (
              <button
                key={item.id}
                className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${
                  index === selectedItemIndex ? 'bg-blue-50 text-blue-600' : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}
