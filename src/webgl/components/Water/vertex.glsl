uniform sampler2D heightmap;
uniform float testNormal;

#define PHONG

varying vec3 vViewPosition;

#ifndef FLAT_SHADED

  varying vec3 vNormal;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

  vec2 cellSize = vec2( 1.0 / WIDTH, 1.0 / WIDTH );

  #include <uv_vertex>
  // PERFORMANCE // #include <uv2_vertex>
  // PERFORMANCE // #include <color_vertex>

  // # include <beginnormal_vertex>
  
  // Compute normal from heightmap
  
  vec3 objectNormal = vec3(0.);


  objectNormal = vec3(
    ( texture2D( heightmap, uv + vec2( - cellSize.x, 0 ) ).x - texture2D( heightmap, uv + vec2( cellSize.x, 0 ) ).x ) * WIDTH / BOUNDS,
    ( texture2D( heightmap, uv + vec2( 0, - cellSize.y ) ).x - texture2D( heightmap, uv + vec2( 0, cellSize.y ) ).x ) * WIDTH / BOUNDS,
  1.0 );
    
  
  //<beginnormal_vertex>

  // PERFORMANCE // #include <morphnormal_vertex>
  // PERFORMANCE // #include <skinbase_vertex>
  // PERFORMANCE // #include <skinnormal_vertex>
  #include <defaultnormal_vertex>

  #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

    vNormal = normalize( transformedNormal );

  #endif

  //# include <begin_vertex>
  vec3 transformed = vec3( position.x, position.y, texture2D( heightmap, uv ).x );
  //<begin_vertex>
  // PERFORMANCE // #include <morphtarget_vertex>
  // PERFORMANCE // #include <skinning_vertex>
  // PERFORMANCE // #include <displacementmap_vertex>
  
  #include <project_vertex>
  
  // PERFORMANCE // #include <logdepthbuf_vertex>
  // PERFORMANCE // #include <clipping_planes_vertex>

  vViewPosition = - mvPosition.xyz;

  #include <worldpos_vertex>
  
  // PERFORMANCE // #include <envmap_vertex>

}
