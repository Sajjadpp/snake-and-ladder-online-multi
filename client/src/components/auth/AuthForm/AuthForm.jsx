import React from 'react';
import InputField from '../InputField';
import Button from '../../ui/button';

const AuthForm = ({
  isUserFresh,
  formData,
  errors,
  isLoading,
  showPassword,
  showConfirmPassword,
  handleInputChange,
  handleSubmit,
  toggleUserType,
  setShowPassword,
  setShowConfirmPassword
}) => {
  return (
    <div className="space-y-3">
      {/* Username Field (only for new users) */}
      {isUserFresh && (
        <InputField
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(value) => handleInputChange('username', value)}
          error={errors.username}
          icon="user"
        />
      )}

      {/* Mobile Number Field */}
      <InputField
        type="tel"
        placeholder="Mobile Number"
        value={formData.mobile}
        onChange={(value) => handleInputChange('mobile', value)}
        error={errors.mobile}
        icon="phone"
      />

      {/* Password Field */}
      <InputField
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(value) => handleInputChange('password', value)}
        error={errors.password}
        icon="lock"
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      {/* Confirm Password Field (only for new users) */}
      {isUserFresh && (
        <InputField
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(value) => handleInputChange('confirmPassword', value)}
          error={errors.confirmPassword}
          icon="lock"
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full mt-4"
        size="large"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            {isUserFresh ? 'Creating...' : 'Logging in...'}
          </div>
        ) : (
          isUserFresh ? 'Create Account' : 'Login'
        )}
      </Button>

      {/* Toggle Between Login/Signup */}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={toggleUserType}
          className="text-white/80 hover:text-white text-xs transition-colors duration-200"
        >
          {isUserFresh 
            ? 'Already have an account? Login' 
            : "Don't have an account? Sign up"}
        </button>
      </div>

      {/* Forgot Password (only for existing users) */}
      {!isUserFresh && (
        <div className="text-center mt-3">
          <button className="text-white/60 hover:text-white/80 text-xs transition-opacity duration-200">
            Forgot Password?
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthForm;