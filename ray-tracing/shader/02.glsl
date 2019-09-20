#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main(){
  gl_FragColor=vec4(cos(u_time),sin(u_time),tan(u_time),1.);
}