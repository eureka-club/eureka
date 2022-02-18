/// <reference types="cypress"/>

describe('Mediatheque suite',()=>{
    beforeEach(()=>{
        cy.login();
    })
    it('displayed without crash',()=>{
        cy.visit('/about')
        cy.wait('@session')
        .then(interception=>{
            const session = interception.response.body;
            cy.visit(`/cycle/13/post/273`)
            .get('[data-cy="post-detail"]')
        })
    })
})