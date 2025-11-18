import ProtectedRoute from "./components/atoms/ProtectedRoute/ProtectedRoute";
import Header from "./components/molecules/Header/Header";
import FavoritePage from "./components/pages/FavoritePage";
import PeoplePage from "./components/pages/PeoplePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Main page */}
        <Route path="/" element={<PeoplePage />} />

        {/* Modal route */}
        <Route path="/people/:id" element={<PeoplePage />} />

        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <FavoritePage />
            </ProtectedRoute>
          }
        />

        {/* Placeholder for future protected routes */}
        {/* <Route path="/favourites" element={<FavouritesPage />} /> */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
