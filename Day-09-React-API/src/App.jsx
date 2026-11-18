import { useEffect, useMemo, useState, useCallback } from 'react';
import { fetchProducts } from './services/api.js';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import SearchBar from './components/SearchBar.jsx';
import Filter from './components/Filter.jsx';
import ProductList from './components/ProductList.jsx';
import ProductModal from './components/ProductModal.jsx';
import Loader from './components/Loader.jsx';
import Footer from './components/Footer.jsx';

const PAGE_SIZE = 12;
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState(null);
  const [theme, setTheme] = useState(() => read('theme', 'light'));
  const [wishlist, setWishlist] = useState(() => read('wishlist', []));
  const [showWishlist, setShowWishlist] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Fetch products (re-runs when "Retry" bumps attempt)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchProducts()
      .then((data) => !cancelled && setProducts(data))
      .catch((err) => !cancelled && setError(err.message || 'Something went wrong'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [attempt]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => { setPage(1); }, [search, category, sort, showWishlist]);

  const pushToast = useCallback((text) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const toggleLike = useCallback((product) => {
    const has = wishlist.some((p) => p.id === product.id);
    setWishlist((list) => (has ? list.filter((p) => p.id !== product.id) : [...list, product]));
    pushToast(has ? `Removed “${product.title}”` : `Saved “${product.title}”`);
  }, [wishlist, pushToast]);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);

  const visible = useMemo(() => {
    let list = showWishlist ? wishlist : products;
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((p) => p.title.toLowerCase().includes(q));
    if (category !== 'all') list = list.filter((p) => p.category === category);
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'rating-desc') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [products, wishlist, showWishlist, search, category, sort]);

  const dirty = search !== '' || category !== 'all' || sort !== 'default';
  const reset = () => { setSearch(''); setCategory('all'); setSort('default'); };
  const closeModal = useCallback(() => setSelected(null), []);

  const pickCategory = (c) => {
    setCategory(c);
    setShowWishlist(false);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };
  const goTopRated = () => {
    setSort('rating-desc');
    setShowWishlist(false);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page">
      <Hero
        products={products}
        onOpen={setSelected}
        category={category}
        onPickCategory={pickCategory}
        navbar={
          <Navbar
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            wishlistCount={wishlist.length}
            showWishlist={showWishlist}
            onToggleWishlist={() => setShowWishlist((s) => !s)}
            onTopRated={goTopRated}
          />
        }
      />

      <main id="catalog">
        <section className="catalog-head">
          <h2>Browse the <em>Catalog</em></h2>
          <p>Search, filter and sort live results from the DummyJSON API. Nothing reloads, everything updates as you type.</p>
        </section>
        <SearchBar value={search} onChange={setSearch} />

        <Filter
          categories={categories}
          category={category}
          onCategory={setCategory}
          sort={sort}
          onSort={setSort}
          onReset={reset}
          dirty={dirty}
        />

        <section className="results">
          {!loading && !error && (
            <p className="result-count">
              {showWishlist ? 'Your wishlist: ' : ''}{visible.length} product{visible.length === 1 ? '' : 's'}
            </p>
          )}

          {loading && <Loader />}

          {error && (
            <div className="banner" role="alert">
              <div>
                <strong>Couldn’t load products.</strong>
                <span>{error}. Check your connection and try again.</span>
              </div>
              <button onClick={() => setAttempt((a) => a + 1)}>Retry</button>
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="empty">
              <div className="empty-art">∅</div>
              <h2>No products found</h2>
              <p>{showWishlist && !wishlist.length ? 'Tap the heart on any product to save it here.' : 'Try a different name or clear your filters.'}</p>
              <button className="cta" onClick={() => { reset(); setShowWishlist(false); }}>Reset filters</button>
            </div>
          )}

          {!loading && !error && visible.length > 0 && (
            <ProductList
              items={visible}
              page={page}
              pageSize={PAGE_SIZE}
              onPage={(n) => { setPage(n); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
              wishlist={wishlist}
              onToggleLike={toggleLike}
              onOpen={setSelected}
            />
          )}
        </section>
      </main>

      <Footer />

      {selected && (
        <ProductModal
          product={selected}
          liked={wishlist.some((w) => w.id === selected.id)}
          onToggleLike={toggleLike}
          onClose={closeModal}
        />
      )}

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className="toast">{t.text}</div>)}
      </div>
    </div>
  );
}
