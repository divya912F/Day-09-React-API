export default function Navbar({ theme, onToggleTheme, wishlistCount, showWishlist, onToggleWishlist, onTopRated }) {
  return (
    <header className="navbar">
      <a className="brand" href="#top" aria-label="Shelfie home">
        <span className="brand-mark" aria-hidden="true" />
        SHELFIE
      </a>
      <nav className="nav-links" aria-label="Main">
        <a href="#catalog">Shop</a>
        <a href="#categories">Categories</a>
        <button onClick={onTopRated}>Top rated</button>
        <button onClick={onToggleTheme} aria-label="Switch theme">{theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
      </nav>
      <button className={`orange-btn ${showWishlist ? 'active' : ''}`} onClick={onToggleWishlist} aria-pressed={showWishlist}>
        ♥ Wishlist · {wishlistCount}
      </button>
    </header>
  );
}
