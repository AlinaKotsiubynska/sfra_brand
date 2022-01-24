'use strict';

var server = require('server');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
server.extend(module.superModule);

server.prepend('Show', function (req, res, next) {
    var list = productListHelper.getList(req.currentCustomer.raw, { type: 10 });
    var viewData = res.getViewData();

    productListHelper.checkForExpiredItems(req, list.items)

    var updatedList = productListHelper.getList(req.currentCustomer.raw, { type: 10 });
    viewData.list = list;
    res.setViewData(viewData);

    next();
});


module.exports = server.exports();
