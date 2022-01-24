'use strict';

var server = require('server');

var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

var PAGE_SIZE_ITEMS = 15;
server.extend(module.superModule);

server.append('Show', consentTracking.consent, server.middleware.https, csrfProtection.generateToken, function (req, res, next) {
    var WishlistModel = require('*/cartridge/models/productList');

    var viewData = res.getViewData();
    var list = productListHelper.getList(req.currentCustomer.raw, { type: 10 });

    productListHelper.checkForExpiredItems(req, list.items)

    var updatedList = productListHelper.getList(req.currentCustomer.raw, { type: 10 });

    var WishlistModel = new WishlistModel(
        list,
        {
            type: 'wishlist',
            publicView: false,
            pageSize: PAGE_SIZE_ITEMS,
            pageNumber: 1
        }
    ).productList;

    viewData.wishlist = WishlistModel;
    res.setViewData(viewData)
    next();
});

module.exports = server.exports();
