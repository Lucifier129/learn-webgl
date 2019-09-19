// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

struct Ray{
  vec3 origin;
  vec3 direction;
};

struct Sphere{
  vec3 center;
  float radius;
};

struct Hit_Record{
  bool isHit;
  float t;
  vec3 p;
  vec3 normal;
};

vec3 point_at(Ray ray,float t){
  return ray.origin+t*ray.direction;
}

bool hit(Sphere sphere,Ray ray,float t_min,float t_max,out Hit_Record hit_record){
  vec3 oc=ray.origin-sphere.center;
  float a=dot(ray.direction,ray.direction);
  float b=dot(oc,ray.direction);
  float c=dot(oc,oc)-sphere.radius*sphere.radius;
  float discriminant=b*b-a*c;
  
  if(discriminant>0.){
    float temp=(-b-sqrt(discriminant))/a;
    bool isValid=temp<t_max&&temp>t_min;
    
    if(!isValid){
      temp=(-b+sqrt(discriminant))/a;
      isValid=temp<t_max&&temp>t_min;
    }
    
    if(isValid){
      hit_record.t=temp;
      hit_record.p=point_at(ray,temp);
      hit_record.normal=(hit_record.p-sphere.center)/sphere.radius;
      return true;
    }
  }
  
  return false;
}

vec3 lerp(vec3 start,vec3 end,float t){
  return(1.-t)*start+t*end;
}

Sphere sphere0=Sphere(vec3(0.,-100.5,-1.),100.);

float aspect=u_resolution.x/u_resolution.y;

float x=u_mouse.x/u_resolution.x;
float y=u_mouse.y/u_resolution.y;

Sphere sphere1=Sphere(vec3(0.,0.,-1.),.5);

bool hit(Ray ray,float t_min,float t_max,out Hit_Record hit_record){
  bool hit_anything=false;
  
  if(hit(sphere0,ray,t_min,t_max,hit_record)){
    hit_anything=true;
    t_max=hit_record.t;
  }
  
  if(hit(sphere1,ray,t_min,t_max,hit_record)){
    hit_anything=true;
    t_max=hit_record.t;
  }
  
  return hit_anything;
}

float random(vec2 st){
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

#define FLT_MAX 3.402823466e+38

vec3 color(Ray ray){
  Hit_Record hit_record;
  
  if(hit(ray,0.,FLT_MAX,hit_record)){
    vec3 normal=hit_record.normal;
    return.5*vec3(normal.x+1.,normal.y+1.,normal.z+1.);
  }
  
  vec3 unit_direction=normalize(ray.direction);
  float t=.5*(unit_direction.y+1.);
  vec3 start=vec3(1.,1.,1.);
  vec3 end=vec3(.5,.7,1.);
  
  return lerp(start,end,t);
}

void main(){
  
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  float u=uv.x;
  float v=uv.y;
  
  float aspect=u_resolution.x/u_resolution.y;
  
  vec3 low_left_corner=vec3(-2.,-2./aspect,-1.);
  
  vec3 horizental=vec3(4.,0.,0.);
  
  vec3 vertical=vec3(0.,4./aspect,0.);
  
  vec3 ray_origin=vec3(0.,0.,0.);
  
  vec3 ray_direction=low_left_corner+u*horizental+v*vertical;
  
  Ray ray=Ray(ray_origin,ray_direction);
  
  gl_FragColor=vec4(color(ray),1.);
}