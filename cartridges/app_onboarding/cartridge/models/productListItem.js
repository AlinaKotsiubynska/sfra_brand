'use strict';

var base = module.superModule;
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');

/** Address class that represents an productListItem
 * @param {dw.customer.ProductListItem} productListItemObject - Item in a product list
 * @constructor
 */
function productListItem(productListItemObject) {
    base.call(this, productListItemObject);
    this.productListItem.timeToExpiration = productListHelper.calculateTimeToExpiration(this.productListItem.lastModified);
}

module.exports = productListItem;