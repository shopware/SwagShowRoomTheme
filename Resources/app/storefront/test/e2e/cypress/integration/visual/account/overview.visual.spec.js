import AccountPageObject from '../../../support/pages/account.page-object';

describe('Account: Overview page', () => {
    beforeEach(() => {
        return cy.setToInitialState()
            .then(() => {
                return cy.createCustomerFixtureStorefront();
            })
            .then(() => {
                cy.visit('/');
            }).then(() => {
                cy.get('.js-cookie-configuration-button > .btn').should('be.visible').click();
                cy.get('.offcanvas-cookie .btn-primary').scrollIntoView().should('be.visible').click();
            });
    });

    it('@visual: Overview page', () => {
        const page = new AccountPageObject();

        cy.visit('/account/login');
        cy.get(page.elements.loginCard).should('be.visible');

        cy.get('#loginMail').typeAndCheckStorefront('test@example.com');
        cy.get('#loginPassword').typeAndCheckStorefront('shopware');
        cy.get(`${page.elements.loginSubmit} [type="submit"]`).click();

        cy.get('.account-welcome h1').should((element) => {
            expect(element).to.contain('Overview');
        });

        cy.takeSnapshot('[Account] Overview page', '.account', {widths: [375, 768, 1920]});

        cy.get('.account-overview-profile').should('be.visible');
        cy.get('.account-overview-newsletter').should('be.visible');
        cy.get('#newsletterRegister').should('be.visible')
            .check({ force: true })
            .should('be.checked');

        cy.get('.newsletter-alerts').should((element) => {
            expect(element).to.contain('You have successfully subscribed to the newsletter.');
        });

        cy.takeSnapshot('[Overview] Newsletter subscription', '.account-overview', {widths: [375, 768, 1920]});

        // billing address
        cy.get('.overview-billing-address [data-address-editor="true"]').click();
        cy.get('.address-editor-modal').should('be.visible');

        cy.takeSnapshot('[Overview] Billing Address Editor Modal', '.address-editor-modal', {widths: [375, 768, 1920]});

        cy.get('.address-editor-edit').click();
        cy.get(page.elements.editModal).should('have.class', 'show');
        cy.get(page.elements.createModal).should('not.have.class', 'show');

        cy.takeSnapshot('[Overview] Change billing address form', '.address-editor-modal', {widths: [375, 768, 1920]});

        cy.get('.address-editor-create').click();
        cy.get(page.elements.createModal).should('have.class', 'show');
        cy.get(page.elements.editModal).should('not.have.class', 'show');

        cy.takeSnapshot('[Overview] Create a new billing address form', '.address-editor-modal', {widths: [375, 768, 1920]});

        cy.get('.address-editor-modal').find('.btn-close').click();

        cy.get('.overview-shipping-address [data-address-editor="true"]').click();
        cy.get('.address-editor-modal').should('be.visible');

        // shipping address
        cy.takeSnapshot('[Overview] Shipping Address Editor Modal', '.address-editor-modal', {widths: [375, 768, 1920]});

        cy.get('.address-editor-edit').click();
        cy.get(page.elements.shippingEditModal).should('have.class', 'show');
        cy.get(page.elements.shippingCreateModal).should('not.have.class', 'show');

        cy.takeSnapshot('[Overview] Change shipping address form', '.address-editor-modal', {widths: [375, 768, 1920]});

        cy.get('.address-editor-create').click();
        cy.get(page.elements.shippingCreateModal).should('have.class', 'show');
        cy.get(page.elements.shippingEditModal).should('not.have.class', 'show');

        cy.takeSnapshot('[Overview] Create a new shipping address form', '.address-editor-modal', {widths: [375, 768, 1920]});
    });
});
