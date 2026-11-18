export function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="stars" aria-label={`${rating} out of 5`}>
      {'★'.repeat(full)}<span className="dim">{'★'.repeat(5 - full)}</span>
      <b>{rating.toFixed(1)}</b>
    </span>
  );
}

export default function ProductCard({ product, liked, onToggleLike, onOpen }) {
  const { title, category, price, rating, thumbnail, discountPercentage } = product;
  return (
    <article className="card">
      <div className="card-img" onClick={() => onOpen(product)}>
        <img src={thumbnail} alt={title} loading="lazy" />
        {discountPercentage > 10 && <span className="badge">-{Math.round(discountPercentage)}%</span>}
        <button
          className={`heart ${liked ? 'on' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleLike(product); }}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={liked}
        >♥</button>
      </div>
      <div className="card-body">
        <span className="cat">{category.replace(/-/g, ' ')}</span>
        <h3 title={title}>{title}</h3>
        <Stars rating={rating} />
        <div className="card-foot">
          <strong className="price">${price.toFixed(2)}</strong>
          <button className="mini-btn" onClick={() => onOpen(product)}aria-label="View details">↗</button>
        </div>
      </div>
    </article>
  );
}
