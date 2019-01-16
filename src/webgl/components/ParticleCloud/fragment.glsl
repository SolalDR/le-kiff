uniform sampler2D u_noise;
uniform float u_time;
varying vec2 v_uv;
uniform vec3 u_color;

void main(){
  gl_FragColor = vec4(u_color, 1.);
  
}
