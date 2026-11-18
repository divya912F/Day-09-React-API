const SORTS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top rated' },
];

export default function Filter({ categories, category, onCategory, sort, onSort, onReset, dirty }) {
  return (
    <section className="filters" aria-label="Filters">
      <div className="chips" role="tablist">
        {['all', ...categories].map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            className={`chip ${category === c ? 'on' : ''}`}
            onClick={() => onCategory(c)}
          >
            {c === 'all' ? 'All' : c.replace(/-/g, ' ')}
          </button>
        ))}
      </div>
      <div className="sort-row">
        <label>
          Sort by
          <select value={sort} onChange={(e) => onSort(e.target.value)}>
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <button className="link-btn" onClick={onReset} disabled={!dirty}>Reset filters</button>
      </div>
    </section>
  );
}
