describe('Home page', { tags: ['@workflow', '@home'] }, () => {
    it('should be able to open up the home page', () => {
        cy.visit('/', { failOnStatusCode: true });

        cy.get('.header-logo-main-link').should('be.visible');
    });
});
