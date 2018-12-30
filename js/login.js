var _register = "https://member.meizu.com/register?lang=&service=www&appuri=http%3A%2F%2Fwww.meizu.com%2Faccounts%2Flogin&useruri=" + encodeURIComponent(window.location.href);
var _login = "https://member.meizu.com/login/login.html?lang=&service=www&appuri=http%3A%2F%2Fwww.meizu.com%2Faccounts%2Flogin&useruri=" + encodeURIComponent(window.location.href);

function getCookie(objName) {
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName)
            return unescape(temp[1]);
    }
}

var _isLogin = getCookie("_islogin");
if (_isLogin === 'true') {
    window.document.write("<script src='https://member.meizu.com/service/accounts/fetchOrder.jsonp?callback=getFlymeAndOrderNumber&v=" + Math.random() + "'><\/script>");
} else {
    window.document.getElementById("_islogin").style.display = 'none';
    window.document.getElementById("_unlogin").style.display = 'block';
}

function getFlymeAndOrderNumber(data) {
        if (typeof (data) !== 'undefined' && data) {
            if (typeof (data['reply']) !== 'undefined' && data['reply']) {
                var _reply = data['reply'];
                if (typeof (_reply['error']) !== 'undefined') {
                    window.document.getElementById('_unlogin').style.display = 'inline-block';
                    window.document.getElementById('_islogin').style.display = 'none';
                } else {
                    window.document.getElementById('_unlogin').style.display = 'none';
                    window.document.getElementById('_islogin').style.display = 'inline-block';
                    if (typeof (_reply['flyme']) !== 'undefined' && _reply['flyme'] !== '') {
                        window.document.getElementById("mzCustName").title = _reply['flyme'];
                        window.document.getElementById("mzCustName").innerHTML = __Sub(_reply['flyme'],4);
                    }
                }
            }
        }
    }

function __Sub(str, n) {
    var strReg = /[^\x00-\xff]/g;
    var _str = str.replace(strReg, "**");
    var _len = _str.length;
    if (_len > n) {
        var _newLen = Math.floor(n / 2);
        var _strLen = str.length;
        for (var i = _newLen; i < _strLen; i++) {
            var _newStr = str.substr(0, i).replace(strReg, "**");
            if (_newStr.length >= n) {
                return str.substr(0, i) + "...";
                break;
            }
        }
    } else {
        return str;
    }
}