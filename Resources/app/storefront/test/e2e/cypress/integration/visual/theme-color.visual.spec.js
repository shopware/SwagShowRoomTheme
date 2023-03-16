import AccountPageObject from "../../support/pages/account.page-object";

let product = {};
let colorScheme = {};
const accountPage = new AccountPageObject();

describe('ThemeColor: Visual tests', () => {
    beforeEach(() => {
        return cy.setToInitialState()
            .then(() => cy.setShippingMethodInSalesChannel('Standard'))
            .then(() => cy.createProductFixture() )
            .then(() => cy.fixture('product'))
            .then((result) => {
                product = result;
                return cy.createCustomerFixtureStorefront();
            })
            .then(() => cy.login())
            .then(() => {
                cy.visit(`${Cypress.env('admin')}#/sw/theme/manager/index`);
                cy.fixture('color-scheme.json').then((colorSchemeFixture) => {
                    colorScheme = colorSchemeFixture;
                    changeColorScheme(colorSchemeFixture);
                })
            })
            .then(() => {
                cy.visit('/');
            })
            .then(() => {
                cy.get('.js-cookie-configuration-button > .btn').should('be.visible').click();
                cy.get('.offcanvas-cookie > .btn').scrollIntoView().should('be.visible').click();
            });
    });

    // after(() => {
    //     return cy.setToInitialState()
    //         .then(() => {
    //             cy.clearCookies();
    //         })
    //         .then(() => {
    //             cy.login()
    //         })
    //         .then(() => {
    //             cy.visit(`${Cypress.env('admin')}#/sw/theme/manager/index`);
    //             cy.intercept({
    //                 path: `${Cypress.env('apiPath')}/_action/theme/*`,
    //                 method: 'patch'
    //             }).as('saveData');

    //             cy.get('.sw-theme-list-item .sw-theme-list-item__title')
    //                 .contains('Showroom Theme')
    //                 .click();

    //             cy.get('.smart-bar__actions .sw-button-process.sw-button--primary').click();
    //             cy.get('.sw-modal .sw-button--primary').click();

    //             cy.wait('@saveData').then((xhr) => {
    //                 expect(xhr.response).to.have.property('statusCode', 200);
    //             });
    //         })
    // });

    function hexToRGB(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = `0x${hex[1]}${hex[1]}`;
            g = `0x${hex[2]}${hex[2]}`;
            b = `0x${hex[3]}${hex[3]}`;
        } else {
            r = `0x${hex[1]}${hex[2]}`;
            g = `0x${hex[3]}${hex[4]}`;
            b = `0x${hex[5]}${hex[6]}`;
        }
        return `rgb(${+r}, ${+g}, ${+b})`;
    }

    function changeColorScheme(colorScheme) {
        cy.intercept({
            path: `${Cypress.env('apiPath')}/_action/theme/*`,
            method: 'patch'
        }).as('saveData');

        cy.get('.sw-theme-list-item')
            .last()
            .get('.sw-theme-list-item__title')
            .contains('Showroom Theme')
            .click();

        cy.get('.sw-colorpicker .sw-colorpicker__input').first().clear().typeAndCheck(colorScheme.primary);

        cy.get('.sw-field-id-sw-color-buy-button')
            .find('.sw-colorpicker__input')
            .first().clear().typeAndCheck(colorScheme.buyButton);

        cy.get('.sw-field-id-sw-color-price')
            .find('.sw-colorpicker__input').first().clear().typeAndCheck(colorScheme.price);

        cy.get('.sw-field-id-sw-footer-bg-color')
            .find('.sw-colorpicker__input').first().clear().typeAndCheck(colorScheme.footer);

        cy.get('.smart-bar__actions .sw-button-process.sw-button--primary').click();
        cy.get('.sw-modal .sw-button--primary').click();

        cy.wait('@saveData').then((xhr) => {
            expect(xhr.response).to.have.property('statusCode', 200);
        });
    }

    it.skip('@visual @themeColor: check change primary color ', () => {
        cy.intercept({
            path: '/widgets/checkout/info',
            method: 'get'
        }).as('cartInfo');

        cy.get('.icon').should('have.css', 'color', hexToRGB(colorScheme.primary));
        cy.get('.footer-headline').should('have.css', 'color', hexToRGB(colorScheme.primary));
        cy.get('.footer-bottom').should('have.css', 'color', hexToRGB(colorScheme.text));
        cy.takeSnapshot('[Theme Color] Home Page with Primary Yellow Color and Footer Red color', '.is-act-home');

        cy.get('.account-menu-btn').click();
        cy.get('.account-menu-dropdown').should('be.visible');

        cy.get('.account-menu-login-button').click();
        accountPage.login();
        cy.get('.account-content').should('be.visible');
        cy.takeSnapshot('[Theme Color] Account Overview page', '.account');

        cy.get('.header-logo-main-link').click();
        cy.get('.cms-listing-col').should('be.visible');
        cy.get('.product-price').should('have.css', 'color', hexToRGB(colorScheme.buyButton));
        cy.get('.cms-listing-col:nth-child(1) .product-overlay .product-name').click();
        cy.get('.product-detail-buy').should('be.visible');
        cy.get('.btn-buy').should('have.css', 'color', hexToRGB(colorScheme.text));
        cy.get('.product-detail-price').should('have.css', 'color', hexToRGB(colorScheme.buyButton));
        cy.get('.product-detail-name').should('have.css', 'color', hexToRGB(colorScheme.primary));
        cy.get('.product-heading-manufacturer-logo-container a').should('have.css', 'color', hexToRGB(colorScheme.primary));
        cy.get('.product-detail-tax-link').should('have.css', 'color', hexToRGB(colorScheme.primary));
        cy.takeSnapshot('[Theme Color] Product Detail Page - Buy button with orange color', '.product-detail-buy');

        cy.get('.product-detail-buy .btn-buy').click();
        cy.wait('@cartInfo').then((xhr) => {
            expect(xhr.response).to.have.property('statusCode', 204)
        });
        cy.get('.cart-offcanvas').should('be.visible');
        cy.get('.offcanvas-cart-actions .btn-primary').should('have.css', 'background-color', hexToRGB(colorScheme.primary));
        cy.get('.offcanvas-cart-actions .btn-link').should('have.css', 'border-color', hexToRGB(colorScheme.primary));
        cy.get('.offcanvas-cart-actions .btn-link').should('have.css', 'color', hexToRGB(colorScheme.primary));
        cy.takeSnapshot('[Theme Color] Cart Off-canvas', '.cart-offcanvas');

        cy.get('.offcanvas-cart-actions .btn-link').click();
        cy.get('.cart-table-header').should('have.css', 'color', hexToRGB(colorScheme.primary));
        cy.takeSnapshot('[Theme Color] Shopping cart', '.checkout');

        cy.get('.checkout-aside-action .begin-checkout-btn').click();

        cy.get('.card-actions > a').should('have.css', 'color', hexToRGB(colorScheme.primary));
        cy.get('.revocation-notice > a').should('have.css', 'color', hexToRGB(colorScheme.primary));
        cy.get('.checkout-confirm-tos-label > a').should('have.css', 'color', hexToRGB(colorScheme.primary));
        cy.get('#confirmFormSubmit').should('have.css', 'background-color', hexToRGB(colorScheme.primary));
        cy.get('.checkout-confirm-tos-checkbox').should('be.visible')
            .check({ force: true })
            .should('be.checked');
        cy.takeSnapshot('[Theme Color] Checkout - Complete order', '.checkout');

        cy.get('#confirmFormSubmit').scrollIntoView();
        cy.get('#confirmFormSubmit').click();

        cy.get('.finish-back-to-shop-button a').should('have.css', 'background-color', hexToRGB(colorScheme.primary));
        cy.get('.finish-back-to-shop-button a').should('have.css', 'border-color', hexToRGB(colorScheme.primary));
        cy.takeSnapshot('[Theme Color] Checkout - Thank you page', '.checkout');
    });
});
