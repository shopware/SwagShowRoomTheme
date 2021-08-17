describe('Error: 404 page', { tags: ['@workflow'] },  () => {
    it('@workflow: should navigate to 404 page with full layout', () => {
        // Check 404 default site
        // We want to visit 404 page, so we need to accept that status code
        cy.visit('/non-existent/', {
            failOnStatusCode: false
        });
        cy.get('.container-404 p')
            .contains('We are sorry, the page you\'re looking for could not be found.');
        cy.get('.container-main img')
            .first()
            .should('have.attr', 'src')
            .and('match', /404/);
        cy.get('.btn').contains('Back to homepage');

        // Check Header and Footer
        cy.get('.header-main').should('be.visible');
        cy.get('.footer-main').should('be.visible');
    });
});
