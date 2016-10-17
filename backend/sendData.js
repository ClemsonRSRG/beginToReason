var author = Math.floor(Math.random() * 1000000000);
function sendData() {
    var data = "\"{";

    data += "\"code\":";
    data += "\"" + createEditor.getValue() + "\"";
    data += ",";

    data += "\"time\":";
    data += "\"" + getTime() + "\"";
    data += ",";

    data += "\"author\":";
    data += "\"" + author + "\"";
    data += ",";

    data += "\"module\":";
    data += "\"" + "CPSC2151" + "\"";
    data += ",";

    data += "\"lesson\":";
    data += "\"" + currentLesson.self + "\"";
    data += ",";

    data += "\"correct\":";
    data += "\"" + approved + "\"";
    data += ",";

    data += "\"points\":";
    data += "\"" + 0 + "\"";
    data += "}\"";

    $.post("https://resolve.cs.clemson.edu/teaching/bydesign", data);
}
