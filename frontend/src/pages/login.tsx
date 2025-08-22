import { useState, useEffect } from 'react';
import { login } from 'lib/api';
import { setToken, isAuthed } from 'lib/auth';
import { validateEmail } from 'lib/validate';
import { useRouter } from 'next/router';
import { setupAutoLogout } from 'lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('demo@demo.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => { if (isAuthed()) router.replace('/devices'); }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) return setError('Please enter a valid email.');
    if (password.length < 4) return setError('Password must be at least 4 characters.');

    setLoading(true);
    try {
        const res = await login(email, password);
        setToken(res.token);
        setupAutoLogout(() => router.replace('/login')); // start timer now
        router.push('/devices');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '48px auto' }}>
        <h2>Login</h2>
        <p style={{ color: '#6b7280' }}>Use the seeded account: demo@demo.com / password</p>
        <form onSubmit={onSubmit} className="row" style={{ gap: 12 }}>
          <div className="col" style={{ flex: '1 1 100%' }}>
            <label>Email</label>
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="col" style={{ flex: '1 1 100%' }}>
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  );
}
