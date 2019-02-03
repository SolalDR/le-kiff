uniform sampler2D u_noise;
uniform float u_time;
varying vec2 v_uv;
uniform vec3 u_color;
uniform sampler2D u_texture_front;
uniform sampler2D u_texture_back;
uniform vec2 u_offset_front;
uniform vec2 u_offset_back;
uniform float u_opacity;


void main(){

  vec4 color_back = (1. - u_opacity)*texture2D( u_texture_back, v_uv + u_offset_front );
  vec4 color_front = u_opacity*texture2D( u_texture_front, v_uv + u_offset_front );

  vec4 color = color_front + color_back;
  gl_FragColor = vec4(color.xyz, 1.);
  
}
