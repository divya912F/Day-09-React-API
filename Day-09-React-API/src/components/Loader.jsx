export function Spinner({ label = 'Loading products…' }) {
  return (
    <div className="spinner-wrap" role="status">
      <span className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div className="card skeleton" key={i}>
          <div className="sk-img" />
          <div className="sk-line w60" />
          <div className="sk-line" />
          <div className="sk-line w40" />
        </div>
      ))}
    </div>
  );
}

export default function Loader() {
  return (
    <>
      <Spinner />
      <SkeletonGrid />
    </>
  );
}
