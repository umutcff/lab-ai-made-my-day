import styles from "./Pagination.module.css";

// Prev / Next pagination controls.
export default function Pagination({ page, onPrev, onNext }) {
  return (
    <div className={styles.pagination}>
      <button
        onClick={onPrev}
        disabled={page === 1}
        className={`${styles.button} ${page === 1 ? styles.buttonDisabled : styles.buttonPrev}`}
      >
        Previous
      </button>

      <span className={styles.pageInfo}>Page {page}</span>

      <button onClick={onNext} className={`${styles.button} ${styles.buttonNext}`}>
        Next
      </button>
    </div>
  );
}
