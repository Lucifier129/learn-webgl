(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{12:function(e,t,r){"use strict";var n=function(){var e=function(e){return'<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">'+e+"</div>"},t='This page requires a browser that supports WebGL.<br/><a href="http://get.webgl.org">Click here to upgrade your browser.</a>',r='It doesn\'t appear your computer can support WebGL.<br/><a href="http://get.webgl.org">Click here for more information.</a>',n=function(e,t){for(var r=["webgl","experimental-webgl","webkit-3d","moz-webgl"],n=null,o=0;o<r.length;++o){try{n=e.getContext(r[o],t)}catch(i){}if(n)break}return n};return{create3DContext:n,setupWebGL:function(o,i,a){a=a||function(n){var o=document.getElementsByTagName("body")[0];if(o){var i=window.WebGLRenderingContext?r:t;n&&(i+="<br/><br/>Status: "+n),o.innerHTML=e(i)}},o.addEventListener&&o.addEventListener("webglcontextcreationerror",function(e){a(e.statusMessage)},!1);var u=n(o,i);return u||(window.WebGLRenderingContext,a("")),u}}}();window.requestAnimationFrame||(window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e,t){window.setTimeout(e,1e3/60)}),window.cancelAnimationFrame||(window.cancelAnimationFrame=window.cancelRequestAnimationFrame||window.webkitCancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelAnimationFrame||window.mozCancelRequestAnimationFrame||window.msCancelAnimationFrame||window.msCancelRequestAnimationFrame||window.oCancelAnimationFrame||window.oCancelRequestAnimationFrame||window.clearTimeout);var o=function(){var e=function(e){window.console&&window.console.log&&window.console.log(e)},t={enable:{0:!0},disable:{0:!0},getParameter:{0:!0},drawArrays:{0:!0},drawElements:{0:!0,2:!0},createShader:{0:!0},getShaderParameter:{1:!0},getProgramParameter:{1:!0},getVertexAttrib:{1:!0},vertexAttribPointer:{2:!0},bindTexture:{0:!0},activeTexture:{0:!0},getTexParameter:{0:!0,1:!0},texParameterf:{0:!0,1:!0},texParameteri:{0:!0,1:!0,2:!0},texImage2D:{0:!0,2:!0,6:!0,7:!0},texSubImage2D:{0:!0,6:!0,7:!0},copyTexImage2D:{0:!0,2:!0},copyTexSubImage2D:{0:!0},generateMipmap:{0:!0},bindBuffer:{0:!0},bufferData:{0:!0,2:!0},bufferSubData:{0:!0},getBufferParameter:{0:!0,1:!0},pixelStorei:{0:!0,1:!0},readPixels:{4:!0,5:!0},bindRenderbuffer:{0:!0},bindFramebuffer:{0:!0},checkFramebufferStatus:{0:!0},framebufferRenderbuffer:{0:!0,1:!0,2:!0},framebufferTexture2D:{0:!0,1:!0,2:!0},getFramebufferAttachmentParameter:{0:!0,1:!0,2:!0},getRenderbufferParameter:{0:!0,1:!0},renderbufferStorage:{0:!0,1:!0},clear:{0:!0},depthFunc:{0:!0},blendFunc:{0:!0,1:!0},blendFuncSeparate:{0:!0,1:!0,2:!0,3:!0},blendEquation:{0:!0},blendEquationSeparate:{0:!0,1:!0},stencilFunc:{0:!0},stencilFuncSeparate:{0:!0,1:!0},stencilMaskSeparate:{0:!0},stencilOp:{0:!0,1:!0,2:!0},stencilOpSeparate:{0:!0,1:!0,2:!0,3:!0},cullFace:{0:!0},frontFace:{0:!0}},r=null;function n(e){if(null==r)for(var t in r={},e)"number"==typeof e[t]&&(r[e[t]]=t)}function o(){if(null==r)throw"WebGLDebugUtils.init(ctx) not called"}function i(e){o();var t=r[e];return void 0!==t?t:"*UNKNOWN WebGL ENUM (0x"+e.toString(16)+")"}function a(e,r,n){var o=t[e];return void 0!==o&&o[r]?i(n):n.toString()}function u(e){var t=e.getParameter(e.MAX_VERTEX_ATTRIBS),r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r);for(var n=0;n<t;++n)e.disableVertexAttribArray(n),e.vertexAttribPointer(n,4,e.FLOAT,!1,0,0),e.vertexAttrib1f(n,0);e.deleteBuffer(r);var o=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);for(n=0;n<o;++n)e.activeTexture(e.TEXTURE0+n),e.bindTexture(e.TEXTURE_CUBE_MAP,null),e.bindTexture(e.TEXTURE_2D,null);for(e.activeTexture(e.TEXTURE0),e.useProgram(null),e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindRenderbuffer(e.RENDERBUFFER,null),e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.DITHER),e.disable(e.SCISSOR_TEST),e.blendColor(0,0,0,0),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.clearColor(0,0,0,0),e.clearDepth(1),e.clearStencil(-1),e.colorMask(!0,!0,!0,!0),e.cullFace(e.BACK),e.depthFunc(e.LESS),e.depthMask(!0),e.depthRange(0,1),e.frontFace(e.CCW),e.hint(e.GENERATE_MIPMAP_HINT,e.DONT_CARE),e.lineWidth(1),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.UNPACK_COLORSPACE_CONVERSION_WEBGL&&e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.polygonOffset(0,0),e.sampleCoverage(1,!1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilMask(4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.viewport(0,0,e.canvas.clientWidth,e.canvas.clientHeight),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT|e.STENCIL_BUFFER_BIT);e.getError(););}return{init:n,mightBeEnum:function(e){return o(),void 0!==r[e]},glEnumToString:i,glFunctionArgToString:a,makeDebugContext:function(t,r){n(t),r=r||function(t,r,n){for(var o="",u=0;u<n.length;++u)o+=(0==u?"":", ")+a(r,u,n[u]);e("WebGL error "+i(t)+" in "+r+"("+o+")")};var o={};function u(e,t){return function(){var n=e[t].apply(e,arguments),i=e.getError();return 0!=i&&(o[i]=!0,r(i,t,arguments)),n}}var c={};for(var f in t)"function"==typeof t[f]?c[f]=u(t,f):c[f]=t[f];return c.getError=function(){for(var e in o)if(o[e])return o[e]=!1,e;return t.NO_ERROR},c},makeLostContextSimulatingContext:function(e){var t={},r=1,n=!1,o=[],i=void 0,a=void 0,c=void 0,f={};function l(e,t){var o=e[t];return function(){if(!n)return function(e){for(var t=0;t<e.length;++t){var n=e[t];if((o=n)instanceof WebGLBuffer||o instanceof WebGLFramebuffer||o instanceof WebGLProgram||o instanceof WebGLRenderbuffer||o instanceof WebGLShader||o instanceof WebGLTexture)return n.__webglDebugContextLostId__==r}var o;return!0}(arguments)?o.apply(e,arguments):void(f[e.INVALID_OPERATION]=!0)}}for(var s in e)"function"==typeof e[s]?t[s]=l(e,s):t[s]=e[s];function d(e){return{statusMessage:e}}t.loseContext=function(){if(!n){for(n=!0,++r;e.getError(););!function(){for(var e=Object.keys(f),t=0;t<e.length;++t);}(),f[e.CONTEXT_LOST_WEBGL]=!0,setTimeout(function(){i&&i(d("context lost"))},0)}},t.restoreContext=function(){if(n){if(!a)throw"You can not restore the context without a listener";setTimeout(function(){if(function(){for(var t=0;t<o.length;++t){var r=o[t];r instanceof WebGLBuffer?e.deleteBuffer(r):r instanceof WebGLFramebuffer?e.deleteFramebuffer(r):r instanceof WebGLProgram?e.deleteProgram(r):r instanceof WebGLRenderbuffer?e.deleteRenderbuffer(r):r instanceof WebGLShader?e.deleteShader(r):r instanceof WebGLTexture&&e.deleteTexture(r)}}(),u(e),n=!1,a){var t=a;a=c,c=void 0,t(d("context restored"))}},0)}},t.getError=function(){if(!n)for(;t=e.getError();)f[t]=!0;for(var t in f)if(f[t])return delete f[t],t;return e.NO_ERROR};for(var h=["createBuffer","createFramebuffer","createProgram","createRenderbuffer","createShader","createTexture"],g=0;g<h.length;++g)t[b=h[g]]=function(t){return function(){if(n)return null;var i=t.apply(e,arguments);return i.__webglDebugContextLostId__=r,o.push(i),i}}(e[b]);var m=["getActiveAttrib","getActiveUniform","getBufferParameter","getContextAttributes","getAttachedShaders","getFramebufferAttachmentParameter","getParameter","getProgramParameter","getProgramInfoLog","getRenderbufferParameter","getShaderParameter","getShaderInfoLog","getShaderSource","getTexParameter","getUniform","getUniformLocation","getVertexAttrib"];for(g=0;g<m.length;++g)t[b=m[g]]=function(t){return function(){return n?null:t.apply(e,arguments)}}(t[b]);var p,v=["isBuffer","isEnabled","isFramebuffer","isProgram","isRenderbuffer","isShader","isTexture"];for(g=0;g<v.length;++g){var b;t[b=v[g]]=function(t){return function(){return!n&&t.apply(e,arguments)}}(t[b])}function E(e){return"function"==typeof e?e:function(t){e.handleEvent(t)}}return t.checkFramebufferStatus=(p=t.checkFramebufferStatus,function(){return n?e.FRAMEBUFFER_UNSUPPORTED:p.apply(e,arguments)}),t.getAttribLocation=function(t){return function(){return n?-1:t.apply(e,arguments)}}(t.getAttribLocation),t.getVertexAttribOffset=function(t){return function(){return n?0:t.apply(e,arguments)}}(t.getVertexAttribOffset),t.isContextLost=function(){return n},t.registerOnContextLostListener=function(e){i=E(e)},t.registerOnContextRestoredListener=function(e){n?c=E(e):a=E(e)},t},resetToInitialState:u}}();function i(e,t,r){var n=function(e,t,r){var n=a(e,e.VERTEX_SHADER,t),o=a(e,e.FRAGMENT_SHADER,r);if(!n||!o)return null;var i=e.createProgram();if(!i)return null;if(e.attachShader(i,n),e.attachShader(i,o),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS)){var u=e.getProgramInfoLog(i);return console.log("Failed to link program: "+u),e.deleteProgram(i),e.deleteShader(o),e.deleteShader(n),null}return i}(e,t,r);return n?(e.useProgram(n),e.program=n,!0):(console.log("Failed to create program"),!1)}function a(e,t,r){var n=e.createShader(t);if(null==n)return console.log("unable to create shader"),null;if(e.shaderSource(n,r),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS)){var o=e.getShaderInfoLog(n);return console.log("Failed to compile shader: "+o),e.deleteShader(n),null}return n}function u(e,t){var r=n.setupWebGL(e);return r?((arguments.length<2||t)&&(r=o.makeDebugContext(r)),r):null}r.d(t,"b",function(){return i}),r.d(t,"a",function(){return u})},13:function(e,t,r){"use strict";r.d(t,"f",function(){return n}),r.d(t,"g",function(){return i}),r.d(t,"e",function(){return c}),r.d(t,"d",function(){return f}),r.d(t,"a",function(){return s}),r.d(t,"c",function(){return d}),r.d(t,"b",function(){return h});var n=function(e){return e},o=function(e){return new Promise(function(t,r){var n=new Image;n.onload=function(){return t(n)},n.onerror=function(e){return r(e)},n.src=e})},i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return Promise.all(e.map(o))},a=function(e,t){return(t-e.left-e.width/2)/(e.width/2)},u=function(e,t){return(e.height/2-(t-e.top))/(e.height/2)},c=function(e,t){var r=e.getBoundingClientRect();return[a(r,t.clientX),u(r,t.clientY)]},f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return new Float32Array(e.flat(1/0))},l=function(e){var t=[[],[],[],[]],r=!0,n=!1,o=void 0;try{for(var i,a=e[Symbol.iterator]();!(r=(i=a.next()).done);r=!0){var u=i.value;t[0].push(u[0]),t[1].push(u[1]),t[2].push(u[2]),t[3].push(u[3])}}catch(c){n=!0,o=c}finally{try{r||null==a.return||a.return()}finally{if(n)throw o}}return new Float32Array(t.flat())},s=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:0)*Math.PI/180,t=Math.sin(e),r=Math.cos(e);return l([[r,-t,0,0],[t,r,0,0],[0,0,1,0],[0,0,0,1]])},d=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return l([[1,0,0,e],[0,1,0,t],[0,0,1,r],[0,0,0,1]])},h=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return l([[e,0,0,0],[0,t,0,0],[0,0,r,0],[0,0,0,1]])}},30:function(e,t,r){e.exports=r(31)},31:function(e,t,r){var n=function(){return this||"object"===typeof self&&self}()||Function("return this")(),o=n.regeneratorRuntime&&Object.getOwnPropertyNames(n).indexOf("regeneratorRuntime")>=0,i=o&&n.regeneratorRuntime;if(n.regeneratorRuntime=void 0,e.exports=r(32),o)n.regeneratorRuntime=i;else try{delete n.regeneratorRuntime}catch(a){n.regeneratorRuntime=void 0}},32:function(e,t){!function(t){"use strict";var r,n=Object.prototype,o=n.hasOwnProperty,i="function"===typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",u=i.asyncIterator||"@@asyncIterator",c=i.toStringTag||"@@toStringTag",f="object"===typeof e,l=t.regeneratorRuntime;if(l)f&&(e.exports=l);else{(l=t.regeneratorRuntime=f?e.exports:{}).wrap=w;var s="suspendedStart",d="suspendedYield",h="executing",g="completed",m={},p={};p[a]=function(){return this};var v=Object.getPrototypeOf,b=v&&v(v(O([])));b&&b!==n&&o.call(b,a)&&(p=b);var E=T.prototype=x.prototype=Object.create(p);_.prototype=E.constructor=T,T.constructor=_,T[c]=_.displayName="GeneratorFunction",l.isGeneratorFunction=function(e){var t="function"===typeof e&&e.constructor;return!!t&&(t===_||"GeneratorFunction"===(t.displayName||t.name))},l.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,T):(e.__proto__=T,c in e||(e[c]="GeneratorFunction")),e.prototype=Object.create(E),e},l.awrap=function(e){return{__await:e}},L(A.prototype),A.prototype[u]=function(){return this},l.AsyncIterator=A,l.async=function(e,t,r,n){var o=new A(w(e,t,r,n));return l.isGeneratorFunction(t)?o:o.next().then(function(e){return e.done?e.value:o.next()})},L(E),E[c]="Generator",E[a]=function(){return this},E.toString=function(){return"[object Generator]"},l.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},l.values=O,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(S),!e)for(var t in this)"t"===t.charAt(0)&&o.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=r)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(n,o){return u.type="throw",u.arg=e,t.next=n,o&&(t.method="next",t.arg=r),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],u=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var c=o.call(a,"catchLoc"),f=o.call(a,"finallyLoc");if(c&&f){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!f)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var i=n;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),m},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),S(r),m}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;S(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,n){return this.delegate={iterator:O(e),resultName:t,nextLoc:n},"next"===this.method&&(this.arg=r),m}}}function w(e,t,r,n){var o=t&&t.prototype instanceof x?t:x,i=Object.create(o.prototype),a=new P(n||[]);return i._invoke=function(e,t,r){var n=s;return function(o,i){if(n===h)throw new Error("Generator is already running");if(n===g){if("throw"===o)throw i;return C()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var u=R(a,r);if(u){if(u===m)continue;return u}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===s)throw n=g,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=h;var c=y(e,t,r);if("normal"===c.type){if(n=r.done?g:d,c.arg===m)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(n=g,r.method="throw",r.arg=c.arg)}}}(e,r,a),i}function y(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(n){return{type:"throw",arg:n}}}function x(){}function _(){}function T(){}function L(e){["next","throw","return"].forEach(function(t){e[t]=function(e){return this._invoke(t,e)}})}function A(e){var t;this._invoke=function(r,n){function i(){return new Promise(function(t,i){!function t(r,n,i,a){var u=y(e[r],e,n);if("throw"!==u.type){var c=u.arg,f=c.value;return f&&"object"===typeof f&&o.call(f,"__await")?Promise.resolve(f.__await).then(function(e){t("next",e,i,a)},function(e){t("throw",e,i,a)}):Promise.resolve(f).then(function(e){c.value=e,i(c)},function(e){return t("throw",e,i,a)})}a(u.arg)}(r,n,t,i)})}return t=t?t.then(i,i):i()}}function R(e,t){var n=e.iterator[t.method];if(n===r){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=r,R(e,t),"throw"===t.method))return m;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return m}var o=y(n,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,m;var i=o.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=r),t.delegate=null,m):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,m)}function F(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function S(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function P(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(F,this),this.reset(!0)}function O(e){if(e){var t=e[a];if(t)return t.call(e);if("function"===typeof e.next)return e;if(!isNaN(e.length)){var n=-1,i=function t(){for(;++n<e.length;)if(o.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}return{next:C}}function C(){return{value:r,done:!0}}}(function(){return this||"object"===typeof self&&self}()||Function("return this")())},33:function(e,t,r){"use strict";function n(e,t,r,n,o,i,a){try{var u=e[i](a),c=u.value}catch(f){return void r(f)}u.done?t(c):Promise.resolve(c).then(n,o)}function o(e){return function(){var t=this,r=arguments;return new Promise(function(o,i){var a=e.apply(t,r);function u(e){n(a,o,i,u,c,"next",e)}function c(e){n(a,o,i,u,c,"throw",e)}u(void 0)})}}r.d(t,"a",function(){return o})},34:function(e,t,r){"use strict";function n(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}r.d(t,"a",function(){return n})},35:function(e,t,r){e.exports=r.p+"static/media/sky.2b11efd6.jpg"},36:function(e,t,r){e.exports=r.p+"static/media/circle.def06678.gif"},72:function(e,t,r){"use strict";r.r(t),r.d(t,"default",function(){return b});var n=r(30),o=r.n(n),i=r(1),a=r(33),u=r(34),c=r(0),f=r.n(c),l=r(12),s=r(13),d=r(35),h=r.n(d),g=r(36),m=r.n(g);function p(){var e=Object(u.a)(["\n      precision mediump float;\n      varying vec2 v_TexCoor;\n      uniform sampler2D u_Sampler0;\n      uniform sampler2D u_Sampler1;\n      void main() {\n        vec4 color0 = texture2D(u_Sampler0, v_TexCoor);\n        vec4 color1 = texture2D(u_Sampler1, v_TexCoor);\n        gl_FragColor = color0 * color1;\n      }\n    "]);return p=function(){return e},e}function v(){var e=Object(u.a)(["\n      attribute vec4 a_Position;\n      attribute vec2 a_TexCoor;\n      varying vec2 v_TexCoor;\n      void main() {\n        gl_Position = a_Position;\n        v_TexCoor = a_TexCoor;\n      }\n    "]);return v=function(){return e},e}function b(){var e=Object(c.useRef)();return Object(c.useEffect)(function(){var t=e.current,r=Object(l.a)(t),n=Object(s.f)(v()),u=Object(s.f)(p());if(!Object(l.b)(r,n,u))throw new Error("failed to initilize shaders");var c=r.getAttribLocation(r.program,"a_Position"),f=r.getAttribLocation(r.program,"a_TexCoor"),d=Object(s.d)([[[-.5,.5],[0,1]],[[-.5,-.5],[0,0]],[[.5,.5],[1,1]],[[.5,-.5],[1,0]]]),g=d.BYTES_PER_ELEMENT,b=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,b),r.bufferData(r.ARRAY_BUFFER,d,r.STATIC_DRAW),r.vertexAttribPointer(c,2,r.FLOAT,!1,4*g,0),r.enableVertexAttribArray(c),r.vertexAttribPointer(f,2,r.FLOAT,!1,4*g,2*g),r.enableVertexAttribArray(f);var E=function(e,t,n){var o=r.createTexture();r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,1),r.activeTexture(r["TEXTURE".concat(t)]),r.bindTexture(r.TEXTURE_2D,o),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,e),r.uniform1i(n,t)};(function(){var e=Object(a.a)(o.a.mark(function e(){var t,n,a,u,c,f,l;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=[h.a,m.a],e.next=3,Object(s.g)(t);case 3:n=e.sent,a=Object(i.a)(n,2),u=a[0],c=a[1],f=r.getUniformLocation(r.program,"u_Sampler0"),l=r.getUniformLocation(r.program,"u_Sampler1"),E(u,0,f),E(c,1,l),r.clearColor(0,0,0,1),r.clear(r.COLOR_BUFFER_BIT),r.drawArrays(r.TRIANGLE_STRIP,0,4);case 14:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}})()()},[]),f.a.createElement("canvas",{width:400,height:400,ref:e})}}}]);
//# sourceMappingURL=4.859c42a4.chunk.js.map