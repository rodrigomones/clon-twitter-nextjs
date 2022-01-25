import styles from "../../styles/Button.module.css";

export default function Button({ children, onClick, disabled }) {
  return (
    <>
      <button className={styles.Button} disabled={disabled} onClick={onClick}>
        {children}
      </button>
      <style jsx>{`
        button {
          user-select: none;
        }
        button[disabled] {
          pointer-events: none;
          opacity: 0.2;
        }
      `}</style>
    </>
  );
}
