from random import randint
import time
from oxygenio import Oxygenio

from savetube.video_downloader import VideoDownloader 

app = Oxygenio()
youtube = VideoDownloader()


@app.on
def search(data: dict[str, str]):
    try:
        youtube.load(url=data['url'])
        app.emit('search-response', youtube.metadata)
    except Exception as ex:
        print(ex)


@app.on
def download(resolution: int):
    try:
        youtube.download(
            resolution,
            on_complete=lambda: app.emit('progress', 100)
        )
    except Exception as ex:
        print(ex)


if(__name__=='__main__'):
    app.run(host='localhost', port=15999, browser='edge')