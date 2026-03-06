import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, CustomersPage, OrdersPage, AboutTestPage } from '@/pages';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/orders/:customerId" element={<OrdersPage />} />
        <Route path="/about" element={<AboutTestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
