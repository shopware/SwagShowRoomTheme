const selector = {
    footerLinkContact: '.footer-contact-form a[data-bs-toggle="modal"]',
    formContactModal: '.modal form[action="/form/contact"]',
    formContact: '.cms-page form[action="/form/contact"]',
    formContactSalutation: '#form-Salutation',
    formContactFirstName: '#form-firstName',
    formContactLastName: '#form-lastName',
    formContactMail: '#form-email',
    formContactPhone: '#form-phone',
    formContactSubject: '#form-subject',
    formContactComment: '#form-comment',
    formContactDataProtectionCheckbox: '.privacy-notice input[type="checkbox"]',
    formContactButtonSubmit: 'button[type="submit"]',
    modalButtonDismiss: 'button[data-dismiss="modal"]'
}

describe('Contact: Visual tests', () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => cy.createProductFixture())
            .then(() => cy.loginViaApi())
            .then(() => cy.createCmsFixture())
            .then(() => cy.visit('/'))
            .then(() => {
                cy.get('.js-cookie-configuration-button > .btn').should('be.visible').click();
                cy.get('.offcanvas-cookie > .btn').scrollIntoView().should('be.visible').click();
            });
    });

    function fillOutContactForm(el) {
        cy.get(el).within(() => {
            cy.get(selector.formContactSalutation).select('Not specified');
            cy.get(selector.formContactFirstName).type('Foo');
            cy.get(selector.formContactLastName).type('Bar');
            cy.get(selector.formContactMail).type('user@example.com');
            cy.get(selector.formContactPhone).type('+123456789');
            cy.get(selector.formContactSubject).type('Lorem ipsum');
            cy.get(selector.formContactComment).type('Dolor sit amet.');
            cy.get(selector.formContactDataProtectionCheckbox).check({force: true});
        });
    }

    function assignContactFormToHomepage() {
        cy.intercept({
            url: `${Cypress.env('apiPath')}/category/*`,
            method: 'PATCH'
        }).as('saveCategory');

        cy.get('.sw-category-tree__inner .sw-tree-item__element').contains('Home').click();
        cy.get('.sw-category-detail__tab-cms').click();
        cy.get('.sw-card.sw-category-layout-card').scrollIntoView();
        cy.get('.sw-category-detail-layout__change-layout-action').click();
        cy.get('.sw-modal__dialog').should('be.visible');

        cy.get('.sw-cms-layout-modal__content-item--0 .sw-field--checkbox').click();
        cy.get('.sw-modal .sw-button--primary').click();
        cy.get('.sw-card.sw-category-layout-card .sw-category-layout-card__desc-headline').contains('Test Contact Form Page');

        // Save layout
        cy.get('.sw-category-detail__save-action').click();

        cy.wait('@saveCategory').its('response.statusCode').should('equal', 204)
    }

    function createContactFormPage() {
        let salesChannel;

        return cy.searchViaAdminApi({
            endpoint: 'sales-channel',
            data: {
                field: 'name',
                type: 'equals',
                value: 'Storefront'
            }
        }).then((data) => {
            salesChannel = data.id;
            cy.createDefaultFixture('cms-page', {}, 'cms-contact-page')
        }).then(() => {
            cy.openInitialPage(`${Cypress.env('admin')}#/sw/category/index`);
            assignContactFormToHomepage();
        });
    }

    it('@visual: open contact form modal', () => {
        cy.intercept({
            url: '/form/contact',
            method: 'POST'
        }).as('contactFormPostRequest');

        cy.visit('/');

        cy.get('.footer-contact-form a').click();
        cy.get('.modal').should('be.visible');
        cy.get('.modal .card-title').contains('Contact');

        fillOutContactForm(selector.formContactModal);

        cy.takeSnapshot('[Contact] Fill in information to contact form modal', '.modal');

        cy.get(selector.formContactModal).within(() => {
            cy.get(selector.formContactButtonSubmit).scrollIntoView().click();
        });

        cy.wait('@contactFormPostRequest').its('response.statusCode').should('equal', 200);

        cy.get('.modal').within(() => {
            cy.get('.confirm-message').contains('We have received your contact request and will process it as soon as possible.')

        });

        cy.takeSnapshot('[Contact] Contact form modal submit', '.modal');
    });

    it.skip('@visual: create contact form page', () => {
        createContactFormPage();

        cy.visit('/');
        cy.intercept({
            url: '/form/contact',
            method: 'POST'
        }).as('contactFormPostRequest');

        cy.get('.cms-page .card-title').contains('Contact');

        fillOutContactForm(selector.formContact);

        cy.get(selector.formContact).within(() => {
            cy.get(selector.formContactButtonSubmit).scrollIntoView().click();
        });

        cy.wait('@contactFormPostRequest').its('response.statusCode').should('equal', 200)

        cy.get('.cms-page').within(() => {
            cy.get('.confirm-message').contains('We have received your contact request and will process it as soon as possible.')

        });
    });
});
