import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { FileText, Zap, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const cards = [
    {
      title: 'Document Tracker',
      description: 'Track document processing status',
      icon: FileText,
      href: '/document-tracker',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Accounting & Cash',
      description: 'Manage Accounting & cash, Private Equity, capital call workflows',
      icon: Zap,
      href: '/accounting-cash',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Alternative Data',
      description: 'Manage alternative investment data',
      icon: TrendingUp,
      href: '/alternative-data',
      color: 'bg-green-100 text-green-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2">Welcome to ALE!</h1>
        <p className="text-neutral-600">Select a module to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.href}
              onClick={() => navigate(card.href)}
              className="text-left card hover:shadow-lg transition transform hover:scale-105"
            >
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-neutral-600">{card.description}</p>

              <div className="mt-4 flex items-center text-primary-blue text-sm font-medium">
                Go to module →
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-primary-blue to-primary-dark text-dark rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-2">Getting Started</h2>
        <p className="mb-4">
          Use the modules above to manage your application lifecycle. Each module provides tools for specific tasks.
        </p>

        <ul className="space-y-2 text-sm">
          <li>• <strong>Document Tracker</strong> - Monitor document processing and status</li>
          <li>• <strong>Accounting & Cash</strong> - Create and manage capital call requests with approvals</li>
          <li>• <strong>Alternative Data</strong> - Manage columnar data with custom views</li>
        </ul>
      </div>
    </div>
  );
}
