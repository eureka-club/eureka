import { should } from "chai"

describe('Offline home page',()=>{
    // it('should be found',()=>{
    //     cy.visit('/en')
    // })
    // it('should have a login form',()=>{
    //     cy.get('form')
    // })
    // it('should have a explorer button',()=>{
    //     cy.contains('Explore')
    // })
    // it('should have a explorer button linked to /explore page',()=>{
    //      cy.intercept('/api/*').as('apiCall')
    //     cy.get('[data-cy="btn-explore"]').click({force:true})
    //     cy.wait('@apiCall').then(()=>{
    //         cy.url().should('include', '/explore')
    //     })
    // })
    it('should login works',()=>{
        cy.visit('/en')
        cy.intercept('/api/user/isRegistered?identifier=gbanoaol@gmail.com').as('isRegisteredReq')
        cy.get('form')
        cy.get('form').find('[type="password"]').type('gbanoaol@gmail.com1',{force:true})
        cy.get('form').find('[type="email"]').type('gbanoaol@gmail.com',{force:true})
        cy.get('form').find("[data-cy='btn-login']").click({force:true})
        cy.wait('@isRegisteredReq').then((res)=>{
            expect(res.response?.body).to.have.nested.property('hasPassword')
            expect(res.response?.body).to.have.nested.property('isUser')

        })
        

    })
})
export {}