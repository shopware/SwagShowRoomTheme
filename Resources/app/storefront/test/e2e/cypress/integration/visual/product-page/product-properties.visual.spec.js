describe('Product Detail: Check appearance of product property', () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => {
                return cy.fixture('product-properties.json')
            })
            .then((productProperties) => {
                cy.createProductFixture(productProperties)
                    .then(() => {
                        return cy.createDefaultFixture('category');
                    })
                    .then(() => {
                        cy.visit('/');
                    });
            });
    });

    it('@visual @detail: verify product properties', () => {
        cy.visit('/ProductProperties/TEST');

        cy.get('.product-detail-properties-table').should('be.visible');
        cy.get('.product-detail-properties-table').contains('Height')
        cy.get('.product-detail-properties-table').contains('Textile:')
        cy.get('.product-detail-properties-table').contains('Color')

        cy.percySnapshot('[Product Detail] Properties', '.product-detail');
    });
});
