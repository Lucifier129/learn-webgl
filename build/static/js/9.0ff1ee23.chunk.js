(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{13:function(r,t,e){"use strict";e.d(t,"f",function(){return n}),e.d(t,"g",function(){return o}),e.d(t,"e",function(){return c}),e.d(t,"d",function(){return f}),e.d(t,"a",function(){return l}),e.d(t,"c",function(){return s}),e.d(t,"b",function(){return m});var n=function(r){return r},a=function(r){return new Promise(function(t,e){var n=new Image;n.onload=function(){return t(n)},n.onerror=function(r){return e(r)},n.src=r})},o=function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return Promise.all(r.map(a))},i=function(r,t){return(t-r.left-r.width/2)/(r.width/2)},u=function(r,t){return(r.height/2-(t-r.top))/(r.height/2)},c=function(r,t){var e=r.getBoundingClientRect();return[i(e,t.clientX),u(e,t.clientY)]},f=function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return new Float32Array(r.flat(1/0))},v=function(r){var t=[[],[],[],[]],e=!0,n=!1,a=void 0;try{for(var o,i=r[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var u=o.value;t[0].push(u[0]),t[1].push(u[1]),t[2].push(u[2]),t[3].push(u[3])}}catch(c){n=!0,a=c}finally{try{e||null==i.return||i.return()}finally{if(n)throw a}}return new Float32Array(t.flat())},l=function(){var r=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:0)*Math.PI/180,t=Math.sin(r),e=Math.cos(r);return v([[e,-t,0,0],[t,e,0,0],[0,0,1,0],[0,0,0,1]])},s=function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return v([[1,0,0,r],[0,1,0,t],[0,0,1,e],[0,0,0,1]])},m=function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return v([[r,0,0,0],[0,t,0,0],[0,0,e,0],[0,0,0,1]])}},20:function(r,t,e){r.exports=e.p+"static/media/sky.2b11efd6.jpg"},21:function(r,t,e){r.exports=e.p+"static/media/circle.def06678.gif"},70:function(r,t,e){"use strict";e.r(t),e.d(t,"default",function(){return T});var n=e(25),a=e(1),o=e(23),i=e(17),u=e.n(i),c=e(19),f=e(0),v=e.n(f),l=e(24),s=(e(51),e(13)),m=e(20),d=e.n(m),p=e(21),g=e.n(p);function h(){var r=Object(o.a)(["\n    precision mediump float;\n    varying vec2 vTexCoor;\n    uniform sampler2D uSampler0;\n    uniform sampler2D uSampler1;\n    void main() {\n      vec4 color0 = texture2D(uSampler0, vTexCoor);\n      vec4 color1 = texture2D(uSampler1, vTexCoor);\n      gl_FragColor = color0 * color1;\n    }\n  "]);return h=function(){return r},r}function E(){var r=Object(o.a)(["\n    attribute vec4 aPosition;\n    attribute vec2 aTexCoor;\n    uniform mat4 uRotateM;\n    varying vec2 vTexCoor;\n    void main() {\n      gl_Position = uRotateM * aPosition;\n      vTexCoor = aTexCoor;\n    }\n  "]);return E=function(){return r},r}function T(){var r=Object(f.useRef)();return Object(f.useEffect)(function(){var t=r.current,e=t.getContext("webgl");e.viewport(0,0,t.width,t.height),b(e)},[]),v.a.createElement("canvas",{width:400,height:400,ref:r})}var R=function(r){var t=null;return function e(){r(),t=requestAnimationFrame(e)}(),function(){return cancelAnimationFrame(t)}},b=function(){var r=Object(c.a)(u.a.mark(function r(t){var e,n;return u.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return e=0,r.next=3,x(t);case 3:return n=r.sent,r.abrupt("return",R(function(){var r={radian:e%360*Math.PI/180,axis:l.vec3.fromValues(0,0,1)};t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT),n.render(r),e+=1}));case 5:case"end":return r.stop()}},r)}));return function(t){return r.apply(this,arguments)}}(),x=function(){var r=Object(c.a)(u.a.mark(function r(t){var e,n,o,i,f,v,m,p,T,R,b,x,w,_,F,U,C,O,D,N;return u.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return e=Object(s.f)(E()),n=Object(s.f)(h()),o=A(t,{vertex:e,fragment:n}),i=S(t,o),f=P(t,o),v=Object(s.d)([[[-.5,.5],[0,1]],[[-.5,-.5],[0,0]],[[.5,.5],[1,1]],[[.5,-.5],[1,0]]]),m=v.BYTES_PER_ELEMENT,p=y(t,{type:t.ARRAY_BUFFER,data:v}),I(t,t.ARRAY_BUFFER,p,[{location:f.aPosition,size:2,stride:4*m,offset:0},{location:f.aTexCoor,size:2,stride:4*m,offset:2*m}]),T=[d.a,g.a],r.next=12,Object(s.g)(T);case 12:return R=r.sent,b=Object(a.a)(R,2),x=b[0],w=b[1],_=function(){t.bindBuffer(t.ARRAY_BUFFER,p),t.useProgram(o)},F=function(){B(t,{unit:0,location:i.uSampler0,image:{source:x,format:t.RGBA,type:t.UNSIGNED_BYTE},parameters:[{name:t.TEXTURE_MIN_FILTER,value:t.LINEAR}]}),B(t,{unit:1,location:i.uSampler1,image:{source:w,format:t.RGBA,type:t.UNSIGNED_BYTE},parameters:[{name:t.TEXTURE_MIN_FILTER,value:t.LINEAR}]})},U=function(){t.drawArrays(t.TRIANGLE_STRIP,0,4)},C=l.mat4.create(),O=l.mat4.create(),D=function(){var r=Object(c.a)(u.a.mark(function r(e,n){return u.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:l.mat4.rotate(O,C,e,n),t.uniformMatrix4fv(i.uRotateM,!1,O);case 2:case"end":return r.stop()}},r)}));return function(t,e){return r.apply(this,arguments)}}(),N=function(r){_(),F(),D(r.radian,r.axis),U()},r.abrupt("return",{render:N});case 24:case"end":return r.stop()}},r)}));return function(t){return r.apply(this,arguments)}}(),A=function(r,t){var e=_(r,{type:r.VERTEX_SHADER,source:t.vertex}),n=_(r,{type:r.FRAGMENT_SHADER,source:t.fragment});return w(r,{vertex:e,fragment:n})},w=function(r,t){var e=r.createProgram();r.attachShader(e,t.vertex),r.attachShader(e,t.fragment),r.linkProgram(e);var n=r.getProgramInfoLog(e);if(n)throw new Error(n);return e},_=function(r,t){var e=t.type,n=t.source,a=r.createShader(e);r.shaderSource(a,n),r.compileShader(a);var o=r.getShaderInfoLog(a);if(o)throw new Error(o);return a},y=function(r,t){var e=t.type,n=t.data,a=t.usage,o=void 0===a?r.STATIC_DRAW:a,i=r.createBuffer();return r.bindBuffer(e,i),r.bufferData(e,n,o),r.bindBuffer(e,null),i},I=function(r,t,e){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[];r.bindBuffer(t,e),n.forEach(function(t){var e=t.location,n=t.size,a=t.type,o=void 0===a?r.FLOAT:a,i=t.normalized,u=void 0!==i&&i,c=t.stride,f=t.offset;r.vertexAttribPointer(e,n,o,u,c,f),r.enableVertexAttribArray(e)}),r.bindBuffer(t,null)},S=function(r,t){for(var e=r.getProgramParameter(t,r.ACTIVE_UNIFORMS),n={},a=0;a<e;a++){var o=r.getActiveUniform(t,a);n[o.name]=r.getUniformLocation(t,o.name)}return n},P=function(r,t){for(var e=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES),n={},a=0;a<e;a++){var o=r.getActiveAttrib(t,a);n[o.name]=r.getAttribLocation(t,o.name)}return n},B=function(r,t){var e=t.location,a=t.unit,o=t.image,i=t.flipY,u=void 0===i||i,c=t.parameters,f=void 0===c?[]:c,v=r.createTexture();return u&&r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,1),r.activeTexture(r.TEXTURE0+a),r.bindTexture(r.TEXTURE_2D,v),f.forEach(function(t){var e=t.name,n=t.value;r.texParameteri(r.TEXTURE_2D,e,n)}),o=Object(n.a)({level:0,format:r.RGBA,type:r.UNSIGNED_BYTE},o),r.texImage2D(r.TEXTURE_2D,o.level,o.format,o.format,o.type,o.source),r.uniform1i(e,a),v}}}]);
//# sourceMappingURL=9.0ff1ee23.chunk.js.map