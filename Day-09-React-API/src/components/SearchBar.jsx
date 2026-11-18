export default function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <span aria-hidden="true">⌕</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search phones, perfumes, sofas, sunglasses…"
        aria-label="Search products by name"
      />
      {value && (
        <button className="clear" onClick={() => onChange('')} aria-label="Clear search">✕</button>
      )}
    </div>
  );
}
