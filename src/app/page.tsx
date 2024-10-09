'use client';

import AuthLayout from 'src/layouts/auth';
import { GuestGuard } from 'src/auth/guard';

import { Login } from 'src/sections/auth';

export default function ModernLoginPage() {
  return (
    <GuestGuard>
      <AuthLayout>
        <Login />
      </AuthLayout>
    </GuestGuard>
  );
}
