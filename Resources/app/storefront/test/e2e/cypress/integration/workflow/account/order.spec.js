let product = {};

describe('Account: Order page', { tags: ['@workflow', '@order'] }, () => {
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
                return cy.searchViaAdminApi({
                    endpoint: 'product',
                    data: {
                        field: 'name',
                        value: 'Product name'
                    }
                });
            })
            .then((result) => {
                return cy.createOrder(result.id, {
                    username: 'test@example.com',
                    password: 'shopware'
                });
            })
            .then(() => {
                cy.visit('/');
            });
    });

    it('@workflow @order: reorder order', () => {
        // Login
        cy.visit('/account/order');
        cy.get('.login-card').should('be.visible');
        cy.get('#loginMail').typeAndCheckStorefront('test@example.com');
        cy.get('#loginPassword').typeAndCheckStorefront('shopware');
        cy.get('.login-submit [type="submit"]').click();

        // Order detail is expandable
        cy.get('.order-table').should('be.visible');
        cy.get('.order-table:nth-of-type(1) .order-table-header-order-number').contains('Order number: 10000');

        cy.get('.order-table:nth-of-type(1) .order-hide-btn').click();
        cy.get('.order-detail-content').should('be.visible');

        // Re-order past order
        cy.get('.order-table-header-context-menu').click();
        cy.get('.order-table-header-context-menu-content-form').should('be.visible');

        cy.get('.order-table-header-context-menu-content-form button').click();
        cy.get('.cart-offcanvas').should('be.visible');
        cy.get('.cart-offcanvas .alert-content').contains('1 product added to your shopping cart.');

        cy.get('.begin-checkout-btn').click({force: true});
        cy.get('.checkout-wrapper').should('be.visible');
        cy.get('.confirm-main-header').contains('Complete order');

        cy.get('.checkout-confirm-tos-checkbox').click({force: true});
        cy.get('#confirmFormSubmit').click({force: true});

        // Verify order
        cy.get('.finish-header').contains('Thank you for your order');
        cy.get('.finish-ordernumber').contains('Your order number: #10001');
    });

    it('@workflow @order: cancel order', () => {
        // Enable refunds
        cy.loginViaApi().then(() => {
            cy.visit('/admin#/sw/settings/cart/index');
            cy.contains('Enable refunds').click();
            cy.get('.sw-settings-cart__save-action').click();
            cy.get('.icon--regular-checkmark-xs').should('be.visible');
        });

        // Login
        cy.visit('/account/order');
        cy.get('.login-card').should('be.visible');
        cy.get('#loginMail').typeAndCheckStorefront('test@example.com');
        cy.get('#loginPassword').typeAndCheckStorefront('shopware');
        cy.get('.login-submit [type="submit"]').click();

        cy.get('.order-table-header-context-menu').click();
        cy.get('.order-table-header-context-menu-content').should('be.visible');

        cy.get('.dropdown-menu > [type="button"]').click();
        cy.get('.order-history-cancel-modal').should('be.visible');

        cy.get('.order-history-cancel-modal .btn-primary').click();
        cy.get('.order-status-badge').contains('Cancelled');
    });

    it('@workflow @order: change payment', () => {
        // Login
        cy.visit('/account/order');
        cy.get('.login-card').should('be.visible');
        cy.get('#loginMail').typeAndCheckStorefront('test@example.com');
        cy.get('#loginPassword').typeAndCheckStorefront('shopware');
        cy.get('.login-submit [type="submit"]').click();

        // edit order
        cy.get('.order-table').should('be.visible');
        cy.get('.order-table-header-order-table-body > :nth-child(3)').contains('Invoice');
        cy.get('.order-table-header-context-menu').click();
        cy.get('a.order-table-header-context-menu-content-link').click();

        // change payment
        cy.get('.payment-methods').should('be.visible');
        cy.get('.payment-methods > :nth-child(3)').click();
        cy.get('#confirmOrderForm > .btn').scrollIntoView();

        cy.get('#confirmOrderForm > .btn').click();
        cy.get('.finish-order-subtitle').should('contain', 'Paid in advance');
    });
});
