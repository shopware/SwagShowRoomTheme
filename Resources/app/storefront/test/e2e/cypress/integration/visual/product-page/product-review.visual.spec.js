describe('Product Detail: Check appearance of product review', () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => {
                return cy.createProductFixture();
            })
            .then(() => {
                return cy.createCustomerFixtureStorefront();
            })
            .then(() => {
                cy.visit('/Product-name/RS-333');

                cy.get('.js-cookie-configuration-button .btn-primary').contains('Configure').click({force: true});
                cy.get('.offcanvas .btn-primary').contains('Save').click();

                cy.get('#review-tab').click();
            })
    });

    it('@visual, @review: show review tab', () => {
        cy.get('.product-detail-review-teaser-btn').should('be.visible');
        cy.get('.product-detail-review-list').contains('No reviews found');

        cy.takeSnapshot('[Product Detail] No review', '.product-detail-information',);
    });

    it('@visual, @review: should be able to submit review', () => {
        cy.get('.product-detail-review-teaser button').click();
        cy.get('.product-detail-review-login').should('be.visible');
        cy.takeSnapshot('[Product Detail] Review Login', '.product-detail-information',);

        cy.get('#loginMail').typeAndCheckStorefront('test@example.com');
        cy.get('#loginPassword').typeAndCheckStorefront('shopware');
        cy.get('.login-submit [type="submit"]').click();

        cy.visit('/Product-name/RS-333');
        cy.get('#review-tab').click();
        cy.get('.product-detail-review-teaser-btn').click();

        cy.takeSnapshot('[Product Detail] Review after login', '.product-detail-information');

        cy.get('#reviewTitle').type('Review title '.repeat(4));
        cy.get('#reviewContent').type('Review content '.repeat(10));
        cy.get('.product-detail-review-form-actions button').click();
        cy.get('.product-detail-review-list-content').should('be.visible');
        cy.takeSnapshot('[Product Detail] Review post', '.product-detail-information');
    });
});
