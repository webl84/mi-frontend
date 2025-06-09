import '@fortawesome/fontawesome-free/css/all.min.css';

export default function EstrellasPromedio({ rating }) {
  const estrellas = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      estrellas.push(<i key={i} className="fas fa-star"></i>);
    } else if (rating >= i - 0.5) {
      estrellas.push(<i key={i} className="fas fa-star-half-alt"></i>);
    } else {
      estrellas.push(<i key={i} className="far fa-star"></i>);
    }
  }

  return <div className="text-yellow-500 text-xl flex gap-1">{estrellas}</div>;
}
