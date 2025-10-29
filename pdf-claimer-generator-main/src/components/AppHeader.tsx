
import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-6 flex justify-center items-center animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-medium mb-2">Генератор возражений</h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
          Автоматическое создание документа возражения на исполнительную надпись нотариуса
        </p>
      </div>
    </header>
  );
};

export default AppHeader;
