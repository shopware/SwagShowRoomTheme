import ProductPageObject from "../../../support/pages/sw-product.page-object";

describe('Product Detail: Check appearance of product variants', () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => {
                cy.loginViaApi();
            })
            .then(() => {
                cy.createProductVariantFixture();
            })
            .then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/product/index`);
            });
    });

    it('@visual @variants: add multidimensional variant to product', () => {
        const page = new ProductPageObject();

        // Navigate to variant generator listing and start
        cy.clickContextMenuItem(
            '.sw-entity-listing__context-menu-edit-action',
            page.elements.contextMenuButton,
            `${page.elements.dataGridRow}--0`
        );

        cy.get('.sw-product-detail__tab-variants').click();
        cy.get(page.elements.loader).should('not.exist');
        cy.contains('.sw-button--ghost', 'Generate variants').click();

        // Add another group to create a multidimensional variant
        cy.get('.sw-product-modal-variant-generation').should('be.visible');
        page.generateVariants('Size', [0, 1, 2], 6);

        // Asign product to Home category
        cy.get('.sw-product-detail__tab-general').click();
        cy.get('.sw-product-detail-base__visibility-structure').scrollIntoView()

        cy.get('.sw-category-tree__input-field').focus();
        cy.get('.sw-category-tree-field__results').should('be.visible');
        cy.get('.sw-tree-item__element').contains('Home').parent().parent()
            .find('.sw-field__checkbox input')
            .click({force: true});
        cy.get('.sw-category-tree-field__selected-label').contains('Home').should('be.visible');
        cy.get('.sw-product-detail__save-action').click();

        // Verify in storefront
        cy.visit('/');
        cy.get('.search-toggle-btn').click();
        cy.get('input[name=search]').type('Variant product name');
        cy.get('.search-suggest-container').should('be.visible');
        cy.get('.search-suggest-product-name')
            .contains('Variant product name')
            .click();

        cy.get('.product-detail-name').contains('Variant product name');
        cy.get('.product-detail-configurator-option-label').contains('Red')
        cy.get('.product-detail-configurator-option-label').contains('S')

        cy.takeSnapshot('[Product Detail] Product variants', '.product-detail');
    });
});
