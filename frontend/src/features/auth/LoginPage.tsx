import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  // generate code for login with sso buttons for Google and Microsoft (mocked, no actual integration)
  const handleSSOLogin = (provider: string) => {
    setError('');
    setLoading(true);
    // Mock SSO authentication
    const mockUser = {
      id: '1',
      username: `${provider.toLowerCase()}_user`,
      email: `${provider.toLowerCase()}
@example.com`,
      permissions: ['RULE_VIEW', 'RULE_EDIT', 'RULE_SUBMIT', 'RULE_APPROVE'],
      roles: ['USER', 'ADMIN'],
    };
    login(mockUser, 'mock-jwt-token');
    navigate('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock authentication
    if (username && password) {
      const mockUser = {
        id: '1',
        username,
        email: `${username}@example.com`,
        permissions: ['RULE_VIEW', 'RULE_EDIT', 'RULE_SUBMIT', 'RULE_APPROVE'],
        roles: ['USER', 'ADMIN'],
      };

      login(mockUser, 'mock-jwt-token');
      navigate('/dashboard');
    } else {
      setError('Please enter username and password');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-primary-blue to-primary-dark">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary-blue text-white p-3 rounded-lg">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold mb-2">ALE</h1>
          <p className="text-center text-neutral-600 text-sm mb-6">Application Lifecycle Engine</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error">
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <button type="button" className="btn btn-secondary w-full mt-2" onClick={() => handleSSOLogin('Google')}>
              Sign in with Google   
            </button>
            <button type="button" className="btn btn-secondary w-full mt-2" onClick={() => handleSSOLogin('Microsoft')}>
              Sign in with Microsoft   
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-center text-xs text-neutral-500 mb-2">Demo credentials:</p>
            <p className="text-center text-xs text-neutral-500">
              Username: <strong>demo</strong> | Password: any password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
