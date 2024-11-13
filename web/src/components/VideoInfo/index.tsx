import styles from "./styles.module.css";
import ResolutionSelector from "../ResolutionSelector";
import { VideoInfoDto, VideoResolution } from "../../entities";
import { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar";
import { socket } from "../../hooks/useOxygen";

interface VideoInfoProps {
  data: VideoInfoDto;
}

export default function VideoInfoCard({ data }: VideoInfoProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [resolution, setResolution] = useState<VideoResolution>(data.resolutions[0]);
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleOnDownload = () => {
    setIsDownloading(true);
    socket.emit("download", resolution.value);
  };

  const handleOnChange = (resolutionValue: number) => {
    const selectedOption = data.resolutions.find(
      (item) => item.value === resolutionValue,
    );

    if (selectedOption) {
      setResolution(selectedOption);
    }
  };

  useEffect(() => {
    function onDownloadProgress(value: number) {
      setDownloadProgress(value)
    }

    socket.on("progress", onDownloadProgress);

    return () => {
      socket.off("progress", onDownloadProgress);
    };
  }, []);

  return (
    <div className={styles.container}>
      <img src={data.thumbnailUrl} alt="video thumbnail" />

      <section>
        <div>
          <h1 className="line-clamp">{data.title}</h1>
          <h3>
            <i className="ph ph-timer"></i>
            {data.duration}
          </h3>
          <h3>
            <i className="ph ph-video-camera"></i>
            {resolution.fileSize} MB
          </h3>
        </div>

        {isDownloading ? (
          <ProgressBar downloadPath={data.downloadPath} progressValue={downloadProgress} />
        ) : (
          <ResolutionSelector
            selected={resolution}
            resolutions={data.resolutions}
            onChange={handleOnChange}
            onDownload={handleOnDownload}
          />
        )}
      </section>
    </div>
  );
}
