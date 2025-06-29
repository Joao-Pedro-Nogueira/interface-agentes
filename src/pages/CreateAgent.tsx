
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CreateAgent() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Criar Novo Agente</h1>
        <p className="text-gray-600 mb-8">Esta página será implementada em breve.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Agentes
        </Link>
      </div>
    </div>
  );
}
