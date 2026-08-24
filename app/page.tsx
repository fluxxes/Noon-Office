'use client';
import React, { useState } from 'react';
import CustomerPortal from '../app/CustomerPortal';
import FrontDeskDashboard from '../app/FrontDeskDashboard';
import TranslatorDashboard from '../app/TranslatorDashboard';
import ManagerDashboard from '../app/ManagerDashboard';

interface User {
  username: string;
  role: string;
  name: string;
}

export default function NoonOfficeApp() {
  // MOCK DATABASE: Holds all active and historical orders
  const [globalOrders, setGlobalOrders] = useState<any[]>([]);

  const employeeAccounts = [
    { username: 'manager', password: '123', role: 'manager', name: 'Manager' },
    {
      username: 'front1',
      password: '123',
      role: 'frontdesk',
      name: 'Employee 1',
    },
    {
      username: 'front2',
      password: '123',
      role: 'frontdesk',
      name: 'Employee 2',
    },
    {
      username: 'trans1',
      password: '123',
      role: 'translator',
      name: 'Translator 1',
    },
    {
      username: 'trans2',
      password: '123',
      role: 'translator',
      name: 'Translator 2',
    },
  ];

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const user = (form.elements.namedItem('username') as HTMLInputElement)
      .value;
    const pass = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    const account = employeeAccounts.find(
      (acc) => acc.username === user && acc.password === pass
    );

    if (account) {
      setCurrentUser({
        username: account.username,
        role: account.role,
        name: account.name,
      });
      setShowLogin(false);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleNewOrderSubmit = (newOrder: any) => {
    setGlobalOrders([...globalOrders, newOrder]);
  };

  if (showLogin && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border-t-4 border-red-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Staff Portal</h2>
            <p className="text-gray-500">Authorized personnel only.</p>
          </div>
          {loginError && (
            <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm font-semibold">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Username
              </label>
              <input
                name="username"
                type="text"
                className="w-full border rounded p-2 focus:border-red-800 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="w-full border rounded p-2 focus:border-red-800 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-800 text-white font-bold py-3 rounded hover:bg-red-900 transition"
            >
              Login
            </button>
          </form>
          <button
            onClick={() => setShowLogin(false)}
            className="w-full text-center text-sm text-gray-500 mt-4 hover:text-gray-800 font-semibold"
          >
            Cancel and return to public site
          </button>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <header className="bg-red-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-red-900 text-xs">
              NO
            </div>
            <span className="font-bold text-yellow-500 tracking-wider">
              NOON OFFICE{' '}
              <span className="text-white font-normal">| Secure System</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>
              Welcome,{' '}
              <span className="font-bold text-yellow-500">
                {currentUser.name}
              </span>
            </span>
            <button
              onClick={() => setCurrentUser(null)}
              className="bg-white text-red-900 px-3 py-1 rounded font-bold hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </header>
        <div className="flex-1">
          {currentUser.role === 'manager' && (
            <ManagerDashboard
              globalOrders={globalOrders}
              setGlobalOrders={setGlobalOrders}
              currentUser={currentUser}
            />
          )}
          {currentUser.role === 'frontdesk' && (
            <FrontDeskDashboard
              globalOrders={globalOrders}
              setGlobalOrders={setGlobalOrders}
              currentUser={currentUser}
            />
          )}
          {currentUser.role === 'translator' && (
            <TranslatorDashboard
              globalOrders={globalOrders}
              setGlobalOrders={setGlobalOrders}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <CustomerPortal
      onOpenLogin={() => setShowLogin(true)}
      onSubmitOrder={handleNewOrderSubmit}
    />
  );
}
