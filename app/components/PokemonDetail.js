"use client";

import { useEffect, useState } from "react";
import { getPokemonId, getPokemonImage } from "../lib/pokeapi";
import styles from "./PokemonDetail.module.css";

// Expanded "detail card" shown on top of the page when a Pokémon is clicked.
// It fetches the full details (types, stats, height, weight) for that Pokémon.
export default function PokemonDetail({ pokemon, onClose }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    async function loadDetails() {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      setDetails(data);
    }
    loadDetails();
  }, [pokemon]);

  const id = getPokemonId(pokemon.url);
  const paddedId = String(id).padStart(3, "0");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <img
          src={getPokemonImage(id)}
          alt={pokemon.name}
          className={styles.image}
        />

        <h2 className={styles.title}>{pokemon.name}</h2>
        <p className={styles.id}>#{paddedId}</p>

        {!details ? (
          <div className={`${styles.detailsContainer} ${styles.skeleton}`}>
            <div className={styles.skeletonTypes}>
              <div className={styles.skeletonType} />
              <div className={styles.skeletonType} />
            </div>
            <div className={styles.skeletonText} />
            <div className={styles.skeletonText} />
            <h3 className={styles.statsTitle}>Base stats</h3>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeletonStatRow}>
                <div className={styles.skeletonStatName} />
                <div className={styles.skeletonStatValue} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.detailsContainer}>
            <div className={styles.typesContainer}>
              {details.types.map((t) => {
                const typeClass = styles[`type-${t.type.name}`] || styles["type-normal"];
                return (
                  <span
                    key={t.type.name}
                    className={`${styles.typeBadge} ${typeClass}`}
                  >
                    {t.type.name}
                  </span>
                );
              })}
            </div>

            <p className={styles.infoRow}>
              <strong>Height:</strong> {details.height / 10} m
            </p>
            <p className={styles.infoRow}>
              <strong>Weight:</strong> {details.weight / 10} kg
            </p>

            <h3 className={styles.statsTitle}>Base stats</h3>
            {details.stats.map((s) => (
              <div key={s.stat.name} className={styles.statRow}>
                <span className={styles.statName}>{s.stat.name}</span>
                <span className={styles.statValue}>{s.base_stat}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
