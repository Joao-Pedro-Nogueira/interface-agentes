
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Folder,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const sidebarItems = [
  { title: 'Agentes', path: '/', icon: Search, isActive: true },
  { title: 'Templates', path: '/templates', icon: Folder },
  { title: 'Ferramentas', path: '/tools', icon: Plus },
  { title: 'Integrações', path: '/integrations', icon: Search },
  { title: 'Configurações', path: '/settings', icon: Search }
];

export default function Sidebar() {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Talita</h2>
            <p className="text-sm text-gray-500">Talita</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.title}
            </NavLink>
          ))}
        </div>

        {/* Workspace Section */}
        <div className="mt-8">
          <div 
            className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg"
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          >
            <span>Workspace</span>
            {isWorkspaceOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          
          {isWorkspaceOpen && (
            <div className="mt-2 space-y-1 pl-3">
              <div className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                <Search className="w-4 h-4 mr-3" />
                Agentes
              </div>
              <div className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                <Folder className="w-4 h-4 mr-3" />
                Ferramentas
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Pedro</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
