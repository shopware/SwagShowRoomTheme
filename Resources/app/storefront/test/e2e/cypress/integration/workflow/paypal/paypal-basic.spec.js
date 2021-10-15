// / <reference types="Cypress" />
import AccountPageObject from '../../../support/pages/account.page-object';
const accountPage = new AccountPageObject();

let salesChannelId;
let product = {};

describe('Paypal: Checkout', () => {
    beforeEach(() => {
        return cy.setToInitialState()
            .then(() => {
                // Search for storefront SalesChannel id
                return cy.searchViaAdminApi({
                    endpoint: 'sales-channel',
                    data: {
                        field: 'name',
                        value: 'Storefront'
                    }
                });
            })
            .then((salesChannelData) => {
                // Preserve salesChannelId for later use
                salesChannelId = salesChannelData.id;
                return cy.initializePluginConfig('paypal-config.json', '/api/_action/system-config/batch')
            })
            .then(() => {
                return cy.requestAdminApi(
                    'POST',
                    `/api/_action/paypal/saleschannel-default`,
                    {"salesChannelId": salesChannelId}
                )
            })
            .then(() => {
                return cy.createProductFixture();
            })
            .then(() => {
                return cy.fixture('product');
            })
            .then((result) => {
                product = result;
            })
            .then(() => {
                cy.visit('/');
            })
    });

    it('@workflow @paypal: should see Paypal logo in footer', () => {
        cy.get('.footer-logos div[data-swag-paypal-installment-banner="true"]')
            .should('be.visible');
    });

    it('@workflow @paypal: should be visible in product box', () => {
        cy.get('.product-overlay').should('be.exist').trigger('mouseover');
        cy.get('.paypal-buttons').should('be.exist').click({force: true});
    });

    it('@workflow @paypal: should have Paypal checkout button for default settings', () => {
        // Product detail
        cy.get('.search-toggle-btn').click();

        cy.get('.header-search-input')
            .type(product.name);
        cy.get('.search-suggest-product-name').contains(product.name);

        cy.get('.search-suggest-product-name').click();

        cy.get('h1.product-detail-name').contains('Product name');
        cy.get('div[data-swag-paypal-express-button="true"]').scrollIntoView().should('be.visible');
    });

    it('@workflow @paypal: should have Paypal checkout button in Offcanvas cart', () => {
        cy.get('.product-box .btn-buy').should('be.exist').click({force: true});

        cy.get('.offcanvas-cart div[data-swag-paypal-express-button="true"]').should('be.visible');
        cy.get('.offcanvas-cart div[data-swag-paypal-installment-banner="true"]').should('be.visible');
    });

    it('@workflow @paypal: should have Paypal checkout in checkout register page', () => {
        cy.get('.search-toggle-btn').click();

        cy.get('.header-search-input')
            .type(product.name);
        cy.get('.search-suggest-product-name').contains(product.name);
        cy.get('.search-suggest-product-name').click();
        cy.get('.product-detail-buy .btn-buy').click();

        // Offcanvas
        cy.get('.offcanvas').should('be.visible');
        cy.get('.offcanvas-cart-actions .begin-checkout-btn').click();

        // Checkout register
        cy.get('#loginCollapse').should('be.visible').click();

        // Paypal Express checkout
        cy.get('div[data-swag-paypal-express-button="true"]').scrollIntoView().should('be.visible');
        cy.get('div[data-swag-paypal-installment-banner="true"]').should('be.visible');
    });

    it('@workflow @paypal: should have Paypal checkout in checkout cart page', () => {
        cy.get('.search-toggle-btn').click();

        cy.get('.header-search-input')
            .type(product.name);
        cy.get('.search-suggest-product-name').contains(product.name);
        cy.get('.search-suggest-product-name').click();
        cy.get('.product-detail-buy .btn-buy').click();

        // Offcanvas
        cy.get('.offcanvas').should('be.visible');
        cy.get('.offcanvas-cart-actions a[href="/checkout/cart"]').click();

        cy.get('div[data-swag-paypal-installment-banner="true"]').should('be.visible');
        cy.get('div[data-swag-paypal-express-button="true"]').scrollIntoView().should('be.visible');
    });

    it('@workflow @paypal: should be able to checkout using Paypal as payment method', () => {
        cy.createCustomerFixtureStorefront();

        cy.get('.search-toggle-btn').click();
        cy.get('.header-search-input')
            .type(product.name);
        cy.get('.search-suggest-product-name').contains(product.name);
        cy.get('.search-suggest-product-name').click();
        cy.get('.product-detail-buy .btn-buy').click();

        // Offcanvas
        cy.get('.offcanvas').should('be.visible');
        cy.get('.offcanvas-cart-actions .begin-checkout-btn').click();

        // Login
        cy.get('#loginCollapse').click();
        accountPage.login()

        // Change payment method to "Paypal"
        cy.get('.payment-methods .payment-method-label')
            .should('exist')
            .contains('PayPal, direct debit or credit card')
            .click(1, 1);
        cy.get('#ppplus').should('be.visible');
    });
});
