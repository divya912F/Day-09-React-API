import { useEffect, useMemo, useState } from 'react';

function useCountUp(target, ms = 1100) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!target) return;
    let raf, start;
    const tick = (t) => {
      start = start ?? t;
      const p = Math.min((t - start) / ms, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return n;
}

const tilt = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  e.currentTarget.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-3px)`;
};
const untilt = (e) => { e.currentTarget.style.transform = ''; };

export default function Hero({ products, onOpen, category, onPickCategory, navbar }) {
  const [idx, setIdx] = useState(0);
  const [hot, setHot] = useState(null);
  const ready = products.length > 0;

  const featured = ready ? products[idx % products.length] : null;
  const top = useMemo(() => (ready ? products.reduce((a, b) => (b.rating > a.rating ? b : a)) : null), [products, ready]);
  const avgRating = useMemo(() => (ready ? products.reduce((s, p) => s + p.rating, 0) / products.length : 0), [products, ready]);

  const cats = useMemo(() => {
    const map = {};
    products.forEach((p) => { (map[p.category] ??= []).push(p.price); });
    return Object.entries(map).map(([name, prices]) => ({
      name, count: prices.length, avg: prices.reduce((a, b) => a + b, 0) / prices.length,
    }));
  }, [products]);

  const bestCats = [...cats].sort((a, b) => b.count - a.count).slice(0, 4);
  const spark = cats.slice(0, 14);
  const W = 300, H = 130;
  const max = Math.max(...spark.map((c) => c.avg), 1);
  const pts = spark.map((c, i) => [10 + (i * (W - 20)) / Math.max(spark.length - 1, 1), H - 12 - (c.avg / max) * (H - 34)]);
  const path = pts.length
    ? pts.reduce((d, p, i) => {
        if (i === 0) return `M${p[0]},${p[1]}`;
        const q = pts[i - 1];
        const mx = (p[0] + q[0]) / 2;
        return `${d} C${mx},${q[1]} ${mx},${p[1]} ${p[0]},${p[1]}`;
      }, '')
    : '';

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    let best = 0;
    pts.forEach((p, i) => { if (Math.abs(p[0] - x) < Math.abs(pts[best][0] - x)) best = i; });
    setHot(best);
  };

  const total = useCountUp(products.length);
  const hotCat = hot !== null ? spark[hot] : null;

  return (
    <section className="hero-panel" id="top">
      {navbar}

      <div className="hero-grid">
        <div className="hero-left">
          <h1>Find Your<br />Favourite</h1>
          <p>Browse 100 products from beauty to furniture. Search by name, filter by category and save the ones you love.</p>
          <a className="orange-btn big" href="#catalog">Browse products</a>

          <div className="shoppers">
            <div className="avatars">
              {products.slice(idx % 90, (idx % 90) + 4).map((p) => <img key={p.id} src={p.thumbnail} alt="" />)}
              <button className="shuffle" onClick={() => setIdx(Math.floor(Math.random() * Math.max(products.length, 1)))} aria-label="Shuffle featured product">⟳</button>
            </div>
            <h3>Fresh picks, every click</h3>
            <p>Tap the orange button to shuffle the featured product.</p>
          </div>
        </div>

        <div className="bento">
          <article className="b-card cream feat" onMouseMove={tilt} onMouseLeave={untilt} onClick={() => featured && onOpen(featured)}>
            <span className="b-icon">★</span><span className="b-arrow">↗</span>
            <h3>{featured ? featured.title : 'Loading…'}</h3>
            <p>{featured ? `${featured.category.replace(/-/g, ' ')} · $${featured.price.toFixed(2)}` : 'Fetching featured product'}</p>
          </article>

          <article className="b-card charcoal top" onMouseMove={tilt} onMouseLeave={untilt} onClick={() => top && onOpen(top)}>
            {top && <img src={top.thumbnail} alt={top.title} />}
            <div className="top-text">
              <span className="b-arrow">↗</span>
              <h3>Top rated pick</h3>
              <p>{top ? `${top.title} · ${top.rating.toFixed(2)} ★` : 'Finding the best product'}</p>
            </div>
          </article>

          <article className="b-card cream stat" onMouseMove={tilt} onMouseLeave={untilt}>
            <span className="burst" aria-hidden="true" />
            <strong>{total}+</strong>
            <p>Products ready to explore across {cats.length || '–'} categories</p>
          </article>

          <article className="b-card orange spark">
            <h3>Average price by category</h3>
            <span className="sparkle" aria-hidden="true">✦</span>
            {ready && (
              <svg viewBox={`0 0 ${W} ${H}`} onMouseMove={onMove} onMouseLeave={() => setHot(null)} role="img" aria-label="Average price per category">
                <path d={path} fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                {hot !== null && <><line x1={pts[hot][0]} x2={pts[hot][0]} y1="0" y2={H} stroke="#fff" strokeOpacity=".35" /><circle cx={pts[hot][0]} cy={pts[hot][1]} r="6" fill="#fff" /></>}
              </svg>
            )}
            <p className="spark-note">{hotCat ? `${hotCat.name.replace(/-/g, ' ')} · $${hotCat.avg.toFixed(0)} avg` : 'Hover the line to explore'}</p>
          </article>

          <div className="badge-ring" aria-label={`Average rating ${avgRating.toFixed(1)}`}>
            <svg viewBox="0 0 120 120" className="spin">
              <defs><path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
              <text><textPath href="#circ">Average rating ★ Average rating ★ Average rating ★</textPath></text>
            </svg>
            <b>{avgRating ? avgRating.toFixed(1) : '–'}</b>
          </div>

          <div className="best" id="categories">
            <h3>Our Best Categories</h3>
            <div className="pills">
              {bestCats.map((c) => (
                <button key={c.name} className={`pill ${category === c.name ? 'on' : ''}`} onClick={() => onPickCategory(c.name)}>
                  {c.name.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
