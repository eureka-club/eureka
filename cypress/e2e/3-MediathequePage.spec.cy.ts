describe('Mediatheque page',()=>{
    const options = {timeout:15000}
    beforeEach(()=>{
    })
    afterEach(()=>{
    })

    it('should login works',()=>{
        cy.visit('/en')  
        cy.get('[data-cy="login-form"]',options).find('[type="email"]').type('gbanoaol@gmail.com',{force:true})
        cy.get('[data-cy="login-form"]',options).find('[type="password"]').type('gbanoaol@gmail.com1',{force:true})
        cy.get('[data-cy="login-form"]',options).find("[data-cy='btn-login']")
            .click({force:true})

    })

    it('should have "Cycles I created or joined" section',()=>{
        cy.wait(10000)
        cy.visit('/en/mediatheque/geordanis-vega-127')

        let url = '/api/cycle?props=%7B%22where%22%3A%7B%22OR%22%3A%5B%7B%22participants%22%3A%7B%22some%22%3A%7B%22id%22%3A127%7D%7D%7D%2C%7B%22creatorId%22%3A127%7D%5D%7D%7D'
        cy.request(url).its('body').then(body=>{
            const {data}= body
            cy.contains('Cycles I created or joined',options)
            cy.get('[data-cy^="mosaic-item-cycle-"]').should('have.length',data.length)
        })
        
    })

    // it('should have "Cycles I created or joined" section',()=>{
    //     cy.contains('Cycles I created or joined',options)
    //     cy.get('[data-cy="cycles-created-or-joined"]',options)
    // })

    // it('should have the "My ratings: movies and books I watched or read" section',()=>{
    //     cy.contains('My ratings: movies and books I watched or read',options)
    //     cy.get('[data-cy="my-books-movies"]',options)
    // })

    // it('should have the "Saved for later or forever" section',()=>{
    //     cy.contains('Saved for later or forever',options)
    //     cy.get('[data-cy="my-saved"]',options)
    // })

    // it('should have the "Users I follow" section',()=>{
    //     cy.contains('Saved for later or forever',options)
    //     cy.get('[data-cy="my-users-followed"]',options)
    // })
    
})
export {}