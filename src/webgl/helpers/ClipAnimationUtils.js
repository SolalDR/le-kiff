class ClipAnimationUtils {
  subclip( sourceClip, name, startFrame, endFrame, fps ) {

    fps = fps || 30;

    var clip = this.cloneClip(sourceClip);
    
    clip.name = name;

    var tracks = [];

    for ( var i = 0; i < clip.tracks.length; ++ i ) {

      var track = clip.tracks[ i ];
      var valueSize = track.getValueSize();

      var times = [];
      var values = [];

      for ( var j = 0; j < track.times.length; ++ j ) {

        var frame = track.times[ j ] * fps;

        if ( frame < startFrame || frame >= endFrame ) continue;

        times.push( track.times[ j ] );

        for ( var k = 0; k < valueSize; ++ k ) {

          values.push( track.values[ j * valueSize + k ] );

        }

      }

      if ( times.length === 0 ) continue;

      track.times = THREE.AnimationUtils.convertArray( times, track.times.constructor );
      track.values = THREE.AnimationUtils.convertArray( values, track.values.constructor );

      tracks.push( track );

    }

    clip.tracks = tracks;

    // find minimum .times value across all tracks in the trimmed clip

    var minStartTime = Infinity;

    for ( var i = 0; i < clip.tracks.length; ++ i ) {

      if ( minStartTime > clip.tracks[ i ].times[ 0 ] ) {

        minStartTime = clip.tracks[ i ].times[ 0 ];

      }

    }

    // shift all tracks such that clip begins at t=0

    for ( var i = 0; i < clip.tracks.length; ++ i ) {

      clip.tracks[ i ].shift( -1 * minStartTime );

    }

    clip.resetDuration();

    return clip;

  }
  cloneClip(clip) {
    var tracks = [];

    for ( var i = 0; i < clip.tracks.length; i ++ ) {

      tracks.push(  this.cloneTrack( clip.tracks[ i ] ) );

    }

    return new THREE.AnimationClip( clip.name, clip.duration, tracks );
  }
  cloneTrack(track) {
		var times = THREE.AnimationUtils.arraySlice( track.times, 0 );
		var values = THREE.AnimationUtils.arraySlice( track.values, 0 );

 		var TypedKeyframeTrack = track.constructor;
		var newTrack = new TypedKeyframeTrack( track.name, times, values );

 		// Interpolant argument to constructor is not saved, so copy the factory method directly.
     newTrack.createInterpolant = track.createInterpolant;

 		return newTrack;
  }
}

export default new ClipAnimationUtils();
