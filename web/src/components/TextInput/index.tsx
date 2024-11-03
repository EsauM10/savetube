import styles from "./styles.module.css";
import { useState } from "react";

interface TextInputProps {
  onSearch: (url: string) => void;
}

export default function TextInput({ onSearch }: TextInputProps) {
  const [url, setUrl] = useState("");

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Cole um link para baixar um vídeo"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={() => onSearch(url)}>
        <i className="ph ph-magnifying-glass"></i>
      </button>
    </div>
  );
}
