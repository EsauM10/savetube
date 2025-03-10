type VideoResolution = {
  value: number;
  fileSize: number;
};

type VideoInfoDto = {
  thumbnailUrl: string;
  title: string;
  duration: string;
  downloadPath: string;
  resolutions: VideoResolution[];
};

export type { VideoInfoDto, VideoResolution };
