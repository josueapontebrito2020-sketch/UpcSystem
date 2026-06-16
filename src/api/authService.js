import apiClient from "./apiClient"; 

export const login = async (email, password) => {
  const data = await apiClient.post("auth/login", { email, password });

  if (!data.token) throw new Error(data.mensaje || "Error al iniciar sesión");

  const usuario = { 
    id: data.user?.id,           // ← CAMBIADO: lee de data.user
    nombre: data.user?.nombre,
    apellido: data.user?.apellido,
    email: data.user?.email,
    role: data.user?.role,
    telefono: data.user?.telefono,
    ciudad: data.user?.ciudad,
    token: data.token
  };

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(usuario));
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