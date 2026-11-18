import axios from 'axios';

// All REST API logic lives here, away from the UI components.
const client = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

export async function fetchProducts() {
  const { data } = await client.get('/products', { params: { limit: 100 } });
  return data.products; // 100 records (task asks for 20 or more)
}
