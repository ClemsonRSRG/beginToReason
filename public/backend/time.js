var time = new Date();

function resetTime() {
    time = new Date();
}

function getTime() {
    var endTime = new Date();
    return Math.round((endTime.getTime() - time.getTime()) / 1000);
}
