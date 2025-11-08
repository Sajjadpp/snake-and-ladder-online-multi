import React from 'react';
import { Eye, EyeOff, Phone, Lock, User } from 'lucide-react';

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  error,
  icon,
  showPassword,
  onTogglePassword
}) => {
  const getIconComponent = () => {
    switch (icon) {
      case 'phone':
        return <Phone size={16} className="text-gray-400" />;
      case 'lock':
        return <Lock size={16} className="text-gray-400" />;
      case 'user':
        return <User size={16} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const getInputType = () => {
    if (type === 'password' && showPassword) {
      return 'text';
    }
    return type;
  };

  const isPasswordField = type === 'password';

  return (
    <div>
      <div className="relative">
        {/* Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          {getIconComponent()}
        </div>

        {/* Input */}
        <input
          type={getInputType()}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-${isPasswordField ? '10' : '3'} py-3 bg-white/95 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
            error ? 'ring-2 ring-red-500' : ''
          }`}
        />

        {/* Password Toggle Button */}
        {isPasswordField && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff size={16} className="text-gray-400" />
            ) : (
              <Eye size={16} className="text-gray-400" />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-300 text-xs mt-1 ml-1">{error}</p>
      )}
    </div>
  );
};

export default InputField;