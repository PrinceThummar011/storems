import { useEffect, useState } from 'react';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

function App() {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('adminAuthed') === 'true';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('adminAuthed', isAuthed ? 'true' : 'false');
  }, [isAuthed]);

  if (!isAuthed) {
    return <AdminLogin onSuccess={() => setIsAuthed(true)} />;
  }

  return <AdminPanel onLogout={() => setIsAuthed(false)} />;
}

export default App;


