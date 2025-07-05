import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, LogIn, UserPlus } from 'lucide-react';
import logo from '@/assets/logo.png'

const AppLoginPage: React.FC = () => {
  const { login, register } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-8 rounded-lg">
              <img 
                  src={logo}
                  alt="Geometer Logo"
                  className="h-10 w-auto"
              />
          </div>
          <CardTitle className="text-md font-bold text-gray-900">Welcome to Tasky</CardTitle>
          <CardDescription>
            Secure login powered by AWS Identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={login}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white"
            size="lg"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In with AWS Identity
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <Button 
            onClick={register}
            variant="outline" 
            className="w-full border-primary-200 text-primary-600 hover:bg-primary-50"
            size="lg"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create New Account
          </Button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppLoginPage;