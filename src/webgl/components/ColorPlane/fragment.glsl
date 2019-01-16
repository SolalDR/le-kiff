uniform sampler2D u_noise;
uniform float u_time;
varying vec2 v_uv;
uniform vec3 u_color;
uniform sampler2D u_texture;

void main(){
  vec4 color = texture2D(u_texture, v_uv);
  gl_FragColor = vec4(color.x*u_color, 1.);
}
