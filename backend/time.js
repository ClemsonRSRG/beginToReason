var time = new Date();

function resetTime() {
    time = new Date();
}

function getTime() {
    var endTime = new Date();
    return endTime.getTime() - time.getTime();
}
