import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { RequireAuth } from "@/components/RequireAuth";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { CartProvider } from "@/context/CartContext";
import { AdminGate, AdminLayout } from "@/components/admin/AdminShell";
import { HomePage } from "@/pages/HomePage";
import { ShopPage } from "@/pages/ShopPage";
import { ProductPage } from "@/pages/ProductPage";
import { OffersPage } from "@/pages/OffersPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { LoginPage } from "@/pages/LoginPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { OrderDetailPage } from "@/pages/OrderDetailPage";
import { AccountPage } from "@/pages/AccountPage";
import { PrescriptionPage } from "@/pages/PrescriptionPage";
import { EnquiryPage } from "@/pages/EnquiryPage";
import { ContactPage } from "@/pages/ContactPage";
import { AboutPage } from "@/pages/AboutPage";
import { PoliciesPage } from "@/pages/PoliciesPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AdminOverview } from "@/pages/admin/AdminOverview";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminOffer } from "@/pages/admin/AdminOffer";
import { AdminEnquiries } from "@/pages/admin/AdminEnquiries";
import { AdminMessages } from "@/pages/admin/AdminMessages";
import { AdminAdmins } from "@/pages/admin/AdminAdmins";
import { AdminSettings } from "@/pages/admin/AdminSettings";

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CatalogProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="category/:slug" element={<CategoryRedirect />} />
                  <Route path="product/:slug" element={<ProductPage />} />
                  <Route path="offers" element={<OffersPage />} />
                  <Route path="offers/:slug" element={<OffersPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
                  <Route path="orders/:id" element={<RequireAuth><OrderDetailPage /></RequireAuth>} />
                  <Route path="track" element={<Navigate to="/orders" replace />} />
                  <Route path="account" element={<RequireAuth><AccountPage /></RequireAuth>} />
                  <Route path="prescription" element={<PrescriptionPage />} />
                  <Route path="enquiry" element={<EnquiryPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="privacy" element={<PoliciesPage kind="privacy" />} />
                  <Route path="terms" element={<PoliciesPage kind="terms" />} />
                  <Route path="shipping" element={<PoliciesPage kind="shipping" />} />
                  <Route path="returns" element={<PoliciesPage kind="returns" />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                <Route path="admin" element={<AdminGate />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminOverview />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="offer" element={<AdminOffer />} />
                    <Route path="enquiries" element={<AdminEnquiries />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="admins" element={<AdminAdmins />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </CatalogProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

function CategoryRedirect() {
  return <Navigate to="/shop" replace />;
}
