import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// funzione di debounce generica
function debounce(callback, delay) {
  let timer; // inizializzato a 0
  return (value) => {
    clearTimeout(timer); // azzero nuovamente il timer
    timer = setTimeout(() => {
      callback(value);
    }, delay);
  };
};

export default function App() {
  const url = "http://localhost:3333/products";

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  // chiamata prodotti cercati
  const apiCall = async (query) => {
    await axios.get(`${url}?search=${query}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))

    console.log("Effettuo la chiamata API");
  };

  const debouncedApiCall = useCallback(debounce(apiCall, 500), []);

  useEffect(() => {
    debouncedApiCall(query);
  }, [query])

  return (
    <>
      <h1>Lista prodotti</h1>

      <div className="container">
        <input
          type="text"
          placeholder="Cerca un prodotto..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {query.trim() !== "" && (

          <ul>
            {
              products.map(p => (
                <li key={p.id}>
                  <figure>
                    <img src={p.image} alt={`Image of ${p.name}`} />
                  </figure>

                  <div className="product-text">
                    <h3>{p.name}</h3>
                    <span>{p.price} €</span>
                  </div>
                </li>
              ))
            }
          </ul>

        )}
      </div>
    </>
  )
}