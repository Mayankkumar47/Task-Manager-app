import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"

const PrivateRoute = ({ allowedRoles }) => {
  const { currentUser } = useSelector((state) => state.user)

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return currentUser.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/user/dashboard" replace />
  }

  return <Outlet />
}

export default PrivateRoute
