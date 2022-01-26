'use strict';

var server = require('server');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
server.extend(module.superModule);

server.prepend('Show', function (req, res, next) {
    var list = productListHelper.getList(req.currentCustomer.raw, { type: 10 });
    productListHelper.removeExpiredItems(list)
    next();
});


module.exports = server.exports();
