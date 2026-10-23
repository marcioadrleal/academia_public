import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout() {
  return (
    <div className="app-layout">

      

      <main className="app-content">
        <Header />
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}