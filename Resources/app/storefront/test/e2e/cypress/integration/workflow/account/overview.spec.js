import AccountPageObject from '../../../support/pages/account.page-object';

describe('Account: Overview page', () => {
    beforeEach(() => {
        return cy.createCustomerFixtureStorefront();
    });

    it('@base @overview: Overview page', () => {
        const page = new AccountPageObject();

        cy.visit('/account/login');
        cy.get(page.elements.loginCard).should('be.visible');

        cy.get('#loginMail').typeAndCheckStorefront('test@example.com');
        cy.get('#loginPassword').typeAndCheckStorefront('shopware');
        cy.get(`${page.elements.loginSubmit} [type="submit"]`).click();

        cy.get('.account-welcome h1').should((element) => {
            expect(element).to.contain('Overview');
        });

        cy.get('.account-overview-profile').should('be.visible');
        cy.get('.account-overview-newsletter').should('be.visible');
        cy.get('#newsletterRegister').should('not.be.visible')
            .check({ force: true })
            .should('be.checked');

        cy.get('.newsletter-alerts').should((element) => {
            expect(element).to.contain('You have subscribed to the newsletter');
        });

        cy.get('.overview-billing-address [data-address-editor="true"]').click();
        cy.get('.address-editor-modal').should('be.visible');

        cy.get('.address-editor-edit').click();
        cy.get('#address-create-edit').should('have.class', 'show');
        cy.get('#address-create-new').should('not.have.class', 'show');

        cy.get('.address-editor-create').click();
        cy.get('#address-create-new').should('have.class', 'show');
        cy.get('#address-create-edit').should('not.have.class', 'show');
    });
});
