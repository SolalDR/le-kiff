precision highp float;

uniform float u_time;
uniform sampler2D u_map;
uniform sampler2D u_noise;
uniform float u_alpha;
varying vec2 v_uv;

void main(){

  vec4 map = texture2D(u_map, vec2(
    mod(v_uv.x + u_time, 1.),
    v_uv.y
  ));

  float alpha = ((cos(u_time*100.)+1.)/2.) * 0.2;

  gl_FragColor = vec4(vec3(.6), (map.x + map.y + map.z)/3. - 0.4);
  
}
