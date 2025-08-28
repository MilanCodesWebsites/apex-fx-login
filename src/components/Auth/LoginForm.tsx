import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../UI/Button';
import Input from '../UI/Input';

const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
});


interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onAdminLogin: (email: string, password: string) => Promise<boolean>; // kept for compatibility, not used
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onAdminLogin, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await onLogin(data.email, data.password);
      if (success) {
        toast.success('Login successful!');
        const redirect = localStorage.getItem('apexfx_redirect_after_login');
        if (redirect) {
          localStorage.removeItem('apexfx_redirect_after_login');
          window.location.href = redirect;
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto relative">
      {/* Abstract green background accents */}
      <div className="pointer-events-none absolute -inset-x-10 -top-10 -bottom-10 opacity-40">
        <div className="absolute -top-6 -left-8 w-64 h-64 bg-neon-green/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 -right-10 w-72 h-72 bg-dark-green/20 blur-3xl rounded-full" />
      </div>
      <div className="relative bg-deep-black border border-slate-700 rounded-2xl shadow-2xl p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ec1e8e78-e8e4-4f4d-a225-181630b1f3cd-ChatGPT_Image_Aug_28__2025__12_07_34_AM-removebg-preview.png" alt="ApexFX" className="h-20" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-200">Sign in to continue trading</h2>
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
            <Input
              icon={Mail}
              placeholder="Enter your email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
            <div className="relative">
              <Input
                icon={Lock}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                {...register('password')}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-neon-green transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Row: remember + forgot */}
          <div className="flex items-center justify-between text-slate-300">
            <label className="flex items-center space-x-2 select-none">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800" />
              <span className="text-sm">Remember me</span>
            </label>
            <button type="button" className="text-blue-400 hover:text-blue-300 text-sm">Forgot your password?</button>
          </div>

          <Button type="submit" className="w-full" loading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* Switch to Register */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-neon-green hover:text-dark-green font-medium transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>

        {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-700/50 rounded-xl border border-slate-600">
            <p className="text-sm text-slate-300 mb-2">Demo Credentials:</p>
            <p className="text-xs text-slate-400">Email: any valid email</p>
            <p className="text-xs text-slate-400">Password: Any password (8+ characters)</p>
          </div>
      </div>
    </div>
  );
};

export default LoginForm;