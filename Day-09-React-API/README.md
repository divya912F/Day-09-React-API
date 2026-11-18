# Shelfie – Product Catalog Dashboard

Apex Lark Full Stack Development Internship · Day 9: React Hooks (`useState`, `useEffect`) and REST API integration.

Shelfie lists 100 products from the [DummyJSON](https://dummyjson.com/products) API in a dark hero + cream bento-card interface. The hero cards use live API data: a shuffle-able featured product, the top-rated pick, an animated product counter, a hoverable price-by-category chart and one-click category pills.

## Run locally
```bash
npm install
npm run dev
```

## Project structure
```
Day-09-React-API/
├── public/
├── src/
│   ├── components/   Navbar, Hero, SearchBar, Filter, ProductList, ProductCard,
│   │                 ProductModal, Loader (spinner + skeleton), Footer
│   ├── services/api.js   axios instance + fetchProducts()
│   ├── styles/style.css
│   ├── App.jsx       state, effects and filtering logic
│   └── main.jsx
├── package.json
└── README.md
```

## How the hooks are used
| Hook | Where | Purpose |
|------|-------|---------|
| `useEffect` | `App.jsx` | Fetch products on mount; Retry re-runs it |
| `useEffect` | `App.jsx` | Sync theme and wishlist to `localStorage` |
| `useEffect` | `ProductModal.jsx` | Esc key, scroll lock |
| `useState` | `App.jsx` | products, loading, error, search, category, sort, page, modal, theme, wishlist, toasts |
| `useMemo` | `App.jsx` | Derive categories and the filtered, sorted list |

## Features
- Real-time name search, category chips, price sort (low/high), rating sort, Reset filters
- Loading spinner, skeleton cards, "No Products Found" empty state, API error banner with Retry
- Enhancements (6): Dark/Light mode, Pagination, localStorage Wishlist, Skeleton loader, Toast notifications, Responsive grid

## Screenshots
Add your screenshots to a `screenshots/` folder and link them here:
- `screenshots/home-light.png`
- `screenshots/home-dark.png`
- `screenshots/product-modal.png`
- `screenshots/mobile.png`
