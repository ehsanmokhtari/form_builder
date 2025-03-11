import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LayoutGrid, FileText, Settings } from 'lucide-react';
import FormBuilder from './components/FormBuilder';
import FormResponses from './components/FormResponses';
import FormSettings from './components/FormSettings';
import FormResponsePage from './components/FormResponsePage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">FormBuilder</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Builder
                  </Link>
                  <Link
                    to="/responses"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Responses
                  </Link>
                  <Link
                    to="/settings"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <Link
                    to="/respond"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Respond
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<FormBuilder />} />
            <Route path="/responses" element={<FormResponses />} />
            <Route path="/settings" element={<FormSettings />} />
            <Route path="/respond" element={<FormResponsePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;