'use strict';

var base = require('base/wishlist/wishlist');

/**
 * @param {Object} response - Response received as a result of successful removal of the item
 * update wishlist item counter after successful item removal
 */
function updateListCount (response) {
    var itemsCount = $('.js-wishlist-items-count');
    itemsCount.empty()
    if (response.listLength > 0) {
        itemsCount.append(`
        <span class="wishlist-items-amount">${response.listLength} </span>
        <span class="wishlist-items-type">${response.listLength > 1 ? 'Product(s)' : 'Product'}</span>
        `)
    }
}

/**
 * @param {Object} $elementAppendTo - The element to append error html to
 * @param {string} msg - The error message
 * display error message if remove item from wishlist failed
 */
 function displayErrorMessage($elementAppendTo, msg) {
    if ($('.remove-from-wishlist-messages').length === 0) {
        $elementAppendTo.append(
            '<div class="remove-from-wishlist-messages "></div>'
        );
    }
    $('.remove-from-wishlist-messages')
        .append('<div class="remove-from-wishlist-alert text-center alert-danger">' + msg + '</div>');

    setTimeout(function () {
        $('.remove-from-wishlist-messages').remove();
    }, 3000);
}

/**
 * renders the list up to a given page number
 * @param {number} pageNumber - current page number
 * @param {boolean} spinner - if the spinner has already started
 * @param {string} focusElementSelector - selector of the element to focus on
 */
 function renderNewPageOfItems(pageNumber, spinner, focusElementSelector) {
    var publicView = $('.wishlistItemCardsData').data('public-view');
    var listUUID = $('.wishlistItemCardsData').data('uuid');
    var url = $('.wishlistItemCardsData').data('href');
    if (spinner) {
        $.spinner().start();
    }
    var scrollPosition = document.documentElement.scrollTop;
    var newPageNumber = pageNumber;
    $.ajax({
        url: url,
        method: 'get',
        data: {
            pageNumber: ++newPageNumber,
            publicView: publicView,
            id: listUUID
        }
    }).done(function (data) {
        $('.wishlistItemCards').empty();
        $('body .wishlistItemCards').append(data);

        if (focusElementSelector) {
            $(focusElementSelector).focus();
        } else {
            document.documentElement.scrollTop = scrollPosition;
        }
    }).fail(function () {
        $('.more-wl-items').remove();
    });
    $.spinner().stop();
}

function removeFromWishlist () {
        $('body').on('click', '.remove-from-wishlist', function (e) {
            e.preventDefault();
            var url = $(this).data('url');
            var elMyAccount = $('.account-wishlist-item').length;

            // If user is in my account page, call removeWishlistAccount() end point, re-render wishlist cards
            if (elMyAccount > 0) {
                $('.wishlist-account-card').spinner().start();
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'html',
                    data: {},
                    success: function (html) {
                        $('.wishlist-account-card>.card').remove();
                        $('.wishlist-account-card').append(html);
                        $('.wishlist-account-card').spinner().stop();
                    },
                    error: function () {
                        var $elToAppend = $('.wishlist-account-card');
                        $elToAppend.spinner().stop();
                        var msg = $elToAppend.data('error-msg');
                        displayErrorMessage($elToAppend, msg);
                    }
                });
            // else user is in wishlist landing page, call removeProduct() end point, then remove this card
            } else {
                $.spinner().start();
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                    data: {},
                    success: function (response) {
                        var pageNumber = $('.wishlistItemCardsData').data('page-number') - 1;
                        renderNewPageOfItems(pageNumber, false);
                        updateListCount(response)
                    },
                    error: function () {
                        $.spinner().stop();
                        var $elToAppendWL = $('.wishlistItemCards');
                        var msg = $elToAppendWL.data('error-msg');
                        displayErrorMessage($elToAppendWL, msg);
                    }
                });
            }
        });
    }

base.renderNewPageOfItems = renderNewPageOfItems;

module.exports = base;
