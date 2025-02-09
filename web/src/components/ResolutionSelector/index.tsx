import { VideoResolution } from "../../entities";
import styles from "./styles.module.css";

interface ResolutionSelectorProps {
  selected: VideoResolution;
  resolutions: VideoResolution[];
  onChange: (value: number) => void;
  onDownload: VoidFunction;
}

export default function ResolutionSelector({
  selected,
  resolutions,
  onChange,
  onDownload,
}: ResolutionSelectorProps) {
  return (
    <div className={styles.container}>
      <button onClick={onDownload}>
        <i className="ph ph-download-simple" />
      </button>

      <select
        value={selected.value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {resolutions.map((item, index) => (
          <option value={item.value} key={index}>
            MP4 {item.value}p
          </option>
        ))}
      </select>
    </div>
  );
}
