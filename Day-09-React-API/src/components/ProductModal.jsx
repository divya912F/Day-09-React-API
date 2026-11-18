import { useEffect, useState } from 'react';
import { Stars } from './ProductCard.jsx';

export default function ProductModal({ product, liked, onToggleLike, onClose }) {
  const [img, setImg] = useState(product.thumbnail);

  useEffect(() => {
    setImg(product.thumbnail);
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  const old = product.price / (1 - product.discountPercentage / 100);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={product.title} onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-media">
          <img className="hero-img" src={img} alt={product.title} />
          <div className="thumbs">
            {[product.thumbnail, ...(product.images || [])].slice(0, 5).map((src, i) => (
              <button key={i} className={src === img ? 'on' : ''} onClick={() => setImg(src)}>
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="modal-info">
          <span className="cat">{product.category.replace(/-/g, ' ')}</span>
          <h2>{product.title}</h2>
          <Stars rating={product.rating} />
          <p className="desc">{product.description}</p>
          <div className="price-row">
            <strong className="price big">${product.price.toFixed(2)}</strong>
            <s>${old.toFixed(2)}</s>
          </div>
          <ul className="facts">
            {product.brand && <li><span>Brand</span>{product.brand}</li>}
            <li><span>Stock</span>{product.stock > 0 ? `${product.stock} left` : 'Out of stock'}</li>
            <li><span>Shipping</span>{product.shippingInformation || 'Ships soon'}</li>
            <li><span>Returns</span>{product.returnPolicy || '30 days'}</li>
          </ul>
          <button className={`cta ${liked ? 'liked' : ''}`} onClick={() => onToggleLike(product)}>
            {liked ? '♥ Saved to wishlist' : '♡ Add to wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
}
