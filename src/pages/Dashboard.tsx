
import Sidebar from '@/components/Sidebar';
import AgentList from '@/components/AgentList';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <AgentList />
    </div>
  );
}
