import AccountPageObject from '../../../support/pages/account.page-object';

describe('Account: Overview page', { tags: ['@workflow', '@account'] }, () => {
    beforeEach(() => {
        return cy.setToInitialState()
            .then(() => {
                return cy.createCustomerFixtureStorefront()
            })
            .then(() => {
                cy.visit('/account/login');
            })
    });

    it('@workflow @account: account overview workflow', () => {
        const page = new AccountPageObject();

        cy.get(page.elements.loginCard).should('be.visible');

        cy.get('#loginMail').typeAndCheckStorefront('test@example.com');
        cy.get('#loginPassword').typeAndCheckStorefront('shopware');
        cy.get(`${page.elements.loginSubmit} [type="submit"]`).click();

        cy.get('.account-welcome h1').should((element) => {
            expect(element).to.contain('Overview');
        });

        cy.get('.account-overview-profile').should('be.visible');
        cy.get('.account-overview-newsletter').should('be.visible');
        cy.get('label[for="newsletterRegister"]').click();

        cy.get('.newsletter-alerts').should((element) => {
            expect(element).to.contain('You have successfully subscribed to the newsletter.');
        });
    });
});
