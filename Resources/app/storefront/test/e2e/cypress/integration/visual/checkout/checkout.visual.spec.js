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

        cy.intercept({
            path: '/widgets/checkout/info',
            method: 'get'
        }).as('cartInfo');

        // Product detail
        cy.get('.search-toggle-btn').click();

        cy.get('.header-search-input')
            .type(product.name);
        cy.get('.search-suggest-product-name').contains(product.name);

        cy.screenshot('[Checkout] Search product result');
        cy.takeSnapshot('[Checkout] Search product result', '.header-search');

        cy.get('.search-suggest-product-name').click();

        cy.screenshot('[Checkout] See product');
        cy.takeSnapshot('[Checkout] See product', '.product-detail');

        cy.get('.product-detail-buy .btn-buy').click();
        cy.wait('@cartInfo').then((xhr) => {
            expect(xhr.response).to.have.property('statusCode', 200)
        });

        // Off canvas
        cy.get('.offcanvas').should('be.visible');
        cy.get('.cart-item-price').contains('64');
        cy.get('.offcanvas').should('be.visible');
        cy.contains('Continue shopping').should('be.visible');
        cy.contains('Continue shopping').click();
        cy.get('.header-cart-total').click();

        cy.wait('@cartInfo').then((xhr) => {
            expect(xhr.response).to.have.property('statusCode', 200)
        });

        cy.get('.offcanvas').should('be.visible');
        cy.screenshot('[Checkout] Offcanvas');
        cy.takeSnapshot('[Checkout] Offcanvas', `${page.elements.offCanvasCart}.is-open`);
        cy.get(`${page.elements.cartItem}-label`).contains(product.name);

        // Checkout
        cy.get('.offcanvas-cart-actions .btn-primary').click();

        // Login
        cy.get('.checkout-main').should('be.visible');
        cy.get('#loginCollapse').click();

        // Take snapshot for visual testing on desktop
        cy.screenshot('[Checkout] Login');
        cy.takeSnapshot('[Checkout] Login', accountPage.elements.loginCard);
        accountPage.login();

        // Confirm
        cy.get('.confirm-tos .card-title').contains('Terms and conditions and cancellation policy');

        // Take snapshot for visual testing on desktop
        cy.screenshot('[Checkout] Confirm');
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
        cy.screenshot('[Checkout] Finish');
        cy.takeSnapshot('[Checkout] Finish', '.finish-header');
    });

    it('@visual @checkout: checkout empty cart', () => {
        cy.visit('/checkout/cart');
        cy.screenshot('[Checkout] Empty cart');
        cy.takeSnapshot('[Checkout] Empty cart', '.is-act-cartpage');
    })

    it('@visual @checkout: checkout cart', () => {
        cy.get('.btn-buy').click();

        // Checkout
        cy.get('.offcanvas-cart-actions .btn-link').click();

        cy.screenshot('[Checkout] Cart page');
        cy.takeSnapshot('[Checkout] Cart page', '.is-act-cartpage');

        cy.get('.cart-shipping-costs-container .cart-shipping-costs-btn').click();
        cy.screenshot('[Checkout] Cart shipping cost');
        cy.takeSnapshot('[Checkout] Cart shipping cost', '.is-act-cartpage');

        cy.get('.checkout-aside-action .begin-checkout-btn').click();

        cy.get('.register-submit button[type="submit"]').click();
        cy.screenshot('[Checkout] Required fields');
        cy.takeSnapshot('[Checkout] Required fields', '.is-act-checkoutregisterpage');

        cy.get('.register-footer .data-protection-information a').click();
        cy.screenshot('[Checkout] Privacy');
        cy.takeSnapshot('[Checkout] Privacy', '.is-act-checkoutregisterpage');
    })
});
