import { signIn } from "next-auth/react"

describe('Mediatheque page',()=>{
    const options = {timeout:30000}
    const url = '/en/mediatheque/geordanis-vega-127'

    beforeEach(()=>{
        // cy.intercept('api/auth/session',{fixture:'session.json'}).as('reqSession')
        signIn('credentials' ,{
            redirect:false,
            email:'gbanoaol@gmail.com',
            password:'gbanoaol@gmail.com1'
          })
          .then(res=>{
            const r = res as unknown as {error:string}
            if(res && r.error){
              return false
            }
            return true
          })
    })
    afterEach(()=>{
    })

    it('should have a link "My Mediatheque"',()=>{
        cy.visit('/en')  
        cy.get('[data-cy="my-mediatheque-link"]')
        .should('have.attr','href')
        .should('eq',url)
    })

    // it('should login works',()=>{
    //     cy.visit('/en')  
    //     cy.get('[data-cy="login-form"]',options).find('[type="email"]').type('gbanoaol@gmail.com',{force:true})
    //     cy.get('[data-cy="login-form"]',options).find('[type="password"]').type('gbanoaol@gmail.com1',{force:true})
    //     cy.get('[data-cy="login-form"]',options).find("[data-cy='btn-login']")
    //         .click({force:true})

    // })

    it('should have "Cycles I created or joined" section',()=>{
        cy.get('[data-cy="my-mediatheque-link"]').click()

        // cy.wait(10000)

        let urlC = '/api/cycle?props=%7B%22where%22%3A%7B%22OR%22%3A%5B%7B%22participants%22%3A%7B%22some%22%3A%7B%22id%22%3A127%7D%7D%7D%2C%7B%22creatorId%22%3A127%7D%5D%7D%7D'
        cy.request(urlC,options).its('body',options).then(body=>{
            const {data}= body
            cy.contains('Cycles I created or joined',options)
            cy.get('[data-cy="cycles-created-or-joined"]',options)

            cy.get('[data-cy^="mosaic-item-cycle-"]',options).should('have.length',data.length)
        })
        
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