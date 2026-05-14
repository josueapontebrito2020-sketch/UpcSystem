const API_URL = "/api";
const API_KEY = "Tuclave123";

const headers = () => ({
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
  ...(localStorage.getItem("token") && {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }),
});

const apiClient = {
  get:    (url)       => fetch(`${API_URL}/${url}`, { headers: headers() }).then(r => r.json()),
  post:   (url, body) => fetch(`${API_URL}/${url}`, { method: "POST",   headers: headers(), body: JSON.stringify(body) }).then(r => r.json()),
  put:    (url, body) => fetch(`${API_URL}/${url}`, { method: "PUT",    headers: headers(), body: JSON.stringify(body) }).then(r => r.json()),
  patch:  (url, body) => fetch(`${API_URL}/${url}`, { method: "PATCH",  headers: headers(), body: JSON.stringify(body) }).then(r => r.json()), 
  delete: (url)       => fetch(`${API_URL}/${url}`, { method: "DELETE", headers: headers() }).then(r => r.json()),
};

export default apiClient;