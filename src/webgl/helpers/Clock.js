/**
 * @class Create a global timer to manage animation
 * @author SolalDR http://solaldussout-revel.com
 * Based on THREE.Clock https://github.com/mrdoob/three.js/blob/master/src/core/Clock.js
 */
export default class Clock {


  /**
   * @constructor
   * @param  {boolean} autoStart If true, clock will start immediatly
   */
	constructor ( autoStart = true ) {
		this.autoStart = autoStart;
		this._start = 0;

		this.old = 0;
		this.running = false;
		this.elapsed = 0;
    this.delta = 0;

		if ( this.autoStart ) this.start();
	}


  /**
   * Start/Restart the timer
   */
	start () {
		this._start = Date.now();
		this.old = this._start;
		this.elapsed = 0;
		this.running = true;
	}


  /**
   * Pause the timer
   */
	stop () {
		this.running = false;
	}


  /**
   * Update timer from last time, you need to run this method on the render
   */
	update () {
		if( this.running ){
			var now = Date.now();
      this.delta = now - this.old;
			this.elapsed += this.delta;
			this.old = now;
		}
	}
}
