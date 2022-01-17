'use strict';

/**
 * @namespace Search
 */

var server = require('server');
server.extend(module.superModule);

var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

/**
 * Search-Refinebar : The endpoint Search-Refinebar render the refinement bar on product list page, PLP (i.e. the search result page and category listing page)
 * @name Base/Search-Refinebar
 * @function
 * @memberof Search
 * @param {middleware} - cache.applyDefaultCache
 * @param {querystringparameter} - q - The search string (when submit product search)
 * @param {querystringparameter} - cgid - category ID (when loading category list page)
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.replace('Refinebar', cache.applyDefaultCache, function (req, res, next) {
    var CatalogMgr = require('dw/catalog/CatalogMgr');
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var ProductSearch = require('*/cartridge/models/search/productSearch');
    var searchHelper = require('*/cartridge/scripts/helpers/searchHelpers');

    var apiProductSearch = new ProductSearchModel();
    apiProductSearch = searchHelper.setupSearch(apiProductSearch, req.querystring, req.httpParameterMap);
    apiProductSearch.search();
    var productSearch = new ProductSearch(
        apiProductSearch,
        req.querystring,
        req.querystring.srule,
        CatalogMgr.getSortingOptions(),
        CatalogMgr.getSiteCatalog().getRoot()
    );
    
    var regex = /mobile/gmi;
    var userDevice = req.httpHeaders['user-agent'];
    var isMobileDevice = regex.test(userDevice)

    res.render('/search/searchRefineBar', {
        productSearch: productSearch,
        querystring: req.querystring,
        userAgent: {
            isMobileDevice: isMobileDevice
        }
    });

    next();
}, pageMetaData.computedPageMetaData);

module.exports = server.exports();
