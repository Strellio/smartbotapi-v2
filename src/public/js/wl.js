var WIDGET_URL =
  "https://smartbotwidget.strellio.co" ||
  "https://smartbot-widget.serveo.net" ||
  "https://widgetv2.onrender.com" ||
  "https://smartbotwidget.com";
function getParams(scriptName) {
  var _a, _b, _c, _d;
  var script = document.getElementsByTagName("script");
  for (var i = 0; i < script.length; i++) {
    if (script[i].src.indexOf("/" + scriptName) > -1) {
      var params =
        (_d =
          (_c =
            (_b =
              (_a = script[i]) === null || _a === void 0 ? void 0 : _a.src) ===
              null || _b === void 0
              ? void 0
              : _b.split("?")) === null || _c === void 0
            ? void 0
            : _c.pop()) === null || _d === void 0
          ? void 0
          : _d.split("&");
      var fullParams = {};
      for (var j = 0; j < params.length; j++) {
        var singleParam = params[j].split("=");
        fullParams[singleParam[0]] = singleParam[1];
      }
      return fullParams;
    }
  }
  return {};
}
function getParameter(url, param) {
  var urlSplit = url.split("?");
  var pattern = new RegExp(param + "=(.*?)(;|&|$)", "gi");
  if (urlSplit[1]) {
    return urlSplit[1].split(pattern)[1];
  }
}
function addJsScriptToHeader(src) {
  var script = document.createElement("script");
  var head = document.getElementsByTagName("head")[0];
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", src);
  head.appendChild(script);
}
function addCssScriptToHeader(src) {
  var link = document.createElement("link");
  var head = document.getElementsByTagName("head")[0];
  link.setAttribute("type", "text/css");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", src);
  head.appendChild(link);
}
var thisWindow = window;
thisWindow.smartbotBotScript = Object.assign(
  {},
  {
    token: getParameter(location.href, "token"),
  },
  getParams("js/wl")
);
var jsSrc = WIDGET_URL + "/smartbot-widget.min.js";
var cssSrc = WIDGET_URL + "/smartbot-widget.min.css";

function addWidgetRoot() {
  var body = document.getElementsByTagName("body")[0];

  var chatWidget = document.getElementById("chat-widget");

  if (chatWidget) return;

  const el = document.createElement("div");

  // ✅ Set ID attribute on the element
  el.setAttribute("id", "chat-widget");

  body.appendChild(el);
}

addWidgetRoot();

addCssScriptToHeader(cssSrc);
addJsScriptToHeader(jsSrc);
