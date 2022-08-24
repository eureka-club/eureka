describe('Offline home page',()=>{
    it('should be found',()=>{
        cy.visit('/en')
    })
    it('should have a login form',()=>{
        cy.get('form')
    })
    it('should have a explorer button',()=>{
        cy.contains('Explore')
    })
    it('should have a explorer button linked to /explore page',()=>{
         cy.intercept('/api/*').as('apiCall')
        cy.get('[data-cy="btn-explore"]').click({force:true})
        cy.wait('@apiCall').then(()=>{
            cy.url().should('include', '/explore')
        })
    })
})
export {}