import React from 'react';
import { X, TrendingUp, TrendingDown, ArrowDown, ArrowUp, DollarSign, Calendar, Clock, User, Receipt, Printer } from 'lucide-react';
import Modal from '../UI/Modal';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'denied';
  timestamp: Date | string;
  type: 'credit' | 'debit';
}

interface TransactionReceiptModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
}

const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({ 
  transaction, 
  isOpen, 
  onClose, 
  userBalance 
}) => {
  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Safe date parsing with fallback
  const parseDate = (timestamp: Date | string): Date => {
    if (timestamp instanceof Date) {
      return timestamp;
    }
    
    if (typeof timestamp === 'string') {
      const parsed = new Date(timestamp);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    
    // Fallback to current date if parsing fails
    return new Date();
  };

  const formatDate = (timestamp: Date | string) => {
    try {
      const date = parseDate(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (timestamp: Date | string) => {
    try {
      const date = parseDate(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(date);
    } catch (error) {
      return 'Invalid Time';
    }
  };

  const getTransactionTypeIcon = () => {
    switch (transaction.type) {
      case 'credit':
        return transaction.description.toLowerCase().includes('profit') ? TrendingUp : ArrowDown;
      case 'debit':
        return transaction.description.toLowerCase().includes('loss') ? TrendingDown : ArrowUp;
      default:
        return DollarSign;
    }
  };

  const getTransactionTypeColor = () => {
    switch (transaction.type) {
      case 'credit':
        return transaction.description.toLowerCase().includes('profit') ? 'text-green-400' : 'text-blue-400';
      case 'debit':
        return transaction.description.toLowerCase().includes('loss') ? 'text-red-400' : 'text-orange-400';
      default:
        return 'text-slate-400';
    }
  };

  const getTransactionTypeLabel = () => {
    if (transaction.description.toLowerCase().includes('profit')) return 'Trading Profit';
    if (transaction.description.toLowerCase().includes('loss')) return 'Trading Loss';
    if (transaction.description.toLowerCase().includes('deposit')) return 'Deposit';
    if (transaction.description.toLowerCase().includes('withdrawal')) return 'Withdrawal';
    return transaction.type === 'credit' ? 'Credit' : 'Debit';
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'denied':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const Icon = getTransactionTypeIcon();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ec1e8e78-e8e4-4f4d-a225-181630b1f3cd-ChatGPT_Image_Aug_28__2025__12_07_34_AM-removebg-preview.png" 
                alt="ApexFX" 
                className="h-10 w-auto" 
              />
              <div>
                <h1 className="text-2xl font-bold">ApexFX</h1>
                <p className="text-slate-300 text-sm">Cryptocurrency Trading Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Transaction Receipt</h2>
            <p className="text-slate-300">Receipt #{transaction.id}</p>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6">
          {/* Transaction Type and Amount */}
          <div className="text-center py-6 border-b border-slate-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Icon className={`w-8 h-8 ${getTransactionTypeColor()}`} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {getTransactionTypeLabel()}
            </h3>
            <div className="text-4xl font-bold text-slate-900">
              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-3 ${getStatusColor()}`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="font-medium text-slate-900">{formatDate(transaction.timestamp)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Time</p>
                  <p className="font-medium text-slate-900">{formatTime(transaction.timestamp)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Transaction ID</p>
                  <p className="font-medium text-slate-900 font-mono text-sm">{transaction.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="font-medium text-slate-900">{formatCurrency(transaction.amount)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Type</p>
                  <p className="font-medium text-slate-900 capitalize">{transaction.type}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="font-medium text-slate-900 capitalize">{transaction.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="font-semibold text-slate-900 mb-3">Description</h4>
            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border">
              {transaction.description}
            </p>
          </div>

          {/* Balance Impact */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-3">Balance Impact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Previous Balance</p>
                <p className="font-medium text-slate-900">
                  {formatCurrency(userBalance - (transaction.type === 'credit' ? transaction.amount : -transaction.amount))}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">New Balance</p>
                <p className="font-medium text-slate-900">{formatCurrency(userBalance)}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-slate-200">
            <p className="text-slate-600 mb-2">Thank you for using ApexFX</p>
            <p className="text-sm text-slate-500">
              For support, contact us at support@apexfx.com
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionReceiptModal;
