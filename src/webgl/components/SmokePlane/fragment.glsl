uniform sampler2D u_noise;
uniform float u_time;
varying vec2 v_uv;

// noise_3d.png
vec3 noise3D(in vec3 coord){
  return vec3(
    texture2D(u_noise, coord.xy + vec2(0., coord.z)).x,
    texture2D(u_noise, coord.xy + vec2(coord.z, 0.)).y,
    texture2D(u_noise, coord.xy + vec2(-coord.z, -coord.z)/1.414).z
  );
}


void main(){
  vec3 color = noise3D(vec3(v_uv * 0.5, u_time*.5));
  
  float color2 = (color.x + color.y + color.z)/3.;

  
  gl_FragColor = vec4(vec3(color2), 1.);
}
