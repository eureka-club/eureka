/// <reference types="cypress"/>

describe('SearchEngine suite',()=>{
    beforeEach(()=>{
        cy.intercept('/api/*?q=*',(res)=>{
            console.log(res)
        }).as('items')
    })
    it('displayed without crash',()=>{
        cy.visit('/about')//because load faster :)
            .get('[data-cy="search-engine"]')
            .get('[type="text"]:visible')
            .type('feminismo')//if there is not data will not work correctly
            .wait('@items')//wait for the filters requests to cycle,post and work
            .get('[aria-label="menu-options"]:visible')
            .get('[class^="TypeaheadSearchItem_"]')
                .each(i=>{
                    cy.wrap(i).should('not.be.empty')
                })
    })
})