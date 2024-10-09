'use client';

import { AuthAdminGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthAdminGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthAdminGuard>
  );
}
