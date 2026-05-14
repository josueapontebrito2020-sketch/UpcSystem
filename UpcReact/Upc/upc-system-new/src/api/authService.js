import apiClient from "./apiClient";

export const login = async (email, password) => {
  const data = await apiClient.post("auth/login", { email, password });

  if (!data.token) throw new Error(data.mensaje || "Error al iniciar sesión");

  const usuario = {
    id: data.Id ?? data.id,
    nombre: data.Nombre ?? data.nombre,
    apellido: data.Apellido ?? data.apellido,
    email: data.Email ?? data.email,
    role: data.Role ?? data.role,
    telefono: data.Telefono ?? data.telefono,
    ciudad: data.Ciudad ?? data.ciudad,
    token: data.token
  };

  localStorage.setItem("token", data.token);           // para apiClient
  localStorage.setItem("user", JSON.stringify(usuario)); // para el resto de la app
  return usuario;
};

export const register = (nombre, apellido, email, password, telefono, ciudad) =>
  apiClient.post("auth/register", { nombre, apellido, email, password, telefono, ciudad });

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => !!localStorage.getItem("token");

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};