import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'denied';
  timestamp: Date;
  type: 'credit' | 'debit';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Use centralized data from AuthContext
  const transactions = user?.transactions || [];
  const totalBalance = user?.balance || 0;
  const initialBalance = user?.initialBalance || 0;

  // Calculate P&L percentage
  const calculatePnL = () => {
    if (initialBalance === 0) return 0;
    return ((totalBalance - initialBalance) / initialBalance) * 100;
  };

  const pnlPercentage = calculatePnL();
  const pnlAmount = totalBalance - initialBalance;

  useEffect(() => {
    // Load CoinGecko widget script
    const script = document.createElement('script');
    script.src = 'https://widgets.coingecko.com/gecko-coin-list-widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'denied':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'denied': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'credit' ? 'text-green-400' : 'text-red-400';
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center text-slate-400">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ec1e8e78-e8e4-4f4d-a225-181630b1f3cd-ChatGPT_Image_Aug_28__2025__12_07_34_AM-removebg-preview.png" alt="ApexFX" className="h-8" />
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user.firstName || 'User'}!</h1>
            <p className="text-slate-400">Here's what's happening with your account</p>
          </div>
        </div>
      </div>

      {/* Total Balance & P&L - Prominently Displayed */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-lg font-medium text-slate-300 mb-2">Total Balance</h2>
          <div className="text-5xl font-bold text-white mb-2">${totalBalance.toFixed(2)}</div>
          <p className="text-slate-400">Your account balance updates in real-time</p>
        </div>
        
        {/* P&L Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">Initial Balance</p>
            <p className="text-lg font-semibold text-white">${initialBalance.toFixed(2)}</p>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">Profit & Loss</p>
            <div className="flex items-center justify-center gap-2">
              {pnlAmount >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <p className={`text-lg font-semibold ${pnlAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pnlAmount >= 0 ? '+' : ''}{pnlAmount.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">P&L Percentage</p>
            <p className={`text-lg font-semibold ${pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Credits</p>
                    <p className="text-lg font-semibold text-white">
                      ${transactions.filter(t => t.type === 'credit' && t.status === 'success').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Debits</p>
                    <p className="text-lg font-semibold text-white">
                      ${transactions.filter(t => t.type === 'debit' && t.status === 'success').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Pending Transactions</p>
                    <p className="text-lg font-semibold text-white">
                      {transactions.filter(t => t.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Market Overview</h3>
          <div className="h-64">
            <gecko-coin-list-widget 
              locale="en" 
              dark-mode="true" 
              outlined="true" 
              coin-ids="" 
              initial-currency="usd"
            />
          </div>
        </div>
      </div>

      {/* Transaction History Log - Comprehensive and Real-time */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ec1e8e78-e8e4-4f4d-a225-181630b1f3cd-ChatGPT_Image_Aug_28__2025__12_07_34_AM-removebg-preview.png" alt="ApexFX" className="h-6" />
            <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
          </div>
          <div className="text-sm text-slate-400">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-750 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </div>
                </div>
                
                <div>
                  <p className="text-white font-medium">{transaction.description}</p>
                  <p className="text-sm text-slate-400">
                    {new Date(transaction.timestamp).toLocaleDateString()} at {new Date(transaction.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${getTypeColor(transaction.type)}`}>
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-slate-400 capitalize">{transaction.type}</p>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-600" />
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="text-sm">Your transaction history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;