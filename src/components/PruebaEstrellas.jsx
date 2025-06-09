import '@fortawesome/fontawesome-free/css/all.min.css';

export default function PruebaEstrellas() {
    return (
      <div className="p-4">
        <p>5 Estrellas:</p>
        <div className="text-yellow-500 text-2xl">
          {[...Array(4)].map((_, i) => (
            <i key={i} className="fas fa-star"></i>
          ))}
        </div>
      </div>
    );
  }