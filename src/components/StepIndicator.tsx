
import React from 'react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute h-0.5 bg-muted left-0 right-0 top-1/2 transform -translate-y-1/2 z-0"></div>
        <div 
          className="absolute h-0.5 bg-primary left-0 top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-in-out z-0"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {/* Step circles */}
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10">
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out",
                index < currentStep 
                  ? "bg-primary text-primary-foreground" 
                  : index === currentStep 
                    ? "bg-primary text-primary-foreground animate-pulse-slow" 
                    : "bg-muted text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className={cn(
              "mt-2 text-xs font-medium transition-colors duration-300",
              index <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
