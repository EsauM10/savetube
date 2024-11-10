from random import randint

from oxygenio import Oxygenio
from savetube import VideoDownloader 

app = Oxygenio()
youtube = VideoDownloader()

def download_video(resolution: int):
    youtube.download(resolution)
    app.emit('progress', 100)


@app.on
def search(url: str):
    youtube.load(url)
    app.emit('search-response', youtube.metadata)


@app.on
def download(resolution: int):
    app.emit('progress', randint(5, 50))
    app.websocket.start_background_task(
        download_video,
        resolution
    )


if(__name__=='__main__'):
    app.run(host='localhost', port=15999, browser='edge')