(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{66:function(t,r,e){"use strict";e.r(r),e.d(r,"default",function(){return s});var a=e(1),n=e(0),i=e.n(n),o=e(12),c=e(13),u=e(69),f=e(47),b=e(49);function s(){var t=Object(n.useRef)();return Object(n.useEffect)(function(){var r=t.current,e=Object(o.a)(r);if(!Object(o.b)(e,"\n      attribute vec4 a_Position;\n      uniform mat4 u_rotateZMatrix;\n      uniform mat4 u_translateMatrix;\n      uniform mat4 u_scaleMatrix;\n      void main() {\n        gl_Position = u_rotateZMatrix * u_translateMatrix * u_scaleMatrix * a_Position;\n        gl_PointSize = 3.0;\n      }\n    ","\n      void main() {\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n      }\n    "))throw new Error("failed to initilize shaders");var n=e.getAttribLocation(e.program,"a_Position"),i=e.getUniformLocation(e.program,"u_rotateZMatrix"),s=e.getUniformLocation(e.program,"u_translateMatrix"),_=e.getUniformLocation(e.program,"u_scaleMatrix"),m=Object(c.d)([[0,.5],[-.5,-.5],[.5,-.5]]),l=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,l),e.bufferData(e.ARRAY_BUFFER,m,e.STATIC_DRAW),e.vertexAttribPointer(n,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(n),e.clearColor(0,0,0,1);var O=Object(b.a)(1,1),x=O.pipe(Object(f.a)(function(t){return Object(c.a)(360*t)})),p=O.pipe(Object(f.a)(function(t){return Object(c.c)(t/2)})),v=O.pipe(Object(f.a)(function(t){return Object(c.b)(t,t,t)}));Object(u.a)([O,x,p,v]).subscribe(function(t){var r=Object(a.a)(t,4),n=r[0],o=r[1],c=r[2],u=r[3];e.clear(e.COLOR_BUFFER_BIT),e.uniformMatrix4fv(i,!1,o),e.uniformMatrix4fv(s,!1,c),e.uniformMatrix4fv(_,!1,u),e.drawArrays(e.TRIANGLE_STRIP,0,3),0===n&&O.next(1),1===n&&O.next(0)})},[]),i.a.createElement("canvas",{width:400,height:400,ref:t})}}}]);
//# sourceMappingURL=14.f8c2ef47.chunk.js.map