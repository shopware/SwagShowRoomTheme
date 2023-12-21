describe('Error: maintenance page', { tags: ['@workflow'] }, () => {
    beforeEach(() => {
        cy.login()
            .then(() => {
                cy.searchViaAdminApi({
                    endpoint: 'sales-channel',
                    data: {
                        field: 'name',
                        value: 'Storefront'
                    }
                });
            })
            .then((salesChannel) => {
                // Enable Maintenance mode
                cy.updateViaAdminApi('sales-channel', salesChannel.id, {
                    data: {
                        maintenance: true
                    }
                });
            })
            .then(() => {
                cy.visit('/', { failOnStatusCode: false });
            })
            .then(() => {
                cy.get('.js-cookie-configuration-button > .btn').should('be.visible').click();
                cy.get('.js-offcanvas-cookie-submit').scrollIntoView().should('be.visible').click();
            });
    });

    it('@workflow: enable maintenance mode', () => {
        cy.get('.container-maintenance h2').contains('Maintenance mode');
        cy.get('.container-maintenance p').contains('We are currently updating this site. Please check back later.');
        cy.get('.container-maintenance img')
            .first()
            .should('have.attr', 'src')
            .and('match', /maintenance/);

        cy.get('.header-main').should('be.visible');
        cy.get('.footer-simple').should('be.visible');

        cy.login()
            .then(() => {
                cy.searchViaAdminApi({
                    endpoint: 'sales-channel',
                    data: {
                        field: 'name',
                        value: 'Storefront'
                    }
                });
            })
            .then((salesChannel) => {
                // Enable Maintenance mode
                cy.updateViaAdminApi('sales-channel', salesChannel.id, {
                    data: {
                        maintenance: false
                    }
                });
            })
            .then(() => {
                cy.visit('/', { failOnStatusCode: true });
            });
    });
});
