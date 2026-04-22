import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import ProductsList from "./pages/ProductsList";
import AddEditProduct from "./pages/AddEditProduct";
import ReviewAgent from "./pages/ReviewAgent";
import BulkEdit from "./pages/BulkEdit";
import ProfileManager from "./pages/ProfileManager";

import Banners from "./pages/Banners";
import AddBanner from "./pages/AddBanner";
import EditBanner from "./pages/EditBanner";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* LOGIN PAGE */}
          <Route path="/login" element={<Login />} />

          {/* DASHBOARD */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* PRODUCTS */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddEditProduct mode="add" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute>
                <AddEditProduct mode="edit" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/review-agent"
            element={
              <ProtectedRoute>
                <ReviewAgent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bulk-edit"
            element={
              <ProtectedRoute>
                <BulkEdit />
              </ProtectedRoute>
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileManager />
              </ProtectedRoute>
            }
          />

          {/* BANNERS ROUTES */}
          <Route
            path="/banners"
            element={
              <ProtectedRoute>
                <Banners />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-banner"
            element={
              <ProtectedRoute>
                <AddBanner />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-banner/:id"
            element={
              <ProtectedRoute>
                <EditBanner />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
