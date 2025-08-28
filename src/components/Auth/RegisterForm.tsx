import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Lock, Eye, EyeOff, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../UI/Button';
import Input from '../UI/Input';

const registerSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

interface RegisterFormProps {
  onRegister: (data: any) => Promise<boolean>;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const passwordValue = watch('password') as string | undefined;

  const passwordScore = useMemo(() => {
    const value = passwordValue || '';
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score += 1;
    if (value.length >= 12) score += 1;
    return score; // 0-5
  }, [passwordValue]);

  const strengthMeta = useMemo(() => {
    switch (passwordScore) {
      case 0:
      case 1:
        return { label: 'Very weak', color: 'bg-red-500', textColor: 'text-red-400', width: 'w-1/5' };
      case 2:
        return { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-400', width: 'w-2/5' };
      case 3:
        return { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-400', width: 'w-3/5' };
      case 4:
        return { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-400', width: 'w-4/5' };
      default:
        return { label: 'Very strong', color: 'bg-emerald-500', textColor: 'text-emerald-400', width: 'w-full' };
    }
  }, [passwordScore]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await onRegister(data);
      if (success) {
        toast.success('Account created successfully!');
        // Redirect to onboarding page after successful registration
        window.location.href = '/onboarding';
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
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
      <div className="relative bg-rich-black border border-slate-700 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ec1e8e78-e8e4-4f4d-a225-181630b1f3cd-ChatGPT_Image_Aug_28__2025__12_07_34_AM-removebg-preview.png" alt="ApexFX" className="h-20" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join ApexFX</h1>
          <p className="text-slate-400">Create your trading account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              icon={User}
              placeholder="First name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              icon={User}
              placeholder="Last name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
          
          <Input
            icon={Mail}
            placeholder="Enter your email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          
          <div className="relative">
            <Input
              icon={Lock}
              placeholder="Create password"
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

          {/* Password strength meter */}
          <div className="space-y-2">
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full ${strengthMeta.color} ${strengthMeta.width} transition-all duration-300`} />
            </div>
            {passwordValue && (
              <p className={`text-xs ${strengthMeta.textColor}`}>Password strength: {strengthMeta.label}</p>
            )}
          </div>

          <div className="relative">
            <Input
              icon={Lock}
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-neon-green transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button type="submit" className="w-full" loading={isLoading}>
            Create Account
          </Button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-neon-green hover:text-dark-green font-medium transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Terms */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-xl border border-slate-600">
          <p className="text-xs text-slate-400 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;