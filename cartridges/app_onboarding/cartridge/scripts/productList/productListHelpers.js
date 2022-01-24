'use strict';
var base = module.superModule;

function calculateTimeToExpiration(lastModified) {
    var Site = require('dw/system/Site');
    var timeToLive = Site.current.getCustomPreferenceValue('wishlistItemTimeToLive');
    var currentDate = Date.now();
    var timeLeft = timeToLive + (lastModified - currentDate)/24/60/60/1000;
    return Math.ceil(timeLeft)
  }

function removeExpiredItems(req, items) {
    items.forEach(item => {
        if (item.pid && calculateTimeToExpiration(item.lastModified) < 1) {
            base.removeItem(req.currentCustomer.raw, item.pid, { req: req, type: 10, optionId: null, optionValue: null });
        }
   });
}

function checkForExpiredItems(req, itemsCollection) {
    var collections = require('*/cartridge/scripts/util/collections');

    var listOfItems = collections.map(itemsCollection, function (item) {
        return {
            pid: item.productID,
            lastModified: item.lastModified
        }
    });

    removeExpiredItems(req, listOfItems)
}


module.exports = {
    calculateTimeToExpiration: calculateTimeToExpiration,
    removeExpiredItems: removeExpiredItems,
    checkForExpiredItems: checkForExpiredItems
};

Object.keys(base).forEach(function (prop) {
    // eslint-disable-next-line no-prototype-builtins
    if (!module.exports.hasOwnProperty(prop)) {
        module.exports[prop] = base[prop];
    }
});

