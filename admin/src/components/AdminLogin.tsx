import { FormEvent, useState } from 'react';

interface AdminLoginProps {
  onSuccess: () => void;
}

const ADMIN_EMAIL = 'bqueen@gmail.com';
const ADMIN_PASSWORD = '1234';

export function AdminLogin({ onSuccess }: AdminLoginProps) {
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
    <div className="app-shell">
      <div className="card login-card">
        <h1 className="login-title">Burger Queen Admin</h1>
        <p className="login-sub">Sign in with the admin credentials to view orders and manage menu.</p>
        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label className="label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              className="input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="bqueen@gmail.com"
              required
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="button login-button">
            Sign in
          </button>
        </form>
        <p className="muted" style={{ marginTop: '0.8rem' }}>
          Demo login: <strong>{ADMIN_EMAIL}</strong> / <strong>{ADMIN_PASSWORD}</strong>
        </p>
      </div>
    </div>
  );
}


