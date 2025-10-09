import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "admin-lte/dist/css/adminlte.css";
import $ from 'jquery'                         
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'admin-lte/dist/js/adminlte.js'
import 'admin-lte';

window.$ = window.jQuery = $

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
