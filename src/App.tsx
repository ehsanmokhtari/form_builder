import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { LayoutGrid, FileText, Settings } from "lucide-react";
import FormBuilder from "./components/FormBuilder";
import FormResponses from "./components/FormResponses";
import FormSettings from "./components/FormSettings";
import FormResponsePage from "./components/FormResponsePage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <nav className="bg-white shadow-lg border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    FormBuilder
                  </h1>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Builder
                  </Link>
                  <Link
                    to="/responses"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors duration-200"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Responses
                  </Link>
                  <Link
                    to="/settings"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <Link
                    to="/respond"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors duration-200"
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
