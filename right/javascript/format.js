// Decodes data received
function decode(content) {
    var lsRegExp = /%20/g;
    var lsRegExp2 = /%2B/g;

    content = String(unescape(content)).replace(lsRegExp, " ");
    content = content.replace(lsRegExp2, "+");

    return content;
}

// Encodes data to be sent
function encode(content) {
    var lsRegExp = new RegExp(" ", "gim");
    var lsRegExp2 = /\+/g;

    content = String(escape(content)).replace(lsRegExp, "%20");
    content = content.replace(lsRegExp2, "%2B");

    return content;
}

// Formats the data into a basic json format
function toJSON(content) {
    var jsonObj = {};

    jsonObj.name = "BeginToReason";
    jsonObj.pkg = "User";
    jsonObj.project = "Teaching_Project";
    jsonObj.content = content;
    jsonObj.parent = "undefined";
    jsonObj.type = "f";

    return JSON.stringify(jsonObj);
}
