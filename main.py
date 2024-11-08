from random import randint
from threading import Thread

from oxygenio import Oxygenio

from savetube.video_downloader import VideoDownloader 

app = Oxygenio()
youtube = VideoDownloader()

def download_video(resolution: int):
    youtube.download(resolution)
    app.emit('progress', 100)


@app.on
def search(data: dict[str, str]):
    try:
        youtube.load(url=data['url'])
        app.emit('search-response', youtube.metadata)
    except Exception as ex:
        print(ex)


@app.on
def download(resolution: int):
    app.emit('progress', randint(5, 50))
    Thread(target=download_video, args=[resolution]).start()



if(__name__=='__main__'):
    app.run(host='localhost', port=15999, browser='edge')