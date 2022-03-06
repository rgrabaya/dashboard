import axios from 'axios';

const http = axios.create({
  baseURL: 'https://my-json-server.typicode.com/karolkproexe/jsonplaceholderdb',
  headers: { 'Content-type': 'application/json' },
});

export default http;
