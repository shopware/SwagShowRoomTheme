import AccountPageObject from '../../../support/pages/account.page-object';

describe('Account: Edit profile', () => {
    beforeEach(() => {
        return cy.createCustomerFixtureStorefront();
    });

    it('@base @customer: Update profile', () => {
        const page = new AccountPageObject();

        cy.authenticate().then((result) => {
            const requestConfig = {
                headers: {
                    Authorization: `Bearer ${result.access}`
                },
                method: 'post',
                url: `api/_action/system-config/batch`,
                body: {
                    null: {
                        'core.loginRegistration.showAccountTypeSelection': true
                    }
                }
            };
            return cy.request(requestConfig);
        });

        cy.visit('/account/login');
        cy.get(page.elements.loginCard).should('be.visible');

        cy.get('#loginMail').typeAndCheckStorefront('test@example.com');
        cy.get('#loginPassword').typeAndCheckStorefront('shopware');
        cy.get(`${page.elements.loginSubmit} [type="submit"]`).click();

        cy.get('.account-welcome h1').should((element) => {
            expect(element).to.contain('Overview');
        });

        cy.get('.card-actions [href="/account/profile"]').click();

        const accountTypeSelector = 'select[name="accountType"]';
        const companySelector = 'input[name="company"]';

        cy.get(accountTypeSelector).should('be.visible');

        cy.get(accountTypeSelector).select('Private');
        cy.get(companySelector).should('not.be.visible');

        cy.get(accountTypeSelector).select('Commercial');
        cy.get(companySelector).should('be.visible');
        cy.get(companySelector).type('Company Testing');

        cy.get('#profilePersonalForm button[type="submit"]').click();
        cy.get('.alert-success .alert-content').contains('Profile has been updated.');

        cy.get('.account-profile-change [href="#profile-email-form"]').click();
        cy.get('#profile-email-form').should('have.class', 'show');
        cy.get('#profile-password-form').should('not.have.class', 'show');

        cy.get('.account-profile-change [href="#profile-password-form"]').click();
        cy.get('#profile-password-form').should('have.class', 'show');
        cy.get('#profile-email-form').should('not.have.class', 'show');
    });
});
