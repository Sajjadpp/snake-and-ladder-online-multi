import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../../ui/button';

const Header = ({ onBack }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border-b border-white/20">
      <Button
        onClick={onBack}
        variant="secondary"
        size="small"
      >
        <ArrowLeft size={16} className="text-white" />
      </Button>
      
      <h1 className="text-lg font-semibold text-white">Snake & Ladder</h1>
      
      {/* Spacer for balance */}
      <div className="w-10"></div>
    </div>
  );
};

export default Header;