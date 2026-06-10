import { Navigate } from "react-router-dom";

function RoleRoute({
  children,
  role,
}) {

  const user = JSON.parse(
    localStorage.getItem(
      "user"
    )
  );

  if (
    !user ||
    user.role !== role
  ) {
    return (
      <Navigate to="/" />
    );
  }

  return children;
}

export default RoleRoute;