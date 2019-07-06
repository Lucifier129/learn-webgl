(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{28:function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.d(e,"a",function(){return r})},29:function(t,e,n){"use strict";function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),t}n.d(e,"a",function(){return a})},57:function(t,e,n){var r=n(24).vec3,a=function(t){return t instanceof Float32Array},i=function(t){return r.fromValues(t,t,t)};t.exports={_add_:function(t,e){return a(t)||a(e)?(a(t)||(t=i(t)),a(e)||(e=i(e)),r.add(r.create(),t,e)):t+e},_sub_:function(t,e){return a(t)||a(e)?(a(t)||(t=i(t)),a(e)||(e=i(e)),r.sub(r.create(),t,e)):t-e},_mul_:function(t,e){return a(t)||a(e)?(a(t)||(t=i(t)),a(e)||(e=i(e)),r.mul(r.create(),t,e)):t*e},_div_:function(t,e){return a(t)||a(e)?(a(t)||(t=i(t)),a(e)||(e=i(e)),r.div(r.create(),t,e)):t/e},_negate_:function(t){return a(t)?r.negate(r.create(),t):-t}}},75:function(t,e,n){"use strict";n.r(e);var r=n(17),a=n.n(r),i=n(19),o=n(1),u=n(0),c=n.n(u),s=n(28),h=n(29),f=n(24).vec3,l=n(57),d=l._add_,v=l._sub_,m=l._mul_,b=l._div_,w=l._negate_,p=function(t,e,n){return f.fromValues(t,e,n)},M=function(t,e){return f.dot(t,e)},x=function(t,e){return f.cross(f.create(),t,e)},k=function(t){return f.normalize(f.create(),t)},g=function(){function t(e,n){Object(s.a)(this,t),this.a=e,this.b=n}return Object(h.a)(t,[{key:"origin",value:function(){return this.a}},{key:"direction",value:function(){return this.b}},{key:"pointAt",value:function(t){var e=this.a,n=this.b;return d(e,m(t,n))}}]),t}(),y=function(){return{t:0,p:f.create(),normal:f.create()}},j=function(){function t(e,n,r){Object(s.a)(this,t),this.center=e,this.radius=n,this.material=r}return Object(h.a)(t,[{key:"hit",value:function(t,e,n,r){var a=v(t.origin(),this.center),i=M(t.direction(),t.direction()),o=M(a,t.direction()),u=v(M(a,a),m(this.radius,this.radius)),c=v(m(o,o),m(i,u));if(c<0)return!1;var s=b(v(w(o),Math.sqrt(c)),i),h=s<n&&s>e;return h||(h=(s=b(d(w(o),Math.sqrt(c)),i))<n&&s>e),!!h&&(r.t=s,r.p=t.pointAt(s),r.normal=b(v(r.p,this.center),this.radius),r.material=this.material,!0)}}]),t}(),O=function(){function t(e){Object(s.a)(this,t),this.list=e}return Object(h.a)(t,[{key:"hit",value:function(t,e,n,r){var a=y(),i=!1,o=n,u=!0,c=!1,s=void 0;try{for(var h,f=this.list[Symbol.iterator]();!(u=(h=f.next()).done);u=!0){h.value.hit(t,e,o,a)&&(i=!0,o=a.t,Object.assign(r,a))}}catch(l){c=!0,s=l}finally{try{u||null==f.return||f.return()}finally{if(c)throw s}}return i}},{key:"push",value:function(){var t;(t=this.list).push.apply(t,arguments)}}]),t}(),_=function(){function t(e,n,r,a,i,o,u){Object(s.a)(this,t);var c=b(m(a,Math.PI),180),h=Math.tan(b(c,2)),f=m(h,i),l=e,w=k(v(e,n)),p=k(x(r,w)),M=x(w,p),g=v(l,m(u,d(d(m(p,f),m(M,h)),w))),y=m(m(m(u,2),p),f),j=m(m(m(u,2),M),h);this.u=p,this.v=M,this.origin=l,this.lowerLeftCorner=g,this.horizontal=y,this.vertical=j,this.lensRadius=b(o,2)}return Object(h.a)(t,[{key:"getRay",value:function(t,e){var n=this.origin,r=this.lowerLeftCorner,a=this.horizontal,i=this.vertical,o=m(this.lensRadius,function(){var t;do{var e=p(Math.random(),Math.random(),0);t=v(m(2,e),p(1,1,0))}while(M(t,t)>=1);return t}()),u=d(m(this.u,o[0]),m(this.v,o[1])),c=v(d(d(r,m(t,a)),m(e,i)),n);return new g(d(n,u),v(c,u))}}]),t}(),z=function(){var t;do{var e=p(Math.random(),Math.random(),Math.random());t=v(m(2,e),p(1,1,1))}while(f.squaredLength(t)>=1);return t},I=function(){function t(e){Object(s.a)(this,t),this.albedo=e}return Object(h.a)(t,[{key:"scatter",value:function(t,e,n){var r=d(d(e.p,e.normal),z()),a=v(r,e.p);return n.scattered=new g(e.p,a),n.attenuation=this.albedo,!0}}]),t}(),E=function(t,e){return v(t,m(m(2,M(t,e)),e))},q=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;Object(s.a)(this,t),this.albedo=e,this.fuzz=Math.min(n,1)}return Object(h.a)(t,[{key:"scatter",value:function(t,e,n){var r=E(f.normalize(f.create(),t.direction()),e.normal);return n.scattered=new g(e.p,d(r,m(this.fuzz,z()))),n.attenuation=this.albedo,M(n.scattered.direction(),e.normal)>0}}]),t}(),D=function(){function t(e){Object(s.a)(this,t),this.refractIndex=e}return Object(h.a)(t,[{key:"scatter",value:function(t,e,n){var r=f.create(),a=E(t.direction(),e.normal),i=0,o=0;n.attenuation=p(1,1,1);var u=M(t.direction(),e.normal);u>0?(r=w(e.normal),i=this.refractIndex,o=b(m(this.refractIndex,u),f.length(t.direction()))):(r=e.normal,i=b(1,this.refractIndex),o=b(w(u),f.length(t.direction())));var c=0;return c=function(t,e,n,r){var a=f.normalize(f.create(),t),i=M(a,e),o=v(1,m(m(n,n),v(1,m(i,i))));return o>0&&(r.refracted=v(m(n,v(a,m(e,i))),m(e,Math.sqrt(o))),!0)}(t.direction(),r,i,n)?function(t,e){var n=b(v(1,e),d(1,e));return n=m(n,n),d(n,m(v(1,n),Math.pow(v(1,t),5)))}(o,this.refractIndex):1,Math.random()<c?n.scattered=new g(e.p,a):n.scattered=new g(e.p,n.refracted),!0}}]),t}(),R=function t(e,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,a=y();if(n.hit(e,.001,1/0,a)){var i={scattered:null,attenuation:0};return r>=50||!a.material.scatter(e,a,i)?p(0,0,0):m(i.attenuation,t(i.scattered,n,d(r,1)))}var o,u,c,s=f.normalize(f.create(),e.direction());return o=m(.5,d(s[1],1)),u=p(1,1,1),c=p(.5,.7,1),d(m(v(1,o),u),m(o,c))},F=function(t){var e=t.width,n=void 0===e?800:e,r=t.height,i=void 0===r?400:r,u=t.amount,c=void 0===u?2:u,s=t.lookFrom,h=void 0===s?p(13,2,3):s,l=t.lookAt,M=void 0===l?p(0,0,0):l,x=t.vup,k=void 0===x?p(0,1,0):x,g=t.vfov,y=void 0===g?20:g,z=t.aspect,E=void 0===z?b(n,i):z,F=t.focusDist,A=void 0===F?10:F,C=t.aperture,S=n,T=i,L=new _(h,M,k,y,E,void 0===C?.1:C,A),P=function(t){var e=[],n=Math.floor(b(Math.sqrt(t),2)),r=w(n),a=+n;e[0]=new j(p(0,-1e3,0),1e3,new I(p(.5,.5,.5)));for(var i=1,o=p(4,.2,0),u=r;u<a;u++)for(var c=r;c<a;c++){var s=Math.random(),h=p(d(u,m(.9,Math.random())),.2,d(c,m(.9,Math.random())));if(f.length(v(h,o))>.9)if(s<.8){var l=new I(p(m(Math.random(),Math.random()),m(Math.random(),Math.random()),m(Math.random(),Math.random())));e[i++]=new j(h,.2,l)}else if(s<.95){var M=new q(p(m(.5,d(1,Math.random())),m(.5,d(1,Math.random())),m(.5,d(1,Math.random()))),m(.5,Math.random()));e[i++]=new j(h,.2,M)}else e[i++]=new j(h,.2,new D(1.5))}return e[i++]=new j(p(0,1,0),1,new D(1.5)),e[i++]=new j(p(-4,1,0),1,new I(p(.4,.2,.1))),e[i++]=new j(p(4,1,0),1,new q(p(.7,.6,.5),0)),new O(e)}(c);return a.a.mark(function t(){var e,n,r,i,u,c,s,h,f,l,m;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e=v(T,1);case 1:if(!(e>=0)){t.next=23;break}n=0;case 3:if(!(n<S)){t.next=20;break}return r=b(d(n,Math.random()),S),i=b(d(e,Math.random()),T),u=L.getRay(r,i),c=R(u,P),s=Object(o.a)(c,3),h=s[0],f=s[1],l=s[2],m=1,t.next=11,h;case 11:return t.next=13,f;case 13:return t.next=15,l;case 15:return t.next=17,m;case 17:n++,t.next=3;break;case 20:e--,t.next=1;break;case 23:case"end":return t.stop()}},t)})};n.d(e,"default",function(){return C});var A=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return new Promise(function(e){return setTimeout(e,t)})};function C(){var t=Object(u.useState)(0),e=Object(o.a)(t,2),n=e[0],r=e[1],s=Object(u.useState)(0),h=Object(o.a)(s,2),f=h[0],l=h[1],d=Object(u.useRef)();return Object(u.useEffect)(function(){var t=d.current.getContext("2d"),e=t.createImageData(800,400),n=F({width:800,height:400,amount:50}),o=[],u=1,c=0,s=null,h=!1,f=function(){var d=Object(i.a)(a.a.mark(function i(){var d,v,m,b,w,p,M,x,k;return a.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:d=Date.now(),v=0,0,m=0,b=!0,w=!1,p=void 0,a.prev=7,M=n()[Symbol.iterator]();case 9:if(b=(x=M.next()).done){a.next=26;break}if(k=x.value,"number"!==typeof o[v]&&(o[v]=0),o[v]+=k,e.data[v]=Math.floor(255.99*Math.sqrt(o[v]/u)),v+=1,1,m=Date.now()-d,l(c+m),m%100!==0){a.next=21;break}return a.next=21,A();case 21:if(!h){a.next=23;break}return a.abrupt("return");case 23:b=!0,a.next=9;break;case 26:a.next=32;break;case 28:a.prev=28,a.t0=a.catch(7),w=!0,p=a.t0;case 32:a.prev=32,a.prev=33,b||null==M.return||M.return();case 35:if(a.prev=35,!w){a.next=38;break}throw p;case 38:return a.finish(35);case 39:return a.finish(32);case 40:if(!h){a.next=42;break}return a.abrupt("return");case 42:t.clearRect(0,0,800,400),t.putImageData(e,0,0),s=setTimeout(f,100),r(u),l(c+=Date.now()-d),u+=1;case 48:case"end":return a.stop()}},i,null,[[7,28,32,40],[33,,35,39]])}));return function(){return d.apply(this,arguments)}}();return f(),function(){h=!0,clearTimeout(s)}},[]),c.a.createElement(c.a.Fragment,null,c.a.createElement("canvas",{width:800,height:400,ref:d}),c.a.createElement("h3",null,"\u5149\u7ebf\u8ffd\u8e2a\u65f6\u95f4\uff1a",(f/1e3).toFixed(2),"\u79d2"),c.a.createElement("h3",null,"\u6e32\u67d3\u6b21\u6570\uff1a",n),c.a.createElement("h3",null,"\u5e73\u5747\u65f6\u95f4\uff1a",(n?f/1e3/n:0).toFixed(2),"\u79d2"))}}}]);
//# sourceMappingURL=8.b0904f3d.chunk.js.map