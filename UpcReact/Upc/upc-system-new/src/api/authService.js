import apiClient from "./apiClient"; // Importa el cliente HTTP que lleva la x-api-key en cada petición

export const login = async (email, password) => {
  const data = await apiClient.post("auth/login", { email, password }); // POST api/auth/login → envía email y password a la API

  if (!data.token) throw new Error(data.mensaje || "Error al iniciar sesión"); // Si la API no devuelve token significa que el login falló → lanza el error para que Login.jsx lo muestre

  const usuario = { // Construye el objeto usuario con la respuesta de la API
    id: data.Id ?? data.id,                   // ?? = maneja que la API a veces devuelve mayúscula y a veces minúscula
    nombre: data.Nombre ?? data.nombre,
    apellido: data.Apellido ?? data.apellido,
    email: data.Email ?? data.email,
    role: data.Role ?? data.role,             // El rol decide si va a /owner o /user en Login.jsx
    telefono: data.Telefono ?? data.telefono,
    ciudad: data.Ciudad ?? data.ciudad,
    token: data.token
  };

  localStorage.setItem("token", data.token);            // Guarda el token para que apiClient.js lo incluya en las siguientes peticiones
  localStorage.setItem("user", JSON.stringify(usuario)); // Guarda el usuario para que los dashboards lean el nombre, rol, id, etc.
  return usuario; // Lo devuelve a Login.jsx para que lea el rol y redirija
};

export const register = (nombre, apellido, email, password, telefono, ciudad) =>
  apiClient.post("auth/register", { nombre, apellido, email, password, telefono, ciudad }); // POST api/auth/register → crea el usuario en la BD (Register.jsx no usa esta función, llama directo a apiClient)

export const logout = () => {
  localStorage.removeItem("token"); // Borra el token del localStorage
  localStorage.removeItem("user");  // Borra los datos del usuario del localStorage
}; // Esta función existe pero los dashboards llaman a localStorage.removeItem directamente en su propio handleLogout

export const isAuthenticated = () => !!localStorage.getItem("token"); // Devuelve true si hay token guardado, false si no hay → sirve para proteger rutas

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null; // Devuelve el objeto usuario o null si no hay sesión activa
};