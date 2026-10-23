import {
  Navigate,
  Outlet,
} from "react-router-dom";

export function PublicRoute() {

  const accessToken =
    sessionStorage.getItem(
      "access_token",
    );

  if (accessToken) {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return <Outlet />;
}