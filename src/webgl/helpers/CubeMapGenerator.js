

/**
* @author Richard M. / https://github.com/richardmonette
* @author WestLangley / http://github.com/WestLangley
*/

var CubemapGenerator = function ( renderer ) {
	this.renderer = renderer;
};

CubemapGenerator.prototype.fromEquirectangular = function ( texture, options ) {

	var scene = new THREE.Scene();

	var shader = {

		uniforms: {
			tEquirect: { value: null },
		},

		vertexShader:

			`
			varying vec3 vWorldDirection;

			//include <common>
			vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

				return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

			}

			void main() {

				vWorldDirection = transformDirection( position, modelMatrix );

				#include <begin_vertex>
				#include <project_vertex>

			}
			`,

		fragmentShader:

			`
			uniform sampler2D tEquirect;

			varying vec3 vWorldDirection;

			//include <common>
			#define RECIPROCAL_PI 0.31830988618
			#define RECIPROCAL_PI2 0.15915494

			void main() {

				vec3 direction = normalize( vWorldDirection );

				vec2 sampleUV;

				sampleUV.y = asin( clamp( direction.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;

				sampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;

				gl_FragColor = texture2D( tEquirect, sampleUV );

			}
			`
	};

	var material = new THREE.ShaderMaterial( {

		type: 'CubemapFromEquirect',

		uniforms: THREE.UniformsUtils.clone( shader.uniforms ),
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
		side: THREE.BackSide,
		blending: THREE.NoBlending

	} );

	material.uniforms.tEquirect.value = texture;

	var mesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 5, 5, 5 ), material );

	scene.add( mesh );

	var resolution = options.resolution || 512;

	var params = {
		type: texture.type,
		format: texture.format,
		encoding: texture.encoding,
		generateMipmaps: ( options.generateMipmaps !== undefined ) ?  options.generateMipmaps : texture.generateMipmaps,
		minFilter: ( options.minFilter !== undefined ) ?  options.minFilter : texture.minFilter,
		magFilter: ( options.magFilter !== undefined ) ?  options.magFilter : texture.magFilter
	};

	var camera = new THREE.CubeCamera( 1, 10, resolution, params );

	camera.update( this.renderer, scene );

	mesh.geometry.dispose();
	mesh.material.dispose();

	return camera.renderTarget;

};


export default CubemapGenerator; 
