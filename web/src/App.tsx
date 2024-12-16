import "./App.css";
import { useState } from "react";
import TextInput from "./components/TextInput";
import { initOxygen, invoke } from "oxygenio";
import VideoInfo from "./components/VideoInfo";
import { VideoInfoDto } from "./entities";

initOxygen()

function App() {
  const [videoData, setVideoData] = useState<VideoInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSearch = (url: string) => {
    setVideoData(null);
    setIsLoading(true);

    invoke<VideoInfoDto>("search", url)
    .then(res => setVideoData(res))
    .finally(() => setIsLoading(false));
  };

  return (
    <div className="home">
      <i className="ph ph-youtube-logo"></i>

      <header>
        <TextInput onSearch={handleOnSearch} />
      </header>

      <main>
        {isLoading ? <div className="loader" /> : null}
        {videoData ? <VideoInfo data={videoData} /> : null}
      </main>
    </div>
  );
}

export default App;
