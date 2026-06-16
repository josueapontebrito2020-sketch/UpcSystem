const API_URL = "/api";          
const API_KEY = "Tuclave123";    

const headers = () => ({                           
  "Content-Type": "application/json",              // Le dice a la API que los datos vienen en formato JSON
  "x-api-key": API_KEY,                            // Envía la clave que valida el ApiKeyMiddleware.cs
  ...(localStorage.getItem("token") && {           // Si hay token guardado en localStorage (usuario logueado)...
    Authorization: `Bearer ${localStorage.getItem("token")}`, // ...lo agrega como encabezado de autorización
  }),
});

const apiClient = {
  get:    (url)       => fetch(`${API_URL}/${url}`, { headers: headers() }).then(r => r.json()),                               // GET → solo envía encabezados, sin body
  post:   (url, body) => fetch(`${API_URL}/${url}`, { method: "POST",   headers: headers(), body: JSON.stringify(body) }).then(r => r.json()), // POST → envía datos en el body
  put:    (url, body) => fetch(`${API_URL}/${url}`, { method: "PUT",    headers: headers(), body: JSON.stringify(body) }).then(r => r.json()), // PUT → reemplaza un recurso completo
  patch:  (url, body) => fetch(`${API_URL}/${url}`, { method: "PATCH",  headers: headers(), body: JSON.stringify(body) }).then(r => r.json()), // PATCH → actualiza solo un campo (ej: estado de reparación)
  delete: (url)       => fetch(`${API_URL}/${url}`, { method: "DELETE", headers: headers() }).then(r => r.json()),             // DELETE → elimina un recurso
};

export default apiClient; 