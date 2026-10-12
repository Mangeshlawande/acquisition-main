import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { RoleGuard } from '@/features/auth/components/RoleGuard';

import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DealsPage } from '@/pages/DealsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { UsersPage } from '@/pages/UsersPage';
import { SecurityInfoPage } from '@/pages/SecurityInfoPage';

export const router = createBrowserRouter([
  // Public Landing Page & Auth Routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },

  // Authenticated App Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/deals',
            element: <DealsPage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/security-info',
            element: <SecurityInfoPage />,
          },
          // Admin Only Routes
          {
            element: <RoleGuard allowedRoles={['admin']} />,
            children: [
              {
                path: '/admin/users',
                element: <UsersPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  // Catch-all Redirect
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
