describe('Offline home page',()=>{
    it('should be found',()=>{
        cy.visit('/en')
    })
    //en/
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
    it('should have a login form',()=>{
        cy.get('[data-cy="login-form"]').find('[type="email"]')
        cy.get('[data-cy="login-form"]').find('[type="password"]')
        cy.get('[data-cy="login-form"]').find("[data-cy='btn-login']")
    })
    it('should have a login button',()=>{
        cy.get('[data-cy="btn-login"]')
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
    it('should have the search engine and works',()=>{
        cy.get('[data-cy="search-engine"]').within(()=>{
            cy.get('[data-cy="search-engine-control"]').type('femin').type('{enter}')
            cy.url({timeout:30000}).should('match',/search\?q=femin/)
        })
    })
    //en/explore
    it('should have a explorer button linked to /explore page',()=>{
        cy.visit('/en')
        cy.get('[data-cy="btn-explore"]').click({force:true})
    })
    it('should have the explore a section "Featured Cycles"',()=>{
        cy.contains('Featured Cycles')
    })
    it('should the "Featured Cycles" have the correct cycles qty',()=>{
        const url = '/api/cycle?props=%7B%22take%22%3A8%2C%22where%22%3A%7B%22OR%22%3A%5B%7B%22AND%22%3A%5B%7B%22title%22%3A%7B%22contains%22%3A%22femin%22%7D%7D%5D%7D%2C%7B%22AND%22%3A%5B%7B%22contentText%22%3A%7B%22contains%22%3A%22femin%22%7D%7D%5D%7D%2C%7B%22AND%22%3A%5B%7B%22tags%22%3A%7B%22contains%22%3A%22femin%22%7D%7D%5D%7D%2C%7B%22AND%22%3A%5B%7B%22topics%22%3A%7B%22contains%22%3A%22femin%22%7D%7D%5D%7D%5D%2C%22AND%22%3A%7B%22access%22%3A%7B%22in%22%3A%5B1%2C2%5D%7D%7D%7D%7D'
        cy.request(url).its('body').should('have.a.property','data').then(data=>{
            cy.url().should('include', '/explore')
            expect(data).to.have.length.gt(0)
        })
    })
    
})
export {}