(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{13:function(e,r,t){"use strict";t.d(r,"f",function(){return n}),t.d(r,"g",function(){return o}),t.d(r,"e",function(){return c}),t.d(r,"d",function(){return f}),t.d(r,"a",function(){return l}),t.d(r,"c",function(){return v}),t.d(r,"b",function(){return s});var n=function(e){return e},a=function(e){return new Promise(function(r,t){var n=new Image;n.onload=function(){return r(n)},n.onerror=function(e){return t(e)},n.src=e})},o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return Promise.all(e.map(a))},i=function(e,r){return(r-e.left-e.width/2)/(e.width/2)},u=function(e,r){return(e.height/2-(r-e.top))/(e.height/2)},c=function(e,r){var t=e.getBoundingClientRect();return[i(t,r.clientX),u(t,r.clientY)]},f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return new Float32Array(e.flat(1/0))},d=function(e){var r=[[],[],[],[]],t=!0,n=!1,a=void 0;try{for(var o,i=e[Symbol.iterator]();!(t=(o=i.next()).done);t=!0){var u=o.value;r[0].push(u[0]),r[1].push(u[1]),r[2].push(u[2]),r[3].push(u[3])}}catch(c){n=!0,a=c}finally{try{t||null==i.return||i.return()}finally{if(n)throw a}}return new Float32Array(r.flat())},l=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:0)*Math.PI/180,r=Math.sin(e),t=Math.cos(e);return d([[t,-r,0,0],[r,t,0,0],[0,0,1,0],[0,0,0,1]])},v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return d([[1,0,0,e],[0,1,0,r],[0,0,1,t],[0,0,0,1]])},s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return d([[e,0,0,0],[0,r,0,0],[0,0,t,0],[0,0,0,1]])}},20:function(e,r,t){e.exports=t.p+"static/media/sky.2b11efd6.jpg"},21:function(e,r,t){e.exports=t.p+"static/media/circle.def06678.gif"},71:function(e,r,t){"use strict";t.r(r),t.d(r,"default",function(){return p});t(25),t(1);var n=t(23),a=t(17),o=t.n(a),i=t(19),u=t(0),c=t.n(u),f=t(24),d=t(51),l=t(13);t(20),t(21);function v(){var e=Object(n.a)(["\n    precision mediump float;\n    varying vec4 vColor;\n    void main() {\n      gl_FragColor = vColor;\n    }\n  "]);return v=function(){return e},e}function s(){var e=Object(n.a)(["\n    attribute vec4 aPosition;\n    attribute vec4 aColor;\n    uniform mat4 uMvpMatrix;\n    varying vec4 vColor;\n    void main() {\n      gl_Position = uMvpMatrix * aPosition;\n      vColor = aColor;\n    }\n  "]);return s=function(){return e},e}function p(){var e=Object(u.useRef)();return Object(u.useEffect)(function(){var r=e.current,t=r.getContext("webgl");t.viewport(0,0,r.width,r.height);var n={fovy:30,near:1,far:100,eyeX:3,eyeY:3,eyeZ:7,centerX:0,centerY:0,centerZ:0,upX:0,upY:1,upZ:0,scaleX:1,scaleY:1,scaleZ:1},a=new d.a({name:"cube"});a.add(n,"fovy",0,90),a.add(n,"near",1,1e3),a.add(n,"far",0,1e3),a.add(n,"eyeX",-10,100),a.add(n,"eyeY",-10,100),a.add(n,"eyeZ",-10,100),a.add(n,"centerX",-1,1),a.add(n,"centerY",-1,1),a.add(n,"centerZ",-1,1),a.add(n,"upX",-10,10),a.add(n,"upY",-10,10),a.add(n,"upZ",-10,10),a.add(n,"scaleX",0,10).step(.1),a.add(n,"scaleY",0,10).step(.1),a.add(n,"scaleZ",0,10).step(.1);var o=null,i=!1;return g(t,n).then(function(e){o=e,i&&o()}),function(){i=!0,o&&o(),a.destroy()}},[]),c.a.createElement("canvas",{width:400,height:400,ref:e})}var m=function(e){var r=null;return function t(){e(),r=requestAnimationFrame(t)}(),function(){return cancelAnimationFrame(r)}},g=function(){var e=Object(i.a)(o.a.mark(function e(r,t){var n;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h(r);case 2:return n=e.sent,e.abrupt("return",m(function(){console.log("raf");var e=f.mat4.create(),a=f.mat4.create(),o=f.mat4.create();f.mat4.perspective(e,t.fovy*Math.PI/180,1,t.near,t.far),f.mat4.lookAt(a,[t.eyeX,t.eyeY,t.eyeZ],[t.centerX,t.centerY,t.centerZ],[t.upX,t.upY,t.upZ]),f.mat4.scale(a,a,[t.scaleX,t.scaleY,t.scaleZ]),f.mat4.multiply(o,e,a),r.enable(r.DEPTH_TEST),r.clearColor(0,0,0,1),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),n.render(o)}));case 4:case"end":return e.stop()}},e)}));return function(r,t){return e.apply(this,arguments)}}(),h=function(){var e=Object(i.a)(o.a.mark(function e(r){var t,n,a,i,u,c,f,d,p,m,g,h,y;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=Object(l.f)(s()),n=Object(l.f)(v()),a=E(r,{vertex:t,fragment:n}),u=[(i=function(e,r,t){return[e,r,t].map(function(e){return e/255})})(161,98,247),i(111,136,254),i(69,227,255),i(92,127,167),i(82,140,162),i(165,222,141),i(240,74,76),i(62,97,155),i(15,107,172),i(37,139,214),i(133,183,254),i(198,206,255)],c=Object(l.d)([[-.5,.5,-.5,u[0]],[-.5,-.5,-.5,u[0]],[.5,.5,-.5,u[0]],[.5,-.5,-.5,u[0]],[-.5,.5,.5,u[0]],[-.5,-.5,.5,u[0]],[.5,.5,.5,u[0]],[.5,-.5,.5,u[0]],[-.5,.5,-.5,u[2]],[-.5,.5,.5,u[2]],[.5,.5,-.5,u[2]],[.5,.5,.5,u[2]],[-.5,-.5,-.5,u[3]],[-.5,-.5,.5,u[3]],[.5,-.5,-.5,u[3]],[.5,-.5,.5,u[3]],[-.5,.5,-.5,u[4]],[-.5,-.5,-.5,u[4]],[-.5,.5,.5,u[4]],[-.5,-.5,.5,u[4]],[.5,.5,-.5,u[5]],[.5,.5,.5,u[5]],[.5,-.5,-.5,u[5]],[.5,-.5,.5,u[5]]]),f=w(r,a),d=F(r,a),p=c.BYTES_PER_ELEMENT,m=A(r,{type:r.ARRAY_BUFFER,data:c}),R(r,r.ARRAY_BUFFER,m,[{location:d.aPosition,size:3,stride:6*p,offset:0},{location:d.aColor,size:3,stride:6*p,offset:3*p}]),g=new Uint8Array([[0,1,2],[1,2,3],[4,5,6],[5,6,7],[8,9,10],[9,10,11],[12,13,14],[13,14,15],[16,17,18],[17,18,19],[20,21,22],[22,21,23]].flat(1/0)),h=A(r,{type:r.ELEMENT_ARRAY_BUFFER,data:g}),y=function(e){r.bindBuffer(r.ARRAY_BUFFER,m),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,h),r.useProgram(a),r.uniformMatrix4fv(f.uMvpMatrix,!1,e),r.drawElements(r.TRIANGLES,g.length,r.UNSIGNED_BYTE,0)},e.abrupt("return",{render:y});case 15:case"end":return e.stop()}},e)}));return function(r){return e.apply(this,arguments)}}(),E=function(e,r){var t=b(e,{type:e.VERTEX_SHADER,source:r.vertex}),n=b(e,{type:e.FRAGMENT_SHADER,source:r.fragment});return y(e,{vertex:t,fragment:n})},y=function(e,r){var t=e.createProgram();e.attachShader(t,r.vertex),e.attachShader(t,r.fragment),e.linkProgram(t);var n=e.getProgramInfoLog(t);if(n)throw new Error(n);return t},b=function(e,r){var t=r.type,n=r.source,a=e.createShader(t);e.shaderSource(a,n),e.compileShader(a);var o=e.getShaderInfoLog(a);if(o)throw new Error(o);return a},A=function(e,r){var t=r.type,n=r.data,a=r.usage,o=void 0===a?e.STATIC_DRAW:a,i=e.createBuffer();return e.bindBuffer(t,i),e.bufferData(t,n,o),e.bindBuffer(t,null),i},R=function(e,r,t){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[];e.bindBuffer(r,t),n.forEach(function(r){var t=r.location,n=r.size,a=r.type,o=void 0===a?e.FLOAT:a,i=r.normalized,u=void 0!==i&&i,c=r.stride,f=r.offset;e.vertexAttribPointer(t,n,o,u,c,f),e.enableVertexAttribArray(t)}),e.bindBuffer(r,null)},w=function(e,r){for(var t=e.getProgramParameter(r,e.ACTIVE_UNIFORMS),n={},a=0;a<t;a++){var o=e.getActiveUniform(r,a);n[o.name]=e.getUniformLocation(r,o.name)}return n},F=function(e,r){for(var t=e.getProgramParameter(r,e.ACTIVE_ATTRIBUTES),n={},a=0;a<t;a++){var o=e.getActiveAttrib(r,a);n[o.name]=e.getAttribLocation(r,o.name)}return n}}}]);
//# sourceMappingURL=10.ed85f354.chunk.js.map