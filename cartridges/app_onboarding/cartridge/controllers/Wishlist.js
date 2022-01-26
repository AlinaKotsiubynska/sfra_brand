'use strict';

var server = require('server');

server.extend(module.superModule);
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var Resource = require('dw/web/Resource');
var PAGE_SIZE_ITEMS = 15;

server.prepend('Show', consentTracking.consent, server.middleware.https, csrfProtection.generateToken, function (req, res, next) {
    var WishlistModel = require('*/cartridge/models/productList');

    var viewData = res.getViewData();
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
