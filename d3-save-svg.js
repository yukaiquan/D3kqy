!function (e, t) { "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define("d3-save-svg", ["exports"], t) : t(e.d3_save_svg = {}) }(this, function (e) { "use strict"; function t (e, t) { window.URL = window.URL || window.webkitURL; var n = new Blob(e.source, { type: "text/xml" }), i = window.URL.createObjectURL(n), o = document.body, r = document.createElement("a"); o.appendChild(r), r.setAttribute("download", t + ".svg"), r.setAttribute("href", i), r.style.display = "none", r.click(), r.parentNode.removeChild(r), setTimeout(function () { window.URL.revokeObjectURL(i) }, 10) } function n (e) { function t (e) { var t, n, i, r, s = window.getComputedStyle(e), a = ""; for (t = 0, n = s.length; n > t; t++)i = s[t], r = s.getPropertyValue(i), r !== o.getPropertyValue(i) && "height" !== i && "width" !== i && (a += i + ":" + r + ";"); e.setAttribute("style", a) } function n (e) { function t (e) { if (e && e.hasChildNodes()) for (var i = e.firstChild; i;)1 === i.nodeType && "SCRIPT" != i.nodeName && (n.push(i), t(i)), i = i.nextSibling } var n = []; return n.push(e), t(e), n } var i = window.document.createElementNS(u.svg, "svg"); window.document.body.appendChild(i); for (var o = window.getComputedStyle(i), r = n(e), s = r.length; s--;)t(r[s]); i.parentNode.removeChild(i) } function i (e) { e.setAttribute("version", "1.1"), e.removeAttribute("xmlns"), e.removeAttribute("xlink"), e.hasAttributeNS(u.xmlns, "xmlns") || e.setAttributeNS(u.xmlns, "xmlns", u.svg), e.hasAttributeNS(u.xmlns, "xmlns:xlink") || e.setAttributeNS(u.xmlns, "xmlns:xlink", u.xlink), n(e); var t = new XMLSerializer, i = t.serializeToString(e), o = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', r = e.getBoundingClientRect(), s = { top: r.top, left: r.left, width: r.width, height: r.height, "class": e.getAttribute("class"), id: e.getAttribute("id"), childElementCount: e.childElementCount, source: [o + i] }; return s } function o (e) { for (var t = new Uint8Array(e), n = t.length, i = []; n--;)i[n] = String.fromCharCode(t[n]); var o = window.btoa(i.join("")); return o } function r (e, t) { var n, i = new XMLHttpRequest(e); i.open("GET", e, !0), i.responseType = "arraybuffer", i.callback = t, i.onload = function () { n = o(this.response), this.callback(null, n) }, i.onerror = function () { t("B64 ERROR", null) }, i.send() } function s (e) { var t = /^\s*data:([a-z]+\/[a-z0-9\-]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i; return !!e.match(t) } function a (e, n) { if ("svg" !== e.nodeName || 1 !== e.nodeType) throw "Need an svg element input"; var n = n || {}, o = i(e, n), r = d(o), s = n.filename || r, o = i(e); t(o, s) } function l (e) { var t = e.querySelectorAll("image");[].forEach.call(t, function (e) { var t = e.getAttribute("href"); s(t) || r(t, function (t, n) { e.setAttributeNS(u.xlink, "href", "data:image/png;base64," + n) }) }) } function d (e) { var t = "untitled"; return e.id ? t = e.id : e["class"] ? t = e["class"] : window.document.title && (t = window.document.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()), t } var u = { svg: "http://www.w3.org/2000/svg", xhtml: "http://www.w3.org/1999/xhtml", xlink: "http://www.w3.org/1999/xlink", xml: "http://www.w3.org/XML/1998/namespace", xmlns: "http://www.w3.org/2000/xmlns/" }, w = "0.0.2"; e.version = w, e.save = a, e.embedRasterImages = l });
