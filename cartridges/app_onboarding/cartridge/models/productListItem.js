'use strict';

var base = module.superModule;
var Site = require('dw/system/Site');

/** Address class that represents an productListItem
 * @param {dw.customer.ProductListItem} productListItemObject - Item in a product list
 * @constructor
 */
function productListItem(productListItemObject) {
    base.call(this, productListItemObject);
    this.wishlistExpirationDate = Site.current.getCustomPreferenceValue('wishlistItemTimeToLive')
}


module.exports = productListItem;
