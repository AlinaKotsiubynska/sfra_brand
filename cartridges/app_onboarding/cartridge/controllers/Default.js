'use strict';

var server = require('server');
server.extend(module.superModule);

server.append('Start', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    var Transaction = require('dw/system/Transaction');
    var deviceHelper = require('*/cartridge/scripts/helpers/deviceHelpers');

    Transaction.wrap(function () {
        session.custom.isMobile = deviceHelper.identifyMobileDevice()
    })

    next();
});


module.exports = server.exports();
