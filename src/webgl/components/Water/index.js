import GPUComputationRenderer from "~/webgl/rendering/GPUComputationRenderer.js"
import fragment from "./fragment.glsl";
import vertex from "./vertex.glsl";
import smoothFragment from "./smoothFragment.glsl";
import SimplexNoise from "simplex-noise";
var waterShader = { fragment, vertex, smoothFragment };

class Water {
  constructor(args = {}){
    this.config = {
      width: 64, 
      bounds: 15, 
      boundsHalf: 16,
      effects: {
        mouseSize: 0.1, 
        viscosity: 0.0000001
      },
      color: new THREE.Color("rgb(45, 82, 20)")
    }
    this.renderer = args.renderer; 
    this.heightmap = null;
    this.mesh = null;
    this.noise = new SimplexNoise();
    this.enqueueDrops = [];
    this.needUpdate = true; 
    this.init();
    this.initGpuRenderer();
  }

  toggle(){
    var value = this.material.uniforms.testNormal.value; 
    this.material.uniforms.testNormal.value = (value == 1) ? 0 : 1;
  }

  init(){
    this.geometry = new THREE.PlaneBufferGeometry( 
      this.config.bounds,
      this.config.bounds,
      this.config.width - 1,
      this.config.width - 1
    );

    this.geometry = new THREE.BoxBufferGeometry(
      this.config.bounds, 
      10,
      this.config.bounds,
      this.config.width - 1, 
      this.config.width - 1,
      this.config.width - 1
    );

    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge( [
        THREE.ShaderLib[ 'phong' ].uniforms, 
        { 
          heightmap: { value: null },  
          testNormal: {value: 1., type: "f" }
        }
      ]),
      side: THREE.DoubleSide,
      transparent: true,
      vertexShader: waterShader.vertex,
      fragmentShader: THREE.ShaderChunk[ 'meshphong_frag' ]
    });

    this.material.lights = true;

    // Material attributes from MeshPhongMaterial
    this.material.color = new THREE.Color( this.config.color );
    this.material.specular = new THREE.Color( 0xFFFFFF );
    this.material.shininess = 100;
    this.material.transparent = true;
    this.material.opacity = 0.7;


    // Sets the uniforms with the material values
    this.material.uniforms.diffuse.value = this.material.color;
    this.material.uniforms.specular.value = this.material.specular;
    this.material.uniforms.shininess.value = Math.max( this.material.shininess, 1e-4 );
    this.material.uniforms.opacity.value = 0.7;

    this.material.defines.WIDTH = this.config.width.toFixed( 1 );
    this.material.defines.BOUNDS = this.config.bounds.toFixed( 1 );

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.mesh.rotation.x = -Math.PI/2;
    // this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
    this.mesh.name = "Water";

  }

  initGpuRenderer(){
    this.computationRenderer = new GPUComputationRenderer( this.config.width, this.config.width, this.renderer );
    var heightmap0 = this.computationRenderer.createTexture();

    this.fillTexture( heightmap0, false );

    this.heightmapVariable = this.computationRenderer.addVariable( "heightmap", waterShader.fragment, heightmap0 );

    this.computationRenderer.setVariableDependencies( this.heightmapVariable, [ this.heightmapVariable ] );

    this.heightmapVariable.material.uniforms.mousePos = { value: new THREE.Vector2( 10000, 10000 ) };
    this.heightmapVariable.material.uniforms.mouseSize = { value: 3 };
    this.heightmapVariable.material.uniforms.viscosityConstant = { value: 0.00001 };
    this.heightmapVariable.material.uniforms.gravityConstant = { value: 3 };
    this.heightmapVariable.material.defines.BOUNDS = this.config.bounds.toFixed( 1 );

    var error = this.computationRenderer.init();
    if ( error !== null ) {
        console.error( error );
    }

    
    this.heightmapVariable.material.uniforms.mousePos.value.set( 0, 0 ); 
    this.heightmapVariable.material.uniforms.mouseSize.value = 2;

    this.mesh.material.uniforms.heightmap.value = this.computationRenderer.getCurrentRenderTarget( this.heightmapVariable ).texture; 
    this.computationRenderer.compute(); 

    this.heightmapVariable.material.uniforms.mousePos.value.set( 10000, 10000 );

    for(var i=0; i<2000; i++){
      this.computationRenderer.getCurrentRenderTarget( this.heightmapVariable ); 
      this.computationRenderer.compute();   
    }
  }

  fillTexture(texture, noised = true){
    var waterMaxHeight = 20;
    var noiseT = this.noise;
    
    function noise( x, y, z ) {
      var multR = waterMaxHeight;
      var mult = 0.025;
      var r = 0;
      for ( var i = 0; i < 15; i++ ) {
        r += multR * noiseT.noise( x * mult, y * mult );
        multR *= 0.53 + 0.025 * i;
        mult *= 1.25;
      }
      return r;
    }

    var pixels = texture.image.data;

    var p = 0;
    for ( var j = 0; j < this.config.width; j++ ) {
      for ( var i = 0; i < this.config.width; i++ ) {

        var x = i * 128 / this.config.width;
        var y = j * 128 / this.config.width;

        pixels[ p + 0 ] = noised ? noise( x, y, 123.4 ) : 0;
        pixels[ p + 1 ] = 0;
        pixels[ p + 2 ] = 0;
        pixels[ p + 3 ] = 1;

        p += 4;
      }
    }
  }

  onConfigChange(){
    this.heightmap.material.uniforms.mouseSize.value = this.config.effects.mouseSize;
    this.heightmap.material.uniforms.viscosityConstant.value = this.config.effects.viscosity;
  }

  drop(x, y, size = 0.3){
    this.enqueueDrops.push([x, y, size]);
  }

  multipleDrop(array){
    array.forEach(item => {
      item[0] = Math.random()*20 - 10;
      item[1] = Math.random()*20 - 10;
      item[2] = Math.random()*2;
      this.drop(item[0], item[1], item[2]);
    })
  }

  render(){
    if( this.needUpdate ){

        if( this.enqueueDrops.length ){
          this.mouseMoved = true;
          this.heightmapVariable.material.uniforms.mousePos.value.set( this.enqueueDrops[0][0], this.enqueueDrops[0][1] ); 
          this.heightmapVariable.material.uniforms.mouseSize.value =  this.enqueueDrops[0][2] ; 
          this.enqueueDrops.shift();
        }
        
        this.mesh.material.uniforms.heightmap.value = this.computationRenderer.getCurrentRenderTarget( this.heightmapVariable ).texture; 
        this.computationRenderer.compute(); 

        if( this.mouseMoved ){
          this.heightmapVariable.material.uniforms.mousePos.value.set( 100000, 100000 );
          this.mouseMoved = false;
        }
        this.needUpdate = false;
    } else {
      this.needUpdate = true;
    }
  }
}


export default Water;
