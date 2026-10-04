import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { fallbackProducts } from './App'
import { ProductsProvider } from './ProductsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProductsProvider fallback={fallbackProducts}>
      <App />
    </ProductsProvider>
  </React.StrictMode>,
)