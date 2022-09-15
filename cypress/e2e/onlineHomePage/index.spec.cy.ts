import { signIn } from "next-auth/react";

describe('Online home page',()=>{
    beforeEach(()=>{
        // signIn('credentials' ,{
        //     redirect:false,
        //     email:'gbanoaol@gmail.com',
        //     password:'gbanoaol@gmail.com1'
        //   })
        //   .then(res=>{
        //     const r = res as unknown as {error:string}
        //     if(res && r.error){
        //       return false
        //     }
        //     return true
        //   })
        
    })
    
    //en/
    it('should login works',()=>{
        cy.visit('/en')  
        cy.get('[data-cy="login-form"]').find('[type="email"]').type('gbanoaol@gmail.com',{force:true})
        cy.get('[data-cy="login-form"]').find('[type="password"]').type('gbanoaol@gmail.com1',{force:true})
        cy.get('[data-cy="login-form"]').find("[data-cy='btn-login']")
        .click({force:true})

        // cy.wait(10000)
        // signIn('credentials' ,{
        //     redirect:false,
        //     email:'gbanoaol@gmail.com',
        //     password:'gbanoaol@gmail.com1'
        //   })
        //   .then(res=>{
        //     const r = res as unknown as {error:string}
        //     if(res && r.error){
        //       return false
        //     }
        //     return true
        //   })
        

    })
    // it('should login works',()=>{
    //     cy.visit('/en')

    //     cy.intercept('/api/user/isRegistered?identifier=gbanoaol@gmail.com').as('isRegisteredReq')
    //     cy.intercept('/api/auth/session').as('authSessionReq')

    //     cy.get('[data-cy="login-form"]').within(()=>{
    //         cy.get('[type="email"]').type('gbanoaol@gmail.com',{force:true})
    //         cy.get('[type="password"]').type('gbanoaol@gmail.com1',{force:true})
    //         cy.get('[data-cy="btn-login"]')
    //         .click({force:true})

            
    //     })
        
    //     cy.wait('@isRegisteredReq').then((inter)=>{
    //         expect(inter.response?.body).to.have.nested.property('hasPassword')
    //         expect(inter.response?.body).to.have.nested.property('isUser')
    //     })

    //     cy.wait('@authSessionReq').then((inter)=>{
    //         expect(inter.response?.body).to.have.keys('user','expires')
    //         expect(inter.response?.body.user).to.have.nested.property('email')
    //         expect(inter.response?.body.user).to.have.nested.property('id')
    //         expect(inter.response?.body.user).to.have.nested.property('image')
    //         expect(inter.response?.body.user).to.have.nested.property('name')
    //         expect(inter.response?.body.user).to.have.nested.property('roles')
    //     })
    //     // signIn('credentials' ,{
    //     //     redirect:false,
    //     //     email:'gbanoaol@gmail.com',
    //     //     password:'gbanoaol@gmail.com1'
    //     //   })
    //     //   .then(res=>{
    //     //     const r = res as unknown as {error:string}
    //     //     if(res && r.error){
    //     //       return false
    //     //     }
    //     //     return true
    //     //   })
        
        
    // })
    
    // it('should contains main elements',()=>{
    //     cy.intercept('/api/auth/session').as('sessionReq')
    //     cy.wait('@sessionReq').then(inter=>{
    //         cy.wrap(inter).its('response').its('body').its('user').then(u=>{
    //             expect(u.email).to.be.eq('gbanoaol@gmail.com')
    //         })
    //     })
    // })
    
    it('should have a section "Cycles I created or joined"', ()=>{
        // cy.visit('/en')

        cy.contains('Cycles I created or joined')
        cy.get('[data-cy="myCycles"]')
    })

    it('should have in "Cycles I created or joined" the correct cycle mosaics qty', ()=>{
        const url = '/api/cycle?props=%7B%22where%22%3A%7B%22OR%22%3A%5B%7B%22participants%22%3A%7B%22some%22%3A%7B%22id%22%3A127%7D%7D%7D%2C%7B%22creatorId%22%3A127%7D%5D%7D%7D'
        cy.request(url).its('body').should('have.a.property','data').then(data=>{
            cy.get('[data-cy="myCycles"]').within(()=>{
                cy.get('[data-cy^="mosaic-item-cycle-"]').should('have.lengthOf',data.length)
            })
        })
    })

    it('should have a section "Trending topics"', ()=>{
        cy.contains('Trending topics')
        cy.get('[data-cy="tag"]')
    }) 

    it('should have a carousel "Gender and feminisms"',()=>{
        cy.contains('Gender and feminisms')
        // cy.get('[data-cy="carousel-gender-feminisms"]')
    })

    it('should load the carousel "Environment"',()=>{
        cy.scrollTo('bottom')
        cy.scrollTo('bottom')
        cy.contains('Environment')
        // cy.get('[data-cy="carousel-environment"]')
    })

    it('should have a "Create" button with link to creat Cycle, Eureka and Work',()=>{
        cy.contains('button','Create').click({force:true})
        cy.get('[class="dropdown-menu show"]')
        cy.get('[class="dropdown-item"]').contains('Cycle').should('have.attr','href','/en/cycle/create')
        cy.get('[class="dropdown-item"]').contains('Eureka').should('have.attr','href','/en/post/create')
        cy.get('[class="dropdown-item"]').contains('Work').should('have.attr','href','/en/work/create')
    })

    it('should have "My Mediatheque" link',()=>{
        cy.contains('My Mediatheque')
    })

    it('should have session button with actions: Edit Profile, Administrator dashboard and Logout',()=>{
        cy.get('[data-cy="session-actions"]').find('button').click({force:true})
        cy.contains('Edit Profile')
        cy.contains('Administrator dashboard')
        cy.contains('Logout')
    })

    it('should have the "Notification" section',()=>{
        cy.get('[data-cy="notifications-btn"]').find('button').click({force:true})
        cy.get('.NotificationsList')
    })

    

})


export {}