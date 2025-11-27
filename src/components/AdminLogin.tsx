import { FormEvent, useState } from 'react';

interface AdminLoginProps {
  onSuccess: () => void;
}

const ADMIN_EMAIL = 'bqueen@gmail.com';
const ADMIN_PASSWORD = '1234';

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setError(null);
      onSuccess();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Admin Login</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Use the credentials provided to access the admin console.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="bqueen@gmail.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••"
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full bg-white text-gray-900 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}


