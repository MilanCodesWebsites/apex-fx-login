import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Admin/AdminLayout';
import AuthWrapper from './components/Auth/AuthWrapper';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import Dashboard from './components/Home/Dashboard';
import DepositPage from './components/Deposit/DepositPage';
import WithdrawPage from './components/Withdraw/WithdrawPage';
import TransactionsPage from './components/Transactions/TransactionsPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLogin from './components/Auth/AdminLogin';
import Onboarding from './components/Onboarding/Onboarding';
import AdminUserDetail from './components/Admin/AdminUserDetail';
import AdminUsersList from './components/Admin/AdminUsersList';
import SettingsPage from './components/Settings/SettingsPage';

// Mock transactions data
const mockTransactions = [
  {
    id: '1',
    type: 'deposit',
    amount: 1000,
    currency: 'USDT',
    status: 'completed',
    createdAt: new Date('2024-12-20T10:30:00Z')
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 500,
    currency: 'BTC',
    status: 'pending',
    createdAt: new Date('2024-12-19T15:45:00Z')
  },
  {
    id: '3',
    type: 'deposit',
    amount: 2500,
    currency: 'ETH',
    status: 'completed',
    createdAt: new Date('2024-12-18T09:15:00Z')
  }
];

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isAdminAuthenticated, logout, updateUser } = useAuth();
  const [transactions, setTransactions] = useState(mockTransactions);

  return (
    <div className="min-h-screen bg-deep-black text-slate-100">
        <Routes>
          {/* Admin route is always available: shows login if not admin-authenticated */}
          <Route path="/admin" element={
            isAdminAuthenticated ? (
              <ProtectedRoute requireAdmin>
                <AdminLayout onLogout={logout}>
                  <AdminDashboard 
                    users={user ? [user] : []} 
                    transactions={transactions}
                    onUpdateUser={updateUser}
                    onAddTransaction={(transaction) => setTransactions(prev => [...prev, transaction])}
                  />
                </AdminLayout>
              </ProtectedRoute>
            ) : (
              <AdminLogin />
            )
          } />

          <Route path="/admin/users" element={
            isAdminAuthenticated ? (
              <ProtectedRoute requireAdmin>
                <AdminLayout onLogout={logout}>
                  <AdminUsersList />
                </AdminLayout>
              </ProtectedRoute>
            ) : (
              <AdminLogin />
            )
          } />

          <Route path="/admin/users/:id" element={
            isAdminAuthenticated ? (
              <ProtectedRoute requireAdmin>
                <AdminLayout onLogout={logout}>
                  <AdminUserDetail />
                </AdminLayout>
              </ProtectedRoute>
            ) : (
              <AdminLogin />
            )
          } />

          {/* User routes */}
          <Route path="/" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <Dashboard user={user!} transactions={transactions} />
                </Layout>
              </ProtectedRoute>
            ) : (
              <AuthWrapper />
            )
          } />

          <Route path="/deposit" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <DepositPage onDeposit={(transaction) => setTransactions(prev => [...prev, transaction])} />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/withdraw" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <WithdrawPage balance={user!.balance} onWithdraw={(transaction) => setTransactions(prev => [...prev, transaction])} />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/transactions" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <TransactionsPage transactions={transactions} />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/onboarding" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <Onboarding />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/settings" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#111111',
            color: '#f1f5f9',
            border: '1px solid #334155'
          }
        }} />
      </Router>
    </AuthProvider>
  );
}

export default App;