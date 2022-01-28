'use strict';

var base = module.superModule;
var Site = require('dw/system/Site');
var timeToLive = Site.current.getCustomPreferenceValue('wishlistItemTimeToLive');
var collections = require('*/cartridge/scripts/util/collections');

function calculateTimeToExpiration(lastModified) {
    var currentDate = Date.now();
    var timeLeft = timeToLive + (lastModified - currentDate)/24/60/60/1000;
    return Math.ceil(timeLeft)
  }

function removeExpiredItems(list) {
    var Transaction = require('dw/system/Transaction');

    collections.forEach(list.items, function (item) {
        if (calculateTimeToExpiration(item.lastModified) < 1) {
            Transaction.wrap(function () {
                list.removeItem(item);
            });
        }
    })
}

base.calculateTimeToExpiration = calculateTimeToExpiration;
base.removeExpiredItems = removeExpiredItems;

module.exports = base;