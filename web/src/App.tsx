import "./App.css";
import { useEffect, useState } from "react";
import TextInput from "./components/TextInput";
import { socket } from "./hooks/useOxygen";
import VideoInfo from "./components/VideoInfo";
import { VideoInfoDto } from "./entities";

function App() {
  const [videoData, setVideoData] = useState<VideoInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSearch = (url: string) => {
    setVideoData(null);
    socket.emit("search", { url });
    setIsLoading(true);
  };

  useEffect(() => {
    function onSearchResponse(data: VideoInfoDto) {
      setIsLoading(false);
      setVideoData(data);
    }

    socket.on("search-response", onSearchResponse);

    return () => {
      socket.off("search-response", onSearchResponse);
    };
  }, []);

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
