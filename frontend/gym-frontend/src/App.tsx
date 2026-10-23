import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { Home } from "./pages/Home";
import HomeLogged from "./pages/HomeLogged";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/register/Register";
import { RegisterSuccess } from "./pages/register/RegisterSuccess";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { PublicRoute } from "./components/routes/PublicRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { NewAnalysis } from "./pages/analysis/NewAnalysis";
import { MyAnalyses } from "./pages/analysis/MyAnalyses";
import { Profile } from "./pages/profile/Profile";


function AppRoutes() {

  const location =
    useLocation();

  return (

    <Routes
      key={location.key}
      location={location}
    >

      {/* Usuário NÃO autenticado */}

      <Route
        element={
          <PublicRoute />
        }
      >

        <Route
          element={
            <MainLayout />
          }
        >

          <Route
            path="/"
            element={
              <Home />
            }
          />

        </Route>


        <Route
          path="/login"
          element={
            <Login />
          }
        />


        <Route
          path="/cadastro"
          element={
            <Register />
          }
        />


        <Route
          path="/cadastro/sucesso"
          element={
            <RegisterSuccess />
          }
        />

      </Route>


      {/* Usuário autenticado */}

      <Route
        element={
          <ProtectedRoute />
        }
      >

        <Route
          path="/home"
          element={
            <HomeLogged />
          }
        />


        <Route
          path="/analise/nova"
          element={
            <NewAnalysis />
          }
        />


        <Route
          path="/analises"
          element={
            <MyAnalyses />
          }
        />


        <Route
          path="/perfil"
          element={
            <Profile />
          }
        />

      </Route>

    </Routes>
  );
}


function App() {

  return (

    <BrowserRouter>

      <AppRoutes />

    </BrowserRouter>

  );
}

export default App;