import React from 'react';

// Components
import PageLayout from '../components/layout/PageLayout';
import Header from '../components/auth/Header';
import WelcomeSection from '../components/auth/WelcomeSection';
import AuthForm from '../components/auth/AuthForm';

// Hooks
import { useAuthForm } from '../hooks/useAuthForm';
import { useToast } from '../contexts';

const AuthPage = () => {
  const toast = useToast()
  const authForm = useAuthForm(toast);

  return (
    <PageLayout background="bg-gray-600">
      <Header onBack={authForm.handleBack} />
      
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm">
          <WelcomeSection isUserFresh={authForm.isUserFresh} />
          <AuthForm {...authForm} />
        </div>
      </div>
    </PageLayout>
  );
};

export default AuthPage;