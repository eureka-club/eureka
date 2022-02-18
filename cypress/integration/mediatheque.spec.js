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
            cy.visit(`/mediatheque/${session.user.id}`)
            .get('[data-cy="mediatheque"]')
        })
    })
})