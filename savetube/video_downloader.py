import os
from pathlib import Path
import tempfile
from typing import Any, Callable

from pytubefix import YouTube, Stream
from oxygenio.helpers import run_command

OnProgressCallback = Callable[[Stream, bytes, int], None]
OnCompleteCallback = Callable[[], None]

DOWNLOAD_PATH = os.path.join(Path.home(), 'Downloads')

def clear_symbols(filename: str) -> str:
    for char in ['\\', '/', ':', '*', '"', '?', '<', '>', '|']:
        filename = filename.replace(char, "")
    return filename
    


class VideoDownloader:
    def __init__(self, output_path: str = DOWNLOAD_PATH) -> None:
        self.youtube: YouTube | None = None
        self.output_path = output_path
        self.__resolutions: dict[int, Stream] | None = None

    @property
    def formatted_duration(self):
        if(not self.youtube):
            raise RuntimeError('Youtube object was not initialized')
          
        duration_in_seconds = self.youtube.length
        hours = duration_in_seconds // 3600
        minutes = (duration_in_seconds % 3600) // 60
        seconds = duration_in_seconds % 60
        return f'{int(hours):02}:{int(minutes):02}:{int(seconds):02}'

    @property
    def metadata(self) -> dict[str, Any]:
        if(not self.youtube):
            raise RuntimeError('Youtube object was not initialized')

        data = [
            {'value': resolution, 'fileSize': self.__get_final_filesize(stream)}
            for resolution, stream in self.resolutions.items()
        ]

        resolutions = sorted(data, key=lambda item: item['value'])
        
        return {
            'thumbnailUrl': self.youtube.thumbnail_url,
            'title': self.youtube.title,
            'duration': self.formatted_duration,
            'resolutions': resolutions
        }
    
    @property
    def resolutions(self) -> dict[int, Stream]:
        if(not self.youtube):
            raise RuntimeError('Youtube object was not initialized')
        
        if(not self.__resolutions):
            streams = self.youtube.streams.filter(mime_type='video/mp4', adaptive=True)
            self.__resolutions = {
                int(stream.resolution[0:-1]): stream
                for stream in streams
            }

        return self.__resolutions
    

    def __get_final_filesize(self, video_stream: Stream) -> float:
        if(not self.youtube):
            raise RuntimeError('Youtube object was not initialized')
        
        audio_stream = self.youtube.streams.get_audio_only()
        
        if(audio_stream):
            return round(video_stream.filesize_mb + audio_stream.filesize_mb, 2)
        
        return video_stream.filesize_mb
    

    def __download_video(self, resolution: int, output_path: str, filename: str):
        stream = self.resolutions[resolution]
        stream.download(output_path, filename)

    def __download_audio(self, output_path: str, filename: str):
        if(not self.youtube):
            raise RuntimeError('Youtube object was not initialized')
        
        audio_stream = self.youtube.streams.get_audio_only()
        
        if(audio_stream):
            audio_stream.download(output_path, filename)
    
    def __merge_streams(self, audio_path: str, video_path: str):
        if(not self.youtube):
            raise RuntimeError('Youtube object was not initialized')
        
        title = f'{self.youtube.title}.mp4'
        output_path = os.path.join(self.output_path, clear_symbols(title))

        run_command([
            'ffmpeg', 
            '-i', audio_path, '-i', video_path,
            '-c:a', 'copy', '-c:v', 'h264', 
            output_path
        ])
        

    def download(self, resolution: int):
        tempdir = tempfile.TemporaryDirectory()

        audio_filename = 'audio.mp4'
        video_filename = 'video.mp4'
        audio_path = os.path.join(tempdir.name, audio_filename)
        video_path = os.path.join(tempdir.name, video_filename)

        stream = self.resolutions[resolution]
        self.__download_video(resolution, tempdir.name, filename=video_filename)

        if(not stream.is_progressive):
            self.__download_audio(tempdir.name, filename=audio_filename)
            self.__merge_streams(audio_path, video_path)

        tempdir.cleanup()


    def load(self, url: str, on_progress: OnProgressCallback | None = None):
        self.__resolutions = None
        self.youtube = YouTube(
            url=url,
            on_progress_callback=on_progress,
        )

