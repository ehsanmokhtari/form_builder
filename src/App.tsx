import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormBuilder from "./components/FormBuilder";
import FormResponses from "./components/FormResponses";
import FormSettings from "./components/FormSettings";
import FormResponsePage from "./components/FormResponsePage";
import Navigation from "./components/Navigation";

function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Navigation />
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
