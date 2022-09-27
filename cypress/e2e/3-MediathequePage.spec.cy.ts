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

    it('should have "My Eurekas" section',()=>{
        cy.wait(10000)
        cy.visit('/en/mediatheque/geordanis-vega-127')
        cy.contains('My Eurekas',options)

        // cy.visit('/en/mediatheque/geordanis-vega-127',{
        //     // onLoad(win) {
        //     //     debugger;

        //     //     cy.wrap(win).its('__NEXT_DATA__').its('props').then(props=>{
        //     //         debugger;
        //     //         console.log(props)
        //     //     }) 
        //     // },
        // }).then(win=>{
        //     console.log(win,'win')
        //     cy.wrap(win).its('__NEXT_DATA__').its('props').its('pageProps').then(pageProps=>{
        //         console.log(pageProps)
        //     })
        // }) 

    })

    it('should have "Cycles I created or joined" section',()=>{
        cy.contains('Cycles I created or joined',options)
        cy.get('[data-cy="cycles-created-or-joined"]',options)
    })

    it('should have the "My ratings: movies and books I watched or read" section',()=>{
        cy.contains('My ratings: movies and books I watched or read',options)
        cy.get('[data-cy="my-books-movies"]',options)
    })

    it('should have the "Saved for later or forever" section',()=>{
        cy.contains('Saved for later or forever',options)
        cy.get('[data-cy="my-saved"]',options)
    })

    it('should have the "Users I follow" section',()=>{
        cy.contains('Saved for later or forever',options)
        cy.get('[data-cy="my-users-followed"]',options)
    })
    
})
export {}