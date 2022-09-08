describe('Online home page',()=>{
    it('should login works',()=>{
        cy.visit('/en')
        cy.get('[data-cy="login-form"]').within(()=>{
            cy.get('[type="email"]').type('gbanoaol@gmail.com',{force:true})
            cy.get('[type="password"]').type('gbanoaol@gmail.com1',{force:true})
            cy.get('[data-cy="btn-login"]').click({force:true})
        })
    })
    it('should contains main elements',()=>{
        cy.intercept('/api/auth/session').as('sessionReq')
        cy.wait('@sessionReq').then(inter=>{
            cy.wrap(inter).its('response').its('body').its('user').then(u=>{
                expect(u.email).to.be.eq('gbanoaol@gmail.com')
            })
        })

    })
    it('should have a carousel for "Cycles I created or joined"', ()=>{
        
        const url = `/api/cycle?props=*`
        cy.intercept({method:'GET',url}).as('cyclesCreatedOrJoinedReq')
        
        cy.wait('@cyclesCreatedOrJoinedReq').then(inter=>{
            cy.contains('Cycles I created or joined')
            cy.wrap(inter).its('response.body').then(body=>{
                console.log(body,'body')
                cy.wrap(body).should('have.a.property','data')

                cy.get('[data-cy="myCycles"]').within(()=>{
                    cy.get('[data-cy^="mosaic-item-cycle-"]').should('have.lengthOf',body.data.length)
                })

            })
        })
    }) 
})


export {}