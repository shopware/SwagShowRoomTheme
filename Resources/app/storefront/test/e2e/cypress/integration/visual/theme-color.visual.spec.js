let product = {};

describe('Checkout: Visual tests', () => {
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
                cy.loginViaApi()
            })
            .then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/theme/manager/index`);
                beforeOpenStorefront();
            })
            .then(() => {
                cy.visit('/');
            })
            .then(() => {
                cy.get('.js-cookie-configuration-button > .btn').should('be.visible').click();
                cy.get('.offcanvas-cookie > .btn').scrollIntoView().should('be.visible').click();
            });
    });

    function beforeOpenStorefront() {
        cy.server();
        cy.route({
            url: `${Cypress.env('apiPath')}/_action/theme/*`,
            method: 'patch'
        }).as('saveData');

        cy.get('.sw-theme-list-item')
            .last()
            .get('.sw-theme-list-item__title')
            .contains('Showroom Theme')
            .click();

        cy.get('.sw-theme-manager-detail__area');

        cy.get('.sw-colorpicker .sw-colorpicker__input').first().clear().typeAndCheck('#FFBD5D');

        cy.get('.sw-card__title').contains('E-Commerce')
            .parent('.sw-theme-manager-detail__area')
            .find('.sw-colorpicker__input')
            .first().clear().typeAndCheck('#d00');

        cy.get('.sw-card__title').contains('E-Commerce')
            .parent('.sw-theme-manager-detail__area')
            .find('.sw-colorpicker__input').eq(1).clear().typeAndCheck('#a1090b');

        cy.get('.sw-card__title').contains('Footer')
            .parent('.sw-theme-manager-detail__area')
            .find('.sw-colorpicker__input').first().clear().typeAndCheck('#a1090b');

        cy.get('.smart-bar__actions .sw-button-process.sw-button--primary').click();
        cy.get('.sw-modal .sw-button--primary').click();

        cy.wait('@saveData').then((xhr) => {
            expect(xhr).to.have.property('status', 200);
        });
    }

    it('@visual: check change primary color ', () => {
        cy.get('.icon').should('have.css', 'color', 'rgb(255, 189, 93)');
        cy.get('.footer-headline').should('have.css', 'color', 'rgb(255, 189, 93)');
        cy.get('.footer-bottom').should('have.css', 'color', 'rgb(253, 253, 253)');
        cy.takeSnapshot('[Theme Color] Home Page with Primary Yellow Color and Footer Red color', '.is-act-home', {widths: [375, 768, 1920]});

        cy.get('.account-menu-btn').click();
        cy.get('.account-menu-dropdown').should('be.visible');
        cy.takeSnapshot('Account Menu Dropdown', '.account-menu-dropdown', {widths: [375, 768, 1920]});

        cy.get('.account-menu-login-button').click();
        cy.get('.account-register').should('be.visible');
        cy.get('#loginMail').typeAndCheckStorefront('test@example.com');
        cy.get('#loginPassword').typeAndCheckStorefront('shopware');
        cy.takeSnapshot('Account Register page', '.account-register', {widths: [375, 768, 1920]});

        cy.get('.login-submit button').click();
        cy.get('.account-content').should('be.visible');
        cy.takeSnapshot('Account Overview page', '.account', {widths: [375, 768, 1920]});

        cy.get('.header-logo-main-link').click();
        cy.get('.cms-listing-col').should('be.visible');
        cy.get('.product-price').should('have.css', 'color', 'rgb(221, 0, 0)');
        cy.get('.cms-listing-col:nth-child(1) .product-overlay .product-name').click();
        cy.get('.product-detail').should('be.visible');
        cy.get('.btn-buy').should('have.css', 'color', 'rgb(253, 253, 253)');
        cy.get('.product-detail-price').should('have.css', 'color', 'rgb(221, 0, 0)');
        cy.get('.product-detail-name').should('have.css', 'color', 'rgb(255, 189, 93)');
        cy.get('.product-detail-manufacturer a').should('have.css', 'color', 'rgb(255, 189, 93)');
        cy.get('.product-detail-tax-link').should('have.css', 'color', 'rgb(255, 189, 93)');
        cy.takeSnapshot('[Product Detail Page] Buy button with red color', '.product-detail-content', {widths: [375, 768, 1920]});

        cy.get('.btn-buy').click();
        cy.get('.cart-offcanvas').should('be.visible');
        cy.get('.offcanvas-cart-actions .btn-primary').should('have.css', 'background-color', 'rgb(255, 189, 93)');
        cy.get('.offcanvas-cart-actions .btn-link').should('have.css', 'border-color', 'rgb(255, 189, 93)');
        cy.get('.offcanvas-cart-actions .btn-link').should('have.css', 'color', 'rgb(255, 189, 93)');
        cy.takeSnapshot('Cart Off-canvas', '.cart-offcanvas', {widths: [375, 768, 1920]});

        cy.get('.offcanvas-cart-actions .btn-link').click();
        cy.get('.cart-table-header').should('have.css', 'color', 'rgb(255, 189, 93)');
        cy.takeSnapshot('Shopping cart', '.checkout', {widths: [375, 768, 1920]});

        cy.get('.checkout-aside-action .begin-checkout-btn').click();

        cy.get('.card-actions > a').should('have.css', 'color', 'rgb(255, 189, 93)');
        cy.get('.revocation-notice > a').should('have.css', 'color', 'rgb(255, 189, 93)');
        cy.get('.checkout-confirm-tos-label > a').should('have.css', 'color', 'rgb(255, 189, 93)');
        cy.get('#confirmFormSubmit').should('have.css', 'background-color', 'rgb(255, 189, 93)');
        cy.get('.checkout-confirm-tos-checkbox').should('not.be.visible')
            .check({ force: true })
            .should('be.checked');
        cy.takeSnapshot('Checkout - Complete order', '.checkout', {widths: [375, 768, 1920]});

        cy.get('#confirmFormSubmit').scrollIntoView();
        cy.get('#confirmFormSubmit').click();

        cy.get('.finish-back-to-shop-button a').should('have.css', 'background-color', 'rgb(255, 189, 93)');
        cy.get('.finish-back-to-shop-button a').should('have.css', 'border-color', 'rgb(255, 189, 93)');
        cy.takeSnapshot('Checkout - Thank you page', '.checkout', {widths: [375, 768, 1920]});
    });
});
