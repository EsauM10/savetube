import styles from "./styles.module.css";

interface ProgressBarProps {
  downloadPath: string;
  progressValue: number;
}

export default function ProgressBar({
  downloadPath,
  progressValue,
}: ProgressBarProps) {
  const getWidth = () => {
    return progressValue > 100 ? "100%" : `${progressValue}%`;
  };

  return (
    <div className={styles.container}>
      <div>
        <p>{downloadPath}</p>
        <span>{progressValue}%</span>
      </div>

      <span style={{ width: getWidth() }}></span>
    </div>
  );
}
