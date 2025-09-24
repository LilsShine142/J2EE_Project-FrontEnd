import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Header Client</h1>
      </div>
    </header>
  );
};

export default Header;