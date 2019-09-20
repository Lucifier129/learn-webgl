#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution;
  gl_FragColor=vec4(abs(cos(u_time)), uv.x, uv.y, 1.0);
}