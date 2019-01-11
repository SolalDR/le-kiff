import {Pass} from "@johh/three-effectcomposer"
import BokehShader from "../Shader/BokehShader";
import Viewport from "~/helpers/Viewport";
/**
 * Depth-of-field post-process with bokeh shader
 */
var BokehPass = function ( scene, camera, params ) {

	Pass.call( this );

	this.scene = scene;
	this.camera = camera;

  // Params
	this.focus = ( params.focus !== undefined ) ? params.focus : 1.0;
	this.aspect = ( params.aspect !== undefined ) ? params.aspect : camera.aspect;
	this.aperture = ( params.aperture !== undefined ) ? params.aperture : 0.025;
	this.maxblur = ( params.maxblur !== undefined ) ? params.maxblur : 1.0;

  // Render target
	this.renderTargetColor = new THREE.WebGLRenderTarget( Viewport.width, Viewport.height, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBFormat
  } );
  
	this.renderTargetColor.texture.name = "BokehPass.color";

	this.renderTargetDepth = this.renderTargetColor.clone();
	this.renderTargetDepth.texture.name = "BokehPass.depth";

	// depth material

	this.materialDepth = new THREE.MeshDepthMaterial();
	this.materialDepth.depthPacking = THREE.RGBADepthPacking;
	this.materialDepth.blending = THREE.NoBlending;

	// bokeh material

	if ( BokehShader === undefined ) {
		console.error( "BokehPass relies on BokehShader" );
	}

	var bokehShader = BokehShader;
	var bokehUniforms = THREE.UniformsUtils.clone( bokehShader.uniforms );

	bokehUniforms[ "tDepth" ].value = this.renderTargetDepth.texture;
	bokehUniforms[ "focus" ].value = this.focus;
	bokehUniforms[ "aspect" ].value = this.aspect;
	bokehUniforms[ "aperture" ].value = this.aperture;
	bokehUniforms[ "maxblur" ].value = this.maxblur;
	bokehUniforms[ "nearClip" ].value = camera.near;
	bokehUniforms[ "farClip" ].value = camera.far;

	this.materialBokeh = new THREE.ShaderMaterial( {
		defines: Object.assign( {}, bokehShader.defines ),
		uniforms: bokehUniforms,
		vertexShader: bokehShader.vertexShader,
		fragmentShader: bokehShader.fragmentShader
	} );

	this.uniforms = bokehUniforms;
	this.needsSwap = false;

	this.camera2 = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene2  = new THREE.Scene();

	this.quad2 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.quad2.frustumCulled = false; // Avoid getting clipped
	this.scene2.add( this.quad2 );

	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;

};

BokehPass.prototype = Object.assign( Object.create( Pass.prototype ), {

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		this.quad2.material = this.materialBokeh;

		// Render depth into texture

		this.scene.overrideMaterial = this.materialDepth;

		this.oldClearColor.copy( renderer.getClearColor() );
		this.oldClearAlpha = renderer.getClearAlpha();
		this.oldAutoClear = renderer.autoClear;
    
    renderer.autoClear = false;
		renderer.setClearColor( 0xffffff );
		renderer.setClearAlpha( 1.0 );
		renderer.render( this.scene, this.camera, this.renderTargetDepth, true );

		// Render bokeh composite

		this.uniforms[ "tColor" ].value = readBuffer.texture;
		this.uniforms[ "nearClip" ].value = this.camera.near;
		this.uniforms[ "farClip" ].value = this.camera.far;

		if ( this.renderToScreen ) {
			renderer.render( this.scene2, this.camera2 );
		} else {
			renderer.render( this.scene2, this.camera2, writeBuffer, this.clear );
		}

    // this.scene.overrideMaterial = null;
		renderer.setClearColor( this.oldClearColor );
		renderer.setClearAlpha( this.oldClearAlpha );
		renderer.autoClear = this.oldAutoClear;
	}

} );

export default BokehPass;
