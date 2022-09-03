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
        cy.intercept('/api/cycle?props=*').as('featuredCyclesReq')
        cy.get('[data-cy="btn-explore"]').click({force:true})
        cy.wait('@featuredCyclesReq').then((inter)=>{
            cy.url().should('include', '/explore')
            expect(inter.response?.body).to.have.keys('data','fetched','total')
            expect(inter.response?.body.data).to.have.length.gt(0)

        })
    })
    it('should login works',()=>{
        cy.visit('/en')
        cy.intercept('/api/user/isRegistered?identifier=gbanoaol@gmail.com').as('isRegisteredReq')
        cy.get('form')
        cy.get('form').find('[type="email"]').type('gbanoaol@gmail.com',{force:true})
        cy.get('form').find('[type="password"]').type('gbanoaol@gmail.com1',{force:true})
        cy.get('form').find("[data-cy='btn-login']").click({force:true})
        cy.wait('@isRegisteredReq').then((inter)=>{
            expect(inter.response?.body).to.have.nested.property('hasPassword')
            expect(inter.response?.body).to.have.nested.property('isUser')

        })
        cy.intercept('/api/auth/session').as('authSessionReq')
        cy.wait('@authSessionReq').then((inter)=>{
            expect(inter.response?.body).to.have.keys('user','expires')
            expect(inter.response?.body.user).to.have.nested.property('email')
            expect(inter.response?.body.user).to.have.nested.property('id')
            expect(inter.response?.body.user).to.have.nested.property('image')
            expect(inter.response?.body.user).to.have.nested.property('name')
            expect(inter.response?.body.user).to.have.nested.property('roles')
        })

    })
})
export {}