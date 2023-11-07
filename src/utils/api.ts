import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.3.48:3001'
  // baseURL: 'http://10.90.35.124:3001'
});
