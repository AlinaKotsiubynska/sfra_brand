'use strict';

var server = require('server');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
var Resource = require('dw/web/Resource');

server.extend(module.superModule);

server.prepend('Show', function (req, res, next) {
    var list = productListHelper.getList(req.currentCustomer.raw, { type: 10 });
    productListHelper.removeExpiredItems(list)
    next();
});

server.replace('RemoveProduct', function (req, res, next) {
    var list = productListHelper.removeItem(req.currentCustomer.raw, req.querystring.pid, { req: req, type: 10 });
    var listIsEmpty = list.prodList.items.empty;
    var listLength = list.prodList.items.length;

    res.json({
        success: true,
        listIsEmpty: listIsEmpty,
        listLength: listLength,
        emptyWishlistMsg: listIsEmpty ? Resource.msg('wishlist.empty.text', 'wishlist', null) : ''
    });
    next();
});

module.exports = server.exports();
