(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{12:function(e,t,r){"use strict";var n=function(){var e=function(e){return'<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">'+e+"</div>"},t='This page requires a browser that supports WebGL.<br/><a href="http://get.webgl.org">Click here to upgrade your browser.</a>',r='It doesn\'t appear your computer can support WebGL.<br/><a href="http://get.webgl.org">Click here for more information.</a>',n=function(e,t){for(var r=["webgl","experimental-webgl","webkit-3d","moz-webgl"],n=null,a=0;a<r.length;++a){try{n=e.getContext(r[a],t)}catch(o){}if(n)break}return n};return{create3DContext:n,setupWebGL:function(a,o,i){i=i||function(n){var a=document.getElementsByTagName("body")[0];if(a){var o=window.WebGLRenderingContext?r:t;n&&(o+="<br/><br/>Status: "+n),a.innerHTML=e(o)}},a.addEventListener&&a.addEventListener("webglcontextcreationerror",function(e){i(e.statusMessage)},!1);var u=n(a,o);return u||(window.WebGLRenderingContext,i("")),u}}}();window.requestAnimationFrame||(window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e,t){window.setTimeout(e,1e3/60)}),window.cancelAnimationFrame||(window.cancelAnimationFrame=window.cancelRequestAnimationFrame||window.webkitCancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelAnimationFrame||window.mozCancelRequestAnimationFrame||window.msCancelAnimationFrame||window.msCancelRequestAnimationFrame||window.oCancelAnimationFrame||window.oCancelRequestAnimationFrame||window.clearTimeout);var a=function(){var e=function(e){window.console&&window.console.log&&window.console.log(e)},t={enable:{0:!0},disable:{0:!0},getParameter:{0:!0},drawArrays:{0:!0},drawElements:{0:!0,2:!0},createShader:{0:!0},getShaderParameter:{1:!0},getProgramParameter:{1:!0},getVertexAttrib:{1:!0},vertexAttribPointer:{2:!0},bindTexture:{0:!0},activeTexture:{0:!0},getTexParameter:{0:!0,1:!0},texParameterf:{0:!0,1:!0},texParameteri:{0:!0,1:!0,2:!0},texImage2D:{0:!0,2:!0,6:!0,7:!0},texSubImage2D:{0:!0,6:!0,7:!0},copyTexImage2D:{0:!0,2:!0},copyTexSubImage2D:{0:!0},generateMipmap:{0:!0},bindBuffer:{0:!0},bufferData:{0:!0,2:!0},bufferSubData:{0:!0},getBufferParameter:{0:!0,1:!0},pixelStorei:{0:!0,1:!0},readPixels:{4:!0,5:!0},bindRenderbuffer:{0:!0},bindFramebuffer:{0:!0},checkFramebufferStatus:{0:!0},framebufferRenderbuffer:{0:!0,1:!0,2:!0},framebufferTexture2D:{0:!0,1:!0,2:!0},getFramebufferAttachmentParameter:{0:!0,1:!0,2:!0},getRenderbufferParameter:{0:!0,1:!0},renderbufferStorage:{0:!0,1:!0},clear:{0:!0},depthFunc:{0:!0},blendFunc:{0:!0,1:!0},blendFuncSeparate:{0:!0,1:!0,2:!0,3:!0},blendEquation:{0:!0},blendEquationSeparate:{0:!0,1:!0},stencilFunc:{0:!0},stencilFuncSeparate:{0:!0,1:!0},stencilMaskSeparate:{0:!0},stencilOp:{0:!0,1:!0,2:!0},stencilOpSeparate:{0:!0,1:!0,2:!0,3:!0},cullFace:{0:!0},frontFace:{0:!0}},r=null;function n(e){if(null==r)for(var t in r={},e)"number"==typeof e[t]&&(r[e[t]]=t)}function a(){if(null==r)throw"WebGLDebugUtils.init(ctx) not called"}function o(e){a();var t=r[e];return void 0!==t?t:"*UNKNOWN WebGL ENUM (0x"+e.toString(16)+")"}function i(e,r,n){var a=t[e];return void 0!==a&&a[r]?o(n):n.toString()}function u(e){var t=e.getParameter(e.MAX_VERTEX_ATTRIBS),r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r);for(var n=0;n<t;++n)e.disableVertexAttribArray(n),e.vertexAttribPointer(n,4,e.FLOAT,!1,0,0),e.vertexAttrib1f(n,0);e.deleteBuffer(r);var a=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);for(n=0;n<a;++n)e.activeTexture(e.TEXTURE0+n),e.bindTexture(e.TEXTURE_CUBE_MAP,null),e.bindTexture(e.TEXTURE_2D,null);for(e.activeTexture(e.TEXTURE0),e.useProgram(null),e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindRenderbuffer(e.RENDERBUFFER,null),e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.DITHER),e.disable(e.SCISSOR_TEST),e.blendColor(0,0,0,0),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.clearColor(0,0,0,0),e.clearDepth(1),e.clearStencil(-1),e.colorMask(!0,!0,!0,!0),e.cullFace(e.BACK),e.depthFunc(e.LESS),e.depthMask(!0),e.depthRange(0,1),e.frontFace(e.CCW),e.hint(e.GENERATE_MIPMAP_HINT,e.DONT_CARE),e.lineWidth(1),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.UNPACK_COLORSPACE_CONVERSION_WEBGL&&e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.polygonOffset(0,0),e.sampleCoverage(1,!1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilMask(4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.viewport(0,0,e.canvas.clientWidth,e.canvas.clientHeight),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT|e.STENCIL_BUFFER_BIT);e.getError(););}return{init:n,mightBeEnum:function(e){return a(),void 0!==r[e]},glEnumToString:o,glFunctionArgToString:i,makeDebugContext:function(t,r){n(t),r=r||function(t,r,n){for(var a="",u=0;u<n.length;++u)a+=(0==u?"":", ")+i(r,u,n[u]);e("WebGL error "+o(t)+" in "+r+"("+a+")")};var a={};function u(e,t){return function(){var n=e[t].apply(e,arguments),o=e.getError();return 0!=o&&(a[o]=!0,r(o,t,arguments)),n}}var f={};for(var c in t)"function"==typeof t[c]?f[c]=u(t,c):f[c]=t[c];return f.getError=function(){for(var e in a)if(a[e])return a[e]=!1,e;return t.NO_ERROR},f},makeLostContextSimulatingContext:function(e){var t={},r=1,n=!1,a=[],o=void 0,i=void 0,f=void 0,c={};function l(e,t){var a=e[t];return function(){if(!n)return function(e){for(var t=0;t<e.length;++t){var n=e[t];if((a=n)instanceof WebGLBuffer||a instanceof WebGLFramebuffer||a instanceof WebGLProgram||a instanceof WebGLRenderbuffer||a instanceof WebGLShader||a instanceof WebGLTexture)return n.__webglDebugContextLostId__==r}var a;return!0}(arguments)?a.apply(e,arguments):void(c[e.INVALID_OPERATION]=!0)}}for(var d in e)"function"==typeof e[d]?t[d]=l(e,d):t[d]=e[d];function s(e){return{statusMessage:e}}t.loseContext=function(){if(!n){for(n=!0,++r;e.getError(););!function(){for(var e=Object.keys(c),t=0;t<e.length;++t);}(),c[e.CONTEXT_LOST_WEBGL]=!0,setTimeout(function(){o&&o(s("context lost"))},0)}},t.restoreContext=function(){if(n){if(!i)throw"You can not restore the context without a listener";setTimeout(function(){if(function(){for(var t=0;t<a.length;++t){var r=a[t];r instanceof WebGLBuffer?e.deleteBuffer(r):r instanceof WebGLFramebuffer?e.deleteFramebuffer(r):r instanceof WebGLProgram?e.deleteProgram(r):r instanceof WebGLRenderbuffer?e.deleteRenderbuffer(r):r instanceof WebGLShader?e.deleteShader(r):r instanceof WebGLTexture&&e.deleteTexture(r)}}(),u(e),n=!1,i){var t=i;i=f,f=void 0,t(s("context restored"))}},0)}},t.getError=function(){if(!n)for(;t=e.getError();)c[t]=!0;for(var t in c)if(c[t])return delete c[t],t;return e.NO_ERROR};for(var g=["createBuffer","createFramebuffer","createProgram","createRenderbuffer","createShader","createTexture"],m=0;m<g.length;++m)t[h=g[m]]=function(t){return function(){if(n)return null;var o=t.apply(e,arguments);return o.__webglDebugContextLostId__=r,a.push(o),o}}(e[h]);var b=["getActiveAttrib","getActiveUniform","getBufferParameter","getContextAttributes","getAttachedShaders","getFramebufferAttachmentParameter","getParameter","getProgramParameter","getProgramInfoLog","getRenderbufferParameter","getShaderParameter","getShaderInfoLog","getShaderSource","getTexParameter","getUniform","getUniformLocation","getVertexAttrib"];for(m=0;m<b.length;++m)t[h=b[m]]=function(t){return function(){return n?null:t.apply(e,arguments)}}(t[h]);var E,v=["isBuffer","isEnabled","isFramebuffer","isProgram","isRenderbuffer","isShader","isTexture"];for(m=0;m<v.length;++m){var h;t[h=v[m]]=function(t){return function(){return!n&&t.apply(e,arguments)}}(t[h])}function A(e){return"function"==typeof e?e:function(t){e.handleEvent(t)}}return t.checkFramebufferStatus=(E=t.checkFramebufferStatus,function(){return n?e.FRAMEBUFFER_UNSUPPORTED:E.apply(e,arguments)}),t.getAttribLocation=function(t){return function(){return n?-1:t.apply(e,arguments)}}(t.getAttribLocation),t.getVertexAttribOffset=function(t){return function(){return n?0:t.apply(e,arguments)}}(t.getVertexAttribOffset),t.isContextLost=function(){return n},t.registerOnContextLostListener=function(e){o=A(e)},t.registerOnContextRestoredListener=function(e){n?f=A(e):i=A(e)},t},resetToInitialState:u}}();function o(e,t,r){var n=function(e,t,r){var n=i(e,e.VERTEX_SHADER,t),a=i(e,e.FRAGMENT_SHADER,r);if(!n||!a)return null;var o=e.createProgram();if(!o)return null;if(e.attachShader(o,n),e.attachShader(o,a),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS)){var u=e.getProgramInfoLog(o);return console.log("Failed to link program: "+u),e.deleteProgram(o),e.deleteShader(a),e.deleteShader(n),null}return o}(e,t,r);return n?(e.useProgram(n),e.program=n,!0):(console.log("Failed to create program"),!1)}function i(e,t,r){var n=e.createShader(t);if(null==n)return console.log("unable to create shader"),null;if(e.shaderSource(n,r),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS)){var a=e.getShaderInfoLog(n);return console.log("Failed to compile shader: "+a),e.deleteShader(n),null}return n}function u(e,t){var r=n.setupWebGL(e);return r?((arguments.length<2||t)&&(r=a.makeDebugContext(r)),r):null}r.d(t,"b",function(){return o}),r.d(t,"a",function(){return u})},13:function(e,t,r){"use strict";r.d(t,"f",function(){return n}),r.d(t,"g",function(){return o}),r.d(t,"e",function(){return f}),r.d(t,"d",function(){return c}),r.d(t,"a",function(){return d}),r.d(t,"c",function(){return s}),r.d(t,"b",function(){return g});var n=function(e){return e},a=function(e){return new Promise(function(t,r){var n=new Image;n.onload=function(){return t(n)},n.onerror=function(e){return r(e)},n.src=e})},o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return Promise.all(e.map(a))},i=function(e,t){return(t-e.left-e.width/2)/(e.width/2)},u=function(e,t){return(e.height/2-(t-e.top))/(e.height/2)},f=function(e,t){var r=e.getBoundingClientRect();return[i(r,t.clientX),u(r,t.clientY)]},c=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return new Float32Array(e.flat(1/0))},l=function(e){var t=[[],[],[],[]],r=!0,n=!1,a=void 0;try{for(var o,i=e[Symbol.iterator]();!(r=(o=i.next()).done);r=!0){var u=o.value;t[0].push(u[0]),t[1].push(u[1]),t[2].push(u[2]),t[3].push(u[3])}}catch(f){n=!0,a=f}finally{try{r||null==i.return||i.return()}finally{if(n)throw a}}return new Float32Array(t.flat())},d=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:0)*Math.PI/180,t=Math.sin(e),r=Math.cos(e);return l([[r,-t,0,0],[t,r,0,0],[0,0,1,0],[0,0,0,1]])},s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return l([[1,0,0,e],[0,1,0,t],[0,0,1,r],[0,0,0,1]])},g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return l([[e,0,0,0],[0,t,0,0],[0,0,r,0],[0,0,0,1]])}},64:function(e,t,r){"use strict";r.r(t),r.d(t,"default",function(){return i});var n=r(0),a=r.n(n),o=r(12);r(13);function i(){var e=Object(n.useRef)();return Object(n.useEffect)(function(){var t=e.current,r=Object(o.a)(t);if(!Object(o.b)(r,"\n      attribute vec4 a_Position;\n      void main() {\n        gl_Position = a_Position;\n        gl_PointSize = 3.0;\n      }\n    ","\n      void main() {\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n      }\n    "))throw new Error("failed to initilize shaders");var n=r.getAttribLocation(r.program,"a_Position");if(n<0)throw new Error("failed to get attribute location from webgl");var a=new Float32Array([[-.5,.5],[-.3,-.5],[0,.5],[.2,-.5],[.5,.5],[.7,-.5]].flat()),i=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,i),r.bufferData(r.ARRAY_BUFFER,a,r.STATIC_DRAW),r.vertexAttribPointer(n,2,r.FLOAT,!1,0,0),r.enableVertexAttribArray(n),r.clearColor(0,0,0,1),r.clear(r.COLOR_BUFFER_BIT),r.drawArrays(r.TRIANGLES,0,3);var u=0,f=[r.POINTS,r.LINES,r.LINE_STRIP,r.TRIANGLES,r.TRIANGLE_STRIP,r.TRIANGLE_FAN];setInterval(function(){var e=f[u++%f.length];r.clear(r.COLOR_BUFFER_BIT),r.drawArrays(e,0,6)},1e3)},[]),a.a.createElement("canvas",{width:400,height:400,ref:e})}}}]);
//# sourceMappingURL=9.0566cb7f.chunk.js.map