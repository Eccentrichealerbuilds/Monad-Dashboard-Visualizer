import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { BlocksPage } from './components/blocks/BlocksPage';
import { TransactionsPage } from './components/transactions/TransactionsPage';
export function App() {
  return <BrowserRouter>
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/blocks" element={<BlocksPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>;
}