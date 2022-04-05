/*!
 * Tiny Permanent Pen plugin
 *
 * Copyright 2010-2021 Tiny Technologies, Inc. All rights reserved.
 *
 * Version: 1.1.0-24
 */
!function(u){"use strict";function r(e){return parseInt(e,10)}function i(e,n){var r=e-n;return 0==r?0:0<r?1:-1}function t(e,n,r){return{major:e,minor:n,patch:r}}function o(e){var n=/([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(e);return n?t(r(n[1]),r(n[2]),r(n[3])):t(0,0,0)}function a(e,n){return!!e&&-1===function(e,n){var r=i(e.major,n.major);if(0!==r)return r;var t=i(e.minor,n.minor);if(0!==t)return t;var o=i(e.patch,n.patch);return 0!==o?o:0}(o([(r=e).majorVersion,r.minorVersion].join(".").split(".").slice(0,3).join(".")),o(n));var r}function y(e){return function(){return e}}function e(){return v}var n,s,c,f=function(e){function n(){return r}var r=e;return{get:n,set:function(e){r=e},clone:function(){return f(r)}}},l=(n="function",function(e){return function(e){if(null===e)return"null";var n=typeof e;return"object"==n&&(Array.prototype.isPrototypeOf(e)||e.constructor&&"Array"===e.constructor.name)?"array":"object"==n&&(String.prototype.isPrototypeOf(e)||e.constructor&&"String"===e.constructor.name)?"string":n}(e)===n}),m=Object.prototype.hasOwnProperty,p=function(){for(var e=new Array(arguments.length),n=0;n<e.length;n++)e[n]=arguments[n];if(0===e.length)throw new Error("Can't merge zero objects");for(var r={},t=0;t<e.length;t++){var o=e[t];for(var i in o)m.call(o,i)&&(r[i]=s(r[i],o[i]))}return r},g=y(!(s=function(e,n){return n})),d=y(!0),v=(c={fold:function(e,n){return e()},is:g,isSome:g,isNone:d,getOr:x,getOrThunk:b,getOrDie:function(e){throw new Error(e||"error: getOrDie called on none.")},getOrNull:y(null),getOrUndefined:y(void 0),or:x,orThunk:b,map:e,each:function(){},bind:e,exists:g,forall:d,filter:e,equals:h,equals_:h,toArray:function(){return[]},toString:y("none()")},Object.freeze&&Object.freeze(c),c);function h(e){return e.isNone()}function b(e){return e()}function x(e){return e}function S(e){return H.from(e.getParam("permanentpen_properties")).map(function(e){return p(J,e)}).getOr(J)}function O(e){return e.getParam("font_formats","Andale Mono=andale mono,monospace;Arial=arial,helvetica,sans-serif;Arial Black=arial black,sans-serif;Book Antiqua=book antiqua,palatino,serif;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier,monospace;Georgia=georgia,palatino,serif;Helvetica=helvetica,arial,sans-serif;Impact=impact,sans-serif;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco,monospace;Times New Roman=times new roman,times,serif;Trebuchet MS=trebuchet ms,geneva,sans-serif;Verdana=verdana,geneva,sans-serif;Webdings=webdings;Wingd0ings=wingdings,zapf dingbats","hash","string")}function P(e){return e.getParam("fontsize_formats","8pt 10pt 12pt 14pt 18pt 24pt 36pt","string").split(/[, ]/)}function w(e,n){return r=e,t=n,-1<Y.call(r,t);var r,t}function C(e,n){for(var r=0,t=e.length;r<t;r++){n(e[r],r)}}function k(e,r){var t=[];return function(e,n){for(var r=Z(e),t=0,o=r.length;t<o;t++){var i=r[t];n(e[i],i)}}(e,function(e,n){t.push(r(e,n))}),t}function T(e){return function(e,n){for(var r=e.length,t=new Array(r),o=0;o<r;o++){var i=e[o];t[o]=n(i,o)}return t}(P(e),function(e){return{text:e,value:e}})}function A(e){var n=T(e);return{type:"panel",items:[{type:"selectbox",name:"fontname",label:"Font",items:k(O(e),function(e,n){return{text:n,value:e}})},{type:"selectbox",name:"fontsize",label:"Size",items:n},{type:"label",label:"Styles",items:[{type:"bar",items:[{type:"checkbox",name:"bold",label:"Bold"},{type:"checkbox",name:"italic",label:"Italic"},{type:"checkbox",name:"strikethrough",label:"Strikethrough"},{type:"checkbox",name:"underline",label:"Underline"}]}]},{name:"forecolor",type:"colorinput",label:"Text color"},{name:"hilitecolor",type:"colorinput",label:"Background color"}]}}function R(t,o){t.windowManager.open({title:"Permanent Pen Properties",size:"normal",body:A(t),onSubmit:function(e){var n,r=e.getData();o.set(r),n=r,t.fire("PermanentPenProperties",{properties:n}),e.close()},buttons:[{type:"cancel",name:"cancel",text:"Cancel"},{type:"submit",name:"save",text:"Save",primary:!0}],initialData:o.get()})}function E(r,e,t,o){r.addCommand("mceConfigurePermanentPen",function(){R(r,e)}),r.addCommand("mceTogglePermanentPen",function(){var e,n=!t.get();e=n,r.fire("PermanentPenToggle",{state:e}),t.set(n),n?o.enterPermaPenMode():o.leavePermaPenMode()})}function j(r){r.ui.registry.addToggleButton("permanentpen",{icon:"permanent-pen",tooltip:"Permanent pen",onAction:function(){return r.execCommand("mceTogglePermanentPen")},onSetup:function(n){function e(e){n.setActive(e.state)}return r.on("PermanentPenToggle",e),function(){return r.off("PermanentPenToggle",e)}}})}function M(e,n,r){if(!function(e,n){for(var r=0,t=e.length;r<t;r++){if(n(e[r],r))return!0}return!1}(n,function(e){return e===r})){var t=(o=function(e,n){return e+'"'+n+'" '},i="TinyMCE PermanentPen permanentpen_properties."+e+': "'+r+'" not found. Possible values are: ',C(n,function(e){i=o(i,e)}),i);u.console.log(t)}var o,i}function z(e){var n,r=S(e);M("fontsize",P(e),r.fontsize),M("fontname",(n=O(e),k(n,function(e){return e})),r.fontname)}function N(){return e=function(e){e.unbind()},r=f(H.none()),{clear:function(){n(),r.set(H.none())},isSet:function(){return r.get().isSome()},set:function(e){n(),r.set(H.some(e))}};function n(){r.get().each(e)}var e,r}function I(e,n){var r=function(e,n){for(var r=0;r<e.length;r++){var t=e[r];if(t.test(n))return t}}(e,n);if(!r)return{major:0,minor:0};function t(e){return Number(n.replace(r,"$"+e))}return re(t(1),t(2))}function _(e,n){return function(){return n===e}}function D(e,n){return function(){return n===e}}function B(e,n){var r=String(n).toLowerCase();return function(e,n){for(var r=0,t=e.length;r<t;r++){var o=e[r];if(n(o,r))return H.some(o)}return H.none()}(e,function(e){return e.search(r)})}function q(e,n){return-1!==e.indexOf(n)}function F(n){return function(e){return q(e,n)}}function L(e,n,r){if(s=e,!function(e,n){for(var r=0,t=e.length;r<t;++r)if(!0!==n(e[r],r))return;return 1}(n,function(e){return s.formatter.match(e.formatName,e.values)})){var t=e.selection.getRng();t.setStart(t.startContainer,t.startOffset-r.length),e.selection.setRng(t),e.formatter.remove("removeformat"),u=e,C(n,function(e){u.formatter.apply(e.formatName,e.values)}),o=e.selection,i=r.length,(a=o.getRng().cloneRange()).setEnd(a.startContainer,a.startOffset+i),a.setStart(a.startContainer,a.startOffset+i),o.setRng(a)}var o,i,a,u,s}function W(e,n){return w(["bold","italic","underline","strikethrough"],n)&&e?H.some({formatName:n,values:{}}):w(["forecolor","hilitecolor","fontname","fontsize"],n)&&0<e.length?H.some({formatName:n,values:{value:e}}):H.none()}function V(e){return!e.isComposing&&("insertText"===e.inputType||"compositionend"===e.type)&&null!==e.data&&0<e.data.length}function X(t,o,i,a){t.undoManager.ignore(function(){var e,n,r;"Apply"===a?L(t,function(e){for(var n=[],r=function(e){n.push(e)},t=0;t<e.length;t++)e[t].each(r);return n}(k(o,W)),i.data):(e=t,n=i.data,(r=e.selection.getRng()).setStart(r.startContainer,r.startOffset-n.length),e.selection.setRng(r),e.formatter.remove("removeformat"),e.selection.collapse(!1))})}function K(r,t){var o,i,a,e=(o=function(e){var n=String.fromCharCode(e.charCode);r.composing||e.altKey||e.ctrlKey||e.metaKey||!n||t(ee(ee({},e),{data:n,isComposing:!1,inputType:"insertText"}))},i=0,a=null,{cancel:function(){null!==a&&(u.clearTimeout(a),a=null)},throttle:function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];null===a&&(a=u.setTimeout(function(){o.apply(null,e),a=null},i))}});return r.on("keypress",e.throttle),r.on("remove",e.cancel),{unbind:function(){e.cancel(),r.off("keypress",e.throttle),r.off("remove",e.cancel)}}}function U(n,r){function t(e){V(e)&&X(n,r.get(),e,"Apply")}function e(){s(t),s(u)}var o=xe.get().browser,i=N(),a=N(),u=function(e){V(e)&&(X(n,r.get(),e,"Remove"),s(u))},s=function(e){n.off("input compositionend",e),e===t?i.clear():e===u&&(n.off("nodechange",c),a.clear())},c=function(){n.composing||s(u)};return{enterPermaPenMode:function(){e(),n.on("input compositionend",t),(o.isIE()||o.isEdge())&&i.set(K(n,t))},leavePermaPenMode:function(){e(),n.once("input compositionend",u),(o.isIE()||o.isEdge())&&a.set(K(n,u)),n.on("nodechange",c)}}}function $(e){if(a(tinymce,"5.0.0"))return u.console.error("The permanentpen plugin requires at least version 5.0.0 of TinyMCE"),{};z(e);var n,r,t=f(!1),o=f(S(e)),i=U(e,o);E(e,o,t,i),(n=e).ui.registry.addMenuItem("configurepermanentpen",{icon:"permanent-pen",text:"Permanent pen properties...",onAction:function(){return n.execCommand("mceConfigurePermanentPen")}}),n.ui.registry.addMenuItem("permanentpen",{icon:"permanent-pen",text:"Permanent pen",onAction:function(){return n.execCommand("mceTogglePermanentPen")}}),j(e),r=t,e.ui.registry.addContextMenu("configurepermanentpen",{update:function(){return r.get()?["configurepermanentpen"]:[]}})}var G=function(r){function e(){return o}function n(e){return e(r)}var t=y(r),o={fold:function(e,n){return n(r)},is:function(e){return r===e},isSome:d,isNone:g,getOr:t,getOrThunk:t,getOrDie:t,getOrNull:t,getOrUndefined:t,or:e,orThunk:e,map:function(e){return G(e(r))},each:function(e){e(r)},bind:n,exists:n,forall:n,filter:function(e){return e(r)?o:v},toArray:function(){return[r]},toString:function(){return"some("+r+")"},equals:function(e){return e.is(r)},equals_:function(e,n){return e.fold(g,function(e){return n(r,e)})}};return o},H={some:G,none:e,from:function(e){return null==e?v:G(e)}},J={fontname:"arial,helvetica,sans-serif",forecolor:"#E74C3C",fontsize:"12pt",hilitecolor:"",bold:!0,italic:!1,underline:!1,strikethrough:!1},Q=Array.prototype.slice,Y=Array.prototype.indexOf,Z=(l(Array.from)&&Array.from,Object.keys),ee=function(){return(ee=Object.assign||function(e){for(var n,r=1,t=arguments.length;r<t;r++)for(var o in n=arguments[r])Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);return e}).apply(this,arguments)},ne=function(){return re(0,0)},re=function(e,n){return{major:e,minor:n}},te={nu:re,detect:function(e,n){var r=String(n).toLowerCase();return 0===e.length?ne():I(e,r)},unknown:ne},oe="Firefox",ie=function(e){var n=e.current;return{current:n,version:e.version,isEdge:_("Edge",n),isChrome:_("Chrome",n),isIE:_("IE",n),isOpera:_("Opera",n),isFirefox:_(oe,n),isSafari:_("Safari",n)}},ae={unknown:function(){return ie({current:void 0,version:te.unknown()})},nu:ie,edge:y("Edge"),chrome:y("Chrome"),ie:y("IE"),opera:y("Opera"),firefox:y(oe),safari:y("Safari")},ue="Windows",se="Android",ce="Solaris",fe="FreeBSD",le="ChromeOS",me=function(e){var n=e.current;return{current:n,version:e.version,isWindows:D(ue,n),isiOS:D("iOS",n),isAndroid:D(se,n),isOSX:D("OSX",n),isLinux:D("Linux",n),isSolaris:D(ce,n),isFreeBSD:D(fe,n),isChromeOS:D(le,n)}},pe={unknown:function(){return me({current:void 0,version:te.unknown()})},nu:me,windows:y(ue),ios:y("iOS"),android:y(se),linux:y("Linux"),osx:y("OSX"),solaris:y(ce),freebsd:y(fe),chromeos:y(le)},ge=function(e,r){return B(e,r).map(function(e){var n=te.detect(e.versionRegexes,r);return{current:e.name,version:n}})},de=function(e,r){return B(e,r).map(function(e){var n=te.detect(e.versionRegexes,r);return{current:e.name,version:n}})},ve=/.*?version\/\ ?([0-9]+)\.([0-9]+).*/,he=[{name:"Edge",versionRegexes:[/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],search:function(e){return q(e,"edge/")&&q(e,"chrome")&&q(e,"safari")&&q(e,"applewebkit")}},{name:"Chrome",versionRegexes:[/.*?chrome\/([0-9]+)\.([0-9]+).*/,ve],search:function(e){return q(e,"chrome")&&!q(e,"chromeframe")}},{name:"IE",versionRegexes:[/.*?msie\ ?([0-9]+)\.([0-9]+).*/,/.*?rv:([0-9]+)\.([0-9]+).*/],search:function(e){return q(e,"msie")||q(e,"trident")}},{name:"Opera",versionRegexes:[ve,/.*?opera\/([0-9]+)\.([0-9]+).*/],search:F("opera")},{name:"Firefox",versionRegexes:[/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],search:F("firefox")},{name:"Safari",versionRegexes:[ve,/.*?cpu os ([0-9]+)_([0-9]+).*/],search:function(e){return(q(e,"safari")||q(e,"mobile/"))&&q(e,"applewebkit")}}],ye=[{name:"Windows",search:F("win"),versionRegexes:[/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]},{name:"iOS",search:function(e){return q(e,"iphone")||q(e,"ipad")},versionRegexes:[/.*?version\/\ ?([0-9]+)\.([0-9]+).*/,/.*cpu os ([0-9]+)_([0-9]+).*/,/.*cpu iphone os ([0-9]+)_([0-9]+).*/]},{name:"Android",search:F("android"),versionRegexes:[/.*?android\ ?([0-9]+)\.([0-9]+).*/]},{name:"OSX",search:F("mac os x"),versionRegexes:[/.*?mac\ os\ x\ ?([0-9]+)_([0-9]+).*/]},{name:"Linux",search:F("linux"),versionRegexes:[]},{name:"Solaris",search:F("sunos"),versionRegexes:[]},{name:"FreeBSD",search:F("freebsd"),versionRegexes:[]},{name:"ChromeOS",search:F("cros"),versionRegexes:[/.*?chrome\/([0-9]+)\.([0-9]+).*/]}],be={browsers:y(he),oses:y(ye)},xe=f(function(e,n){var r,t,o,i,a,u,s,c,f,l,m,p,g=be.browsers(),d=be.oses(),v=ge(g,e).fold(ae.unknown,ae.nu),h=de(d,e).fold(pe.unknown,pe.nu);return{browser:v,os:h,deviceType:(t=v,o=e,i=n,a=(r=h).isiOS()&&!0===/ipad/i.test(o),u=r.isiOS()&&!a,s=r.isiOS()||r.isAndroid(),c=s||i("(pointer:coarse)"),f=a||!u&&s&&i("(min-device-width:768px)"),l=u||s&&!f,m=t.isSafari()&&r.isiOS()&&!1===/safari/i.test(o),p=!l&&!f&&!m,{isiPad:y(a),isiPhone:y(u),isTablet:y(f),isPhone:y(l),isTouch:y(c),isAndroid:r.isAndroid,isiOS:r.isiOS,isWebView:y(m),isDesktop:y(p)})}}(u.navigator.userAgent,function(e){return u.window.matchMedia(e).matches}));tinymce.PluginManager.add("permanentpen",$)}(window);