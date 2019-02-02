uniform sampler2D u_noise;
uniform float u_time;
varying vec2 v_uv;
uniform vec3 u_color;
uniform sampler2D u_texture_front;
uniform sampler2D u_texture_back;
uniform float opacity;


void main(){

  
  vec4 color_back = (1. - opacity)*texture2D( u_texture_back, v_uv );
  vec4 color_front = opacity*texture2D( u_texture_front, v_uv );

  vec4 color = color_back + color_front;
  gl_FragColor = vec4(color.xyz, 1.);
  
}
