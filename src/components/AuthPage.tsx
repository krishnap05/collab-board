import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState } from 'react';

export default function AuthPage() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setMode('sign-in')} disabled={mode === 'sign-in'}>Sign In</button>
        <button onClick={() => setMode('sign-up')} disabled={mode === 'sign-up'} style={{ marginLeft: 8 }}>Sign Up</button>
      </div>
      {mode === 'sign-in' ? <SignIn /> : <SignUp />}
    </div>
  );
}
