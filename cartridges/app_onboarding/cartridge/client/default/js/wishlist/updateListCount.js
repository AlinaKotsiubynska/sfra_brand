'use strict';

module.exports = function (data) {
    var itemsCount = $('.js-wishlist-items-count');
    itemsCount.empty()
    if (data.listLength > 0) {
        itemsCount.append(`
        <span class="wishlist-items-amount">${data.listLength} </span>
        <span class="wishlist-items-type">${data.listLength > 1 ? 'Product(s)' : 'Product'}</span>
        `)
    }
}