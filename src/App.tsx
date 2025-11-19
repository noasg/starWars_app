import ProtectedRoute from "./components/utils/ProtectedRoute";
import Header from "./components/molecules/Header/Header";
import FavoritePage from "./components/pages/FavoritePage";
import PeoplePage from "./components/pages/PeoplePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      {/* Persistent header visible on all pages */}
      <Header />

      {/* App routing */}
      <Routes>
        {/* Home page shows list of characters */}
        <Route path="/" element={<PeoplePage />} />

        {/* Modal route: display character modal on top of PeoplePage */}
        <Route path="/people/:id" element={<PeoplePage />} />

        {/* Protected favorites page: only accessible if logged in */}
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <FavoritePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
