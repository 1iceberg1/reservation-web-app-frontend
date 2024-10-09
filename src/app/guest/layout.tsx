'use client';

import { AuthGuestGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuestGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuestGuard>
  );
}
