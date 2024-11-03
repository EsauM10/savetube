import styles from "./styles.module.css";

interface ProgressBarProps {
  progressValue: number;
}

export default function ProgressBar({
  progressValue,
}: ProgressBarProps) {
  const getWidth = () => {
    return progressValue > 100 ? "100%" : `${progressValue}%`;
  };

  return (
    <div className={styles.container}>
      <div>
        <p>{progressValue}%</p>
      </div>

      <span style={{ width: getWidth() }}></span>
    </div>
  );
}
