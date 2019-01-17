
/**
 * @author SolalDR / https://solaldussout-revel.fr/
 */

class VideoLoader  {

	load( url, onLoad, onProgress, onError ) {
    const video = document.createElement('video');
    video.src = url;

    video.addEventListener('loadeddata', () => {
      onLoad(video)
    });
	}

};

export default VideoLoader;
