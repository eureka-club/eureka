describe('Online home page',()=>{
    beforeEach(()=>{
        
    })
    
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
        cy.wait('@sessionReq',{timeout:30000}).then(inter=>{
            cy.wrap(inter).its('response').its('body').its('user').then(u=>{
                expect(u.email).to.be.eq('gbanoaol@gmail.com')
            })
        })
    })

    it('should have a section "Cycles I created or joined"', ()=>{
        cy.contains('Cycles I created or joined')
        cy.get('[data-cy="myCycles"]')
    })

    it('should have a section "Trending topics"', ()=>{
        cy.contains('Trending topics')
        cy.get('[data-cy="tag"]')
    }) 

    it('should have a carousel "Gender and feminisms"',()=>{
        cy.contains('Gender and feminisms')
        cy.get('[data-cy-="carousel-gender-feminisms"]')
    })

    it('should load the carousel "Environment"',()=>{
        cy.scrollTo('bottom')
        cy.scrollTo('bottom')
        cy.contains('Environment',{timeout:30000})
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

    // it('should have a label carousel for "Cycles I created or joined"', ()=>{
    //     // cy.intercept('/api/cycle\?props=*').as('cyclesCreatedOrJoinedReq')

    //     // cy.wait('@cyclesCreatedOrJoinedReq',{timeout:30000}).then((inter)=>{
    //     //     cy.contains('Cycles I created or joined');
    //     //     cy.wrap(inter)
    //     //         .its('response.body')
    //     //         .then(body=>{
    //     //                 console.log(body,'body')
    //     //                 cy.wrap(body).should('have.a.property','data')
        
    //     //                 cy.get('[data-cy="myCycles"]').within(()=>{
    //     //                     cy.get('[data-cy^="mosaic-item-cycle-"]').should('have.lengthOf',body.data.length)
    //     //                 })
        
    //     //             })

    //     // })
    // })

})


export {}