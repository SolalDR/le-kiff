varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_spread;
uniform vec3 u_amplitude;
uniform vec3 u_noise_amplitude;
uniform float u_time;
uniform float u_size;

void main(){
  v_uv = uv;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
  

  vec3 newPosition = position*u_amplitude + (texture2D(u_texture, position.xy*u_spread + u_time).xyz - 0.5) * u_noise_amplitude;
  
  gl_Position = projectionMatrix*modelViewMatrix*vec4(newPosition, 1.);
  gl_PointSize = u_size;
}
