import CheckoutPageObject from '../../../support/pages/checkout.page-object';
import AccountPageObject from '../../../support/pages/account.page-object';

let product = {};

describe('Checkout: Basic', {tags: ['@workflow', '@checkout']}, () => {
    beforeEach(() => {
        return cy.setToInitialState()
            .then(() => {
                return cy.createProductFixture();
            })
            .then(() => {
                return cy.fixture('product');
            })
            .then((result) => {
                product = result;
                return cy.createCustomerFixtureStorefront();
            })
            .then(() => {
                cy.visit('/');
            });
    });

    it('@workflow @checkout: basic checkout workflow', { retries: 2 }, () => {
        const page = new CheckoutPageObject();
        const accountPage = new AccountPageObject();

        // Product detail
        cy.get('.search-toggle-btn').click();

        cy.get('.header-search-input')
            .type(product.name);
        cy.get('.search-suggest-product-name').contains(product.name);

        cy.get('.search-suggest-product-name').click();

        cy.get('.product-detail-buy .btn-buy').click();

        // Offcanvas
        cy.get('.offcanvas').should('be.visible');
        cy.get('.cart-item-price').contains('64');
        cy.contains('Continue shopping').should('be.visible');
        cy.contains('Continue shopping').click();
        cy.get('.header-cart-total').contains('64', { timeout: 20000 });
        cy.get('.header-cart-total').click();
        cy.get('.offcanvas').should('be.visible');

        cy.get(`${page.elements.cartItem}-label`).contains(product.name);

        // Checkout
        cy.get('.offcanvas-cart-actions .btn-primary').click();

        // Login
        cy.get('.checkout-main').should('be.visible');
        cy.get('#loginCollapse').click();

        cy.get('#loginMail').type('test@example.com');
        cy.get('#loginPassword').type('shopware');
        cy.get(`${accountPage.elements.loginSubmit} [type="submit"]`).click();

        // Confirm
        cy.get('.confirm-tos .card-title').contains('Terms and conditions and cancellation policy');

        cy.get('.confirm-tos .custom-checkbox label').scrollIntoView();
        cy.get('.confirm-tos .custom-checkbox label').click(1, 1);
        cy.get('.confirm-address').contains('Pep Eroni');
        cy.get(`${page.elements.cartItem}-details-container ${page.elements.cartItem}-label`).contains(product.name);
        cy.get(`${page.elements.cartItem}-total-price`).contains(product.price[0].gross);

        // Finish checkout
        cy.get('#confirmFormSubmit').scrollIntoView();
        cy.get('#confirmFormSubmit').click();
    });
});
