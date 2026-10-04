"use client";
import React from 'react';
import { evaluatePasswordStrength } from '../../utils/passwordPolicy';

interface PasswordStrengthMeterProps {
  password?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  const { score, feedback, isStrongEnough } = evaluatePasswordStrength(password);
  
  // Score 0-4 mapping to colors
  const getScoreColor = () => {
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-orange-500';
    if (score === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getScoreLabel = () => {
    if (score <= 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 font-medium">Password Strength</span>
        <span className={`${isStrongEnough ? 'text-green-600' : 'text-red-500'} font-bold`}>
          {getScoreLabel()}
        </span>
      </div>
      
      <div className="flex space-x-1 h-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div 
            key={step} 
            className={`flex-1 rounded-full ${score >= step ? getScoreColor() : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {!isStrongEnough && feedback.length > 0 && (
        <ul className="text-xs text-red-500 space-y-1 mt-1 list-disc list-inside">
          {feedback.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
