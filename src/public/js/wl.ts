
const WIDGET_URL = 'https://smartbotwidget.strellio.com' || 'https://smartbotwidget.com'


function getParams(scriptName: string) {
    var script = document.getElementsByTagName("script");
    for (var i = 0; i < script.length; i++) {
        if (script[i].src.indexOf("/" + scriptName) > -1) {
            var params: any = script[i]?.src?.split("?")?.pop()?.split("&");
            var fullParams: any = {};
            for (var j = 0; j < params.length; j++) {
                var singleParam = params[j].split("=");
                fullParams[singleParam[0]] = singleParam[1];
            }
            return fullParams;
        }
    }
    return {};
}

function getParameter(url: string, param: string) {
    const urlSplit = url.split('?')
    const pattern = new RegExp(param + '=(.*?)(;|&|$)', 'gi')
    if (urlSplit[1]) {
        return urlSplit[1].split(pattern)[1]
    }
}


function addJsScriptToHeader(src: string) {
    const script = document.createElement('script')
    const head = document.getElementsByTagName('head')[0]
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', src)
    head.appendChild(script)
}

function addCssScriptToHeader(src: string) {
    const link = document.createElement("link")
    const head = document.getElementsByTagName('head')[0]
    link.setAttribute('type', 'text/css')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', src)
    head.appendChild(link)
}



const thisWindow: any = window
thisWindow.smartbotBotScript = Object.assign({}, {
    token: getParameter(location.href, "token"),
}, getParams("js/wl"))

const jsSrc = `${WIDGET_URL}/smartbot-widget.min.js`
const cssSrc = `${WIDGET_URL}/smartbot-widget.min.css`
addCssScriptToHeader(cssSrc)
addJsScriptToHeader(jsSrc)
