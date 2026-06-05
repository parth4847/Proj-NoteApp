import axios from 'axios';

// configure the default settings for all api requests
const API = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api',
});


export const noteAPI = {
  draftWithAI: (topic) => API.post('/notes/draft', { topic }),
  // Update this line to pass the expiresIn parameter:
  create: (content, expiresIn) => API.post('/notes', { content, expiresIn }), 
  unlock: (id, password) => API.post(`/notes/${id}/unlock`, { password }),
  summarize: (id) => API.post(`/notes/${id}/summarize`),
};

export default API;