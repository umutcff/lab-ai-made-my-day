"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { POKE_API, PAGE_SIZE } from "./lib/pokeapi";
import PokemonCard from "./components/PokemonCard";
import PokemonDetail from "./components/PokemonDetail";
import Pagination from "./components/Pagination";
import styles from "./page.module.css";

function Pokedex() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state page -> URL
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.replace(`?${currentParams.toString()}`);
  }, [page, router, searchParams]);

  // Fetch a page of Pokémon every time the page number changes.
  useEffect(() => {
    async function loadPokemon() {
      setLoading(true);
      setError(null);

      try {
        const offset = (page - 1) * PAGE_SIZE;
        const res = await fetch(`${POKE_API}?limit=${PAGE_SIZE}&offset=${offset}`);

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        setPokemon(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, [page]);

  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pokédex</h1>
        <p className={styles.subtitle}>Click on a Pokémon to see its details.</p>
      </header>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Filter current page..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {error && (
        <div className={styles.errorBox}>
          <strong>Oops! We couldn&apos;t load the Pokémon.</strong>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}

      {!error && (
        <>
          <div className={styles.grid}>
            {loading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className={styles.skeletonCard}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonId} />
                    <div className={styles.skeletonName} />
                  </div>
                ))
              : filteredPokemon.map((p) => (
                  <PokemonCard key={p.name} pokemon={p} onSelect={setSelected} />
                ))}
          </div>

          <Pagination
            page={page}
            onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setPage((prev) => prev + 1)}
          />
        </>
      )}

      {selected && (
        <PokemonDetail pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className={styles.message}>Loading...</div>}>
      <Pokedex />
    </Suspense>
  );
}
