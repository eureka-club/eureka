describe('Offline home page',()=>{
    it('should be found',()=>{
        cy.visit('/en')
    })
    it('should have language links',()=>{
        cy.get('[data-cy="link-language"]')
        .find('button')
        .click({force:true})
        cy.get('[data-cy="links-language"]')
        .find('a').each(a=>{
            cy.wrap(a)
            .find('img')
            .should('have.attr','src')
            .should('match',/(es|en|fr|pt).(png|webp)$/)
        })
    })
    it('should have a login button',()=>{
        cy.get('[data-cy="btn-login"]')
    })
    
    it('should have a login form',()=>{
        cy.get('form')
    })
    it('should have a link with about links nested',()=>{
        cy.viewport(1300, 750)
        cy.get('[data-cy="link-about"]')
        .find('button')
        .click({force:true})
        cy.get('[data-cy="links-about"]')
        .find('a').each(a=>{
            const linksText = ['Manifesto','FAQ','People','Privacy Policy']
            expect(linksText).includes(a.text())
        })
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