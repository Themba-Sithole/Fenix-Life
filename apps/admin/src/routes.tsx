import { createBrowserRouter, Navigate } from 'react-router';
import type { ComponentType } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute';
import LoginScreen from '@/screens/LoginScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import AccountsScreen, { SaveInspectScreen } from '@/screens/AccountsScreen';
import AuditLogScreen from '@/screens/AuditLogScreen';
import ModerationScreen from '@/screens/ModerationScreen';
import FeatureFlagsScreen from '@/screens/FeatureFlagsScreen';

function protect(Component: ComponentType) {
  return function ProtectedScreen() {
    return (
      <ProtectedAdminRoute>
        <Component />
      </ProtectedAdminRoute>
    );
  };
}

export const router = createBrowserRouter([
  { path: '/login', Component: LoginScreen },
  {
    path: '/',
    Component: protect(AdminLayout),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', Component: DashboardScreen },
      { path: 'accounts', Component: AccountsScreen },
      { path: 'accounts/:accountId', Component: AccountsScreen },
      { path: 'saves/:saveId', Component: SaveInspectScreen },
      { path: 'audit', Component: AuditLogScreen },
      { path: 'moderation', Component: ModerationScreen },
      { path: 'feature-flags', Component: FeatureFlagsScreen },
    ],
  },
]);
