/// <reference types="cypress"/>

describe('SearchEngine suite',()=>{
    it('displayed without crash',()=>{
        cy.visit('/about')//because load faster :)
            .get('[data-cy="search-engine"]')
            .get('[type="text"]:visible')
            .type('feminismo')//if there is not data will not work correctly
            .get('[aria-label="menu-options"]:visible')
            .get('[class^="TypeaheadSearchItem_"]')
                .each(i=>{
                    cy.wrap(i).should('not.be.empty')
                })
    })
})