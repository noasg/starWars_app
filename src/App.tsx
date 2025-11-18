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
        <Route path="/" element={<PeoplePage />} />

        <Route path="/people/:id" element={<PeoplePage />} />

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
