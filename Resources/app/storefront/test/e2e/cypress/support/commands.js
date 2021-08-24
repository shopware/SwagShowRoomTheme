// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('typeAndSelect', {
    prevSubject: 'element'
}, (subject, value) => {
    cy.wrap(subject).select(value);
});

/**
 * Creates a variant product based on given fixtures "product-variants.json", 'tax,json" and "property.json"
 * with minor customisation
 * @memberOf Cypress.Chainable#
 * @name createProductVariantFixture
 * @function
 */
Cypress.Commands.add('createProductVariantFixture', () => {
    return cy.createDefaultFixture('tax', {
        id: '91b5324352dc4ee58ec320df5dcf2bf4',
    }).then(() => {
        return cy.createPropertyFixture({
            options: [{
                id: '15532b3fd3ea4c1dbef6e9e9816e0715',
                name: 'Red',
            }, {
                id: '98432def39fc4624b33213a56b8c944d',
                name: 'Green',
            }],
        });
    }).then(() => {
        return cy.createPropertyFixture({
            name: 'Size',
            options: [{name: 'S'}, {name: 'M'}, {name: 'L'}],
        });
    }).then(() => {
        return cy.searchViaAdminApi({
            data: {
                field: 'name',
                value: 'Storefront',
            },
            endpoint: 'sales-channel',
        });
    })
        .then((saleschannel) => {
            cy.createDefaultFixture('product', {
                visibilities: [{
                    visibility: 30,
                    salesChannelId: saleschannel.id,
                }],
            }, 'product-variants.json');
        });
});

/**
 * Takes a snapshot for percy visual testing
 * @memberOf Cypress.Chainable#
 * @name takeSnapshot
 * @param {String} title - Title of the screenshot
 * @param {String} [selectorToCheck = null] - Unique selector to make sure the module is ready for being snapshot
 * @param {Object} [width = {widths: [375, 768, 1920]}] - Screen width used for snapshot
 * @function
 */
Cypress.Commands.add('takeSnapshot', (title, selectorToCheck = null, width = {widths: [375, 768, 1920]}) => {
    if (!Cypress.env('usePercy')) {
        return;
    }

    if (selectorToCheck) {
        cy.get(selectorToCheck).should('be.visible');
    }

    if (!width) {
        cy.percySnapshot(title);
        return;
    }
    cy.percySnapshot(title, width);
});

/**
 * Cleans up any previous state by restoring database and clearing caches
 * @memberOf Cypress.Chainable#
 * @name cleanUpPreviousState
 * @function
 */
Cypress.Commands.overwrite('cleanUpPreviousState', (orig) => {
    if (Cypress.env('localUsage')) {
        return cy.exec(`${Cypress.env('shopwareRoot')}/bin/console e2e:restore-db`)
            .its('code').should('eq', 0);
    }

    return orig();
});

Cypress.Commands.add('initializePluginConfig', (config = 'paypal-config.json') => {
    return cy.fixture(config).then((data) => {
        return cy.requestAdminApi(
            'POST',
            `/api/_action/system-config/batch`,
            {
                data
            }
        )
    });
});
