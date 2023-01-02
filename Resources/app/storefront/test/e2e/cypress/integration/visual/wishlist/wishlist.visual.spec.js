import products from '../../../fixtures/listing-pagination-products.json';

const product = {
    "id": "6dfd9dc216ab4ac99598b837ac600368",
    "name": "Test product 1",
    "stock": 1,
    "productNumber": "RS-1",
    "descriptionLong": "Product description",
    "price": [
        {
            "currencyId": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
            "net": 8.40,
            "linked": false,
            "gross": 10
        }
    ],
    "url": "/product-name.html",
    "manufacturer": {
        "id": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
        "name": "Test variant manufacturer"
    },
};

describe('Wishlist: Check appearance of wishlist', () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => {
                cy.authenticate().then((result) => {
                    const requestConfig = {
                        headers: {
                            Authorization: `Bearer ${result.access}`
                        },
                        method: 'post',
                        url: `api/_action/system-config/batch`,
                        body: {
                            null: {
                                'core.cart.wishlistEnabled': true, // enable wishlist
                                'core.listing.productsPerPage': 4
                            }
                        }
                    };

                    return cy.request(requestConfig);
                });

                cy.createCustomerFixtureStorefront()
                    .then(() => {
                        cy.createProductFixture(product)
                            .then(() => {
                                cy.setCookie('wishlist-enabled', '1');
                            });
                    })
            })
    });

    it('@visual @wishlist: Wishlist empty page', () => {
        cy.visit('/wishlist');
        cy.takeSnapshot('[Wishlist] Empty page', '.wishlist-page');
    })

    it('@visual @wishlist: Wishlist state is set correctly', () => {
        cy.visit('/');

        cy.window().then((win) => {
            expect(win.salesChannelId).to.not.empty;
            expect(win.customerLoggedInState).to.equal(0);
            expect(win.wishlistEnabled).to.equal(1);

            cy.visit('/account/login');

            // // Login
            cy.get('.login-card').should('be.visible');
            cy.get('#loginMail').typeAndCheckStorefront('test@example.com');
            cy.get('#loginPassword').typeAndCheckStorefront('shopware');
            cy.get('.login-submit [type="submit"]').click();

            cy.window().then((win) => {
                expect(win.customerLoggedInState).to.equal(1);
            });
        })
        cy.visit('/');

        cy.window().then((win) => {
            cy.get('.header-actions-btn .header-wishlist-icon .icon-heart svg').should('be.visible');
        })

        cy.takeSnapshot('[Wishlist] Home page with wishlist enable', 'body');
    });

    it('@visual @wishlist: Heart icon badge display on product box in product listing', () => {
        cy.visit('/');

        cy.window().then((win) => {
            let heartIcon = cy.get(`.product-image-wrapper .product-wishlist-${product.id}`).first();

            heartIcon.should('be.visible');
            heartIcon.should('have.class', 'product-wishlist-not-added');
            heartIcon.get('.icon-wishlist-not-added').should('be.visible');
            heartIcon.should('not.have.class', 'product-wishlist-added');
            cy.takeSnapshot('[Wishlist] Product box with inactive wishlist icon', '.product-box');

            cy.get('.product-box').first().trigger('hover');
            cy.get(`.product-overlay .product-wishlist-${product.id}`).first().click();

            heartIcon = cy.get(`.product-image-wrapper .product-wishlist-${product.id}`).first();

            heartIcon.should('have.class', 'product-wishlist-added');
            heartIcon.get('.icon-wishlist-added').first().should('be.visible');
            heartIcon.should('not.have.class', 'product-wishlist-not-added');
            cy.takeSnapshot('[Wishlist] Product box with active wishlist icon', '.product-box');
        })
    });

    it('@visual @wishlist: Heart icon badge display in product detail', () => {
        cy.visit('/');
        cy.get('.js-cookie-configuration-button .btn-primary').contains('Configure').click({force: true});
        cy.get('.offcanvas .btn-primary').contains('Save').click();

        cy.window().then((win) => {
            cy.get('.product-box').first().trigger('hover');
            cy.get('.product-overlay .product-name').first().click();

            cy.get('.product-wishlist-action').first().should('be.visible');

            cy.get('.product-wishlist-btn-content.text-wishlist-not-added').first().should('be.visible');
            cy.get('.product-wishlist-btn-content.text-wishlist-remove').first().should('not.be.visible');
            cy.get('.product-wishlist-btn-content.text-wishlist-not-added').first().contains('Add to wishlist');

            cy.get('.product-wishlist-action').first().click();

            cy.get('.product-wishlist-btn-content.text-wishlist-remove').first().should('be.visible');
            cy.get('.product-wishlist-btn-content.text-wishlist-not-added').first().should('not.be.visible');
            cy.get('.product-wishlist-btn-content.text-wishlist-remove').first().contains('Remove from wishlist');
            cy.takeSnapshot('[Wishlist] Product detail', '.product-detail-buy');
        })
    });

    it('@visual @wishlist: Heart icon badge display the check mark', () => {
        cy.visit('/');

        cy.get('.product-box').first().trigger('hover');
        cy.get(`.product-overlay .product-wishlist-${product.id}`).first().click();
        cy.takeSnapshot('[Wishlist] Check mark', 'body');
    });

    it('@visual @wishlist: Heart icon badge display on product box in product listing pagination', () => {
        Array.from(products).forEach(product => cy.createProductFixture(product));

        cy.visit('/');

        Array.from(products).slice(0, 4).forEach(item => {
            let heartIcon = cy.get(`.product-image-wrapper .product-wishlist-${item.id}`,{timeout: 10000}).first();

            heartIcon.should('have.class', 'product-wishlist-not-added');
            heartIcon.should('not.have.class', 'product-wishlist-added');

            cy.get(`.product-overlay .product-wishlist-${item.id}`).first().click({force:true});

            heartIcon.should('have.class', 'product-wishlist-added');
            heartIcon.should('not.have.class', 'product-wishlist-not-added');
        });

        cy.get('.pagination-nav .page-next').eq(0).click();

        Array.from(products).slice(4, 8).forEach(item => {
            let heartIcon = cy.get(`.product-image-wrapper .product-wishlist-${item.id}`, {timeout: 10000}).first();

            heartIcon.should('have.class', 'product-wishlist-not-added');
            heartIcon.should('not.have.class', 'product-wishlist-added');

            cy.get(`.product-overlay .product-wishlist-${item.id}`).first().click({force: true});

            heartIcon.should('have.class', 'product-wishlist-added');
            heartIcon.should('not.have.class', 'product-wishlist-not-added');
        });

        cy.takeSnapshot('[Wishlist] Wishlist page', '.cms-block-product-listing');
    });
});
