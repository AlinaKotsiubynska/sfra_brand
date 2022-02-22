function identifyMobileDevice () {
    var regex = /mobile/gmi;
    var userDevice = request.httpUserAgent;
    return regex.test(userDevice)
}

module.exports = {
    identifyMobileDevice: identifyMobileDevice
};