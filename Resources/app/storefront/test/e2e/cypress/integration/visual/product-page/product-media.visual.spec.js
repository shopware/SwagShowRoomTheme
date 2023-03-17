import ProductPageObject from "../../../support/pages/sw-product.page-object";

describe('Product Detail: Product media', () => {
    before(() => {
        cy.setToInitialState()
            .then(() => cy.login())
            .then(() => cy.visit(`${Cypress.env('admin')}#/sw/media/index`));
    });

    beforeEach(() => {
        return cy.createProductFixture()
            .then(() => cy.fixture('product'))
    });

    it('@visual @detail: check appearance of basic product media workflow', () => {
        const page = new ProductPageObject();

        cy.visit(`${Cypress.env('admin')}#/sw/product/index`);

        // Request we want to wait for later
        cy.intercept({
            path: `**/api/_action/sync`,
            method: 'post'
        }).as('saveProduct');

        // Open product
        cy.clickContextMenuItem(
            '.sw-entity-listing__context-menu-edit-action',
            page.elements.contextMenuButton,
            `${page.elements.dataGridRow}--0`
        );

        // Add first image to product
        cy.get('.sw-product-media-form__previews').scrollIntoView();
        cy.get('.sw-product-media-form .sw-media-upload-v2__file-input')
            .attachFile('img/sw-product-preview.jpg');
        cy.get('.sw-product-image__image img')
            .should('have.attr', 'src')
            .and('match', /sw-product-preview/);
        cy.awaitAndCheckNotification('File has been saved.');

        // Save product
        cy.get(page.elements.productSaveAction).click();
        cy.wait('@saveProduct').then((xhr) => {
            expect(xhr.response).to.have.property('statusCode', 200);
        });

        // Verify in storefront
        cy.visit('/');
        cy.get('.product-box').trigger('hover');
        cy.get('.product-overlay .product-name').click();
        cy.get('.gallery-slider-single-image > .img-fluid').should('be.visible');
        cy.get('.gallery-slider-single-image > .img-fluid')
            .should('have.attr', 'src')
            .and('match', /sw-product-preview/);

        // Take snapshot for visual testing
        cy.takeSnapshot('[Product Detail] Product image', '.gallery-slider-single-image > .img-fluid');
    });
});
