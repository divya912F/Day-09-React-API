import ProductCard from './ProductCard.jsx';

export default function ProductList({ items, page, pageSize, onPage, wishlist, onToggleLike, onOpen }) {
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const slice = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <div className="grid">
        {slice.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            liked={wishlist.some((w) => w.id === p.id)}
            onToggleLike={onToggleLike}
            onOpen={onOpen}
          />
        ))}
      </div>

      {pages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          <button disabled={page === 1} onClick={() => onPage(page - 1)}>‹ Prev</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} className={n === page ? 'on' : ''} onClick={() => onPage(n)} aria-current={n === page}>
              {n}
            </button>
          ))}
          <button disabled={page === pages} onClick={() => onPage(page + 1)}>Next ›</button>
        </nav>
      )}
    </>
  );
}
