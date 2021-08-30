import CheckoutPageObject from '../../../support/pages/checkout.page-object';
import AccountPageObject from '../../../support/pages/account.page-object';

let product = {};

describe('Checkout: Visual tests', () => {
    beforeEach(() => {
        return cy.setToInitialState()
            .then(() => {
                return cy.createProductFixture()
                    .then(() => {
                        return cy.fixture('product');
                    })
                    .then((result) => {
                        product = result;
                        return cy.createCustomerFixtureStorefront();
                    })
                    .then(() => {
                        cy.visit('/');
                    }).then(() => {
                        cy.get('.js-cookie-configuration-button > .btn').should('be.visible').click();
                        cy.get('.offcanvas-cookie > .btn').scrollIntoView().should('be.visible').click();
                    });
            })
    });

    it('@visual @checkout: check appearance of basic checkout workflow', () => {
        const page = new CheckoutPageObject();
        const accountPage = new AccountPageObject();

        // Product detail
        cy.get('.search-toggle-btn').click();

        cy.get('.header-search-input')
            .type(product.name);
        cy.get('.search-suggest-product-name').contains(product.name);

        cy.takeSnapshot('[Checkout] Search product result',
            '.header-search',
            {widths: [375, 768, 1920]});

        cy.get('.search-suggest-product-name').click();

        cy.takeSnapshot('[Checkout] See product',
            '.product-detail',
            {widths: [375, 768, 1920]});

        cy.get('.product-detail-buy .btn-buy').click();

        // Off canvas
        cy.get('.offcanvas').should('be.visible');
        cy.get('.cart-item-price').contains('64');
        cy.get('.offcanvas').should('be.visible');
        cy.contains('Continue shopping').should('be.visible');
        cy.contains('Continue shopping').click();
        cy.get('.header-cart-total', { timeout: 20000 }).click();
        cy.get('.offcanvas').should('be.visible');

        // Take snapshot for visual testing on desktop
        cy.takeSnapshot('[Checkout] Offcanvas',
            `${page.elements.offCanvasCart}.is-open`,
            {widths: [375, 768, 1920]});

        cy.get(`${page.elements.cartItem}-label`).contains(product.name);

        // Checkout
        cy.get('.offcanvas-cart-actions .btn-primary').click();

        // Login
        cy.get('.checkout-main').should('be.visible');
        cy.get('#loginCollapse').click();

        // Take snapshot for visual testing on desktop
        cy.takeSnapshot('[Checkout] Login', accountPage.elements.loginCard);

        cy.get('#loginMail').type('test@example.com');
        cy.get('#loginPassword').type('shopware');
        cy.get(`${accountPage.elements.loginSubmit} [type="submit"]`).click();

        // Confirm
        cy.get('.confirm-tos .card-title').contains('Terms and conditions and cancellation policy');

        // Take snapshot for visual testing on desktop
        cy.takeSnapshot('[Checkout] Confirm', '.confirm-tos');

        cy.get('.confirm-tos .custom-checkbox label').scrollIntoView();
        cy.get('.confirm-tos .custom-checkbox label').click(1, 1);
        cy.get('.confirm-address').contains('Pep Eroni');
        cy.get(`${page.elements.cartItem}-details-container ${page.elements.cartItem}-label`).contains(product.name);
        cy.get(`${page.elements.cartItem}-total-price`).contains(product.price[0].gross);
        cy.get(`${page.elements.cartItem}-total-price`).contains(product.price[0].gross);

        // Finish checkout
        cy.get('#confirmFormSubmit').scrollIntoView();
        cy.get('#confirmFormSubmit').click();

        // Take snapshot for visual testing on desktop
        cy.takeSnapshot('[Checkout] Finish', '.finish-header');
    });

    it('@visual @checkout: checkout empty cart', () => {
        cy.visit('/checkout/cart');

        cy.takeSnapshot('[Checkout] Empty cart',
            '.is-act-cartpage',
            {widths: [375, 768, 1920]});
    })

    it('@visual @checkout: checkout cart', () => {
        cy.get('.btn-buy').click();

        // Checkout
        cy.get('.offcanvas-cart-actions .btn-link').click();

        cy.takeSnapshot('[Checkout] Cart page', '.is-act-cartpage');

        cy.get('.cart-shipping-costs-container .cart-shipping-costs-btn').click();
        cy.takeSnapshot('[Checkout] Cart shipping cost', '.is-act-cartpage');

        cy.get('.checkout-aside-action .begin-checkout-btn').click();

        cy.get('.register-submit button[type="submit"]').click();
        cy.takeSnapshot('[Checkout] Required fields', '.is-act-checkoutregisterpage');

        cy.get('.register-footer .data-protection-information a').click();
        cy.takeSnapshot('[Checkout] Privacy', '.is-act-checkoutregisterpage');
    })
});
