/// <reference types="cypress"/>

describe('TagsInput suite',()=>{

    beforeEach(()=>{
        cy.login()        
    });
    
    it('displayed without crash in profile page',()=>{
        cy.visit('/profile')
        cy.wait('@session')
        .then(interception=>{
            const session = interception.response.body;
            cy.request(`/api/user/${session.user.id}`)
            .then(res=>{
                const user = res.body;
                const tags = user.tags ? user.tags.split(","): [];
                if(tags.length){
                    cy.get('[data-cy="tag"]').then(tags=>{
                        
                        
                        expect(tags).to.be.length(user.tags.split(',').length)
                        cy.get('[data-cy="max"]')
                        .then(maxContainer=>{
                            expect(maxContainer).to.be.not.empty;
                            if(+maxContainer.first()[0].innerText > tags.length){
                                cy.get('[data-cy="new-tag"]').then(input=>{
                                    expect(input.is('button'))
                                })
                            }
                        })
    
                    })
                }
                else{
                    cy.get('[data-cy="tag"]').should('not.exist')
                }
            })

        })
        // 
        
        // .then(e=>{
        // })
        // cy.get('[data-cy="tags-input"]')
        //     .get('[data-cy="tags-container"]')
            //.should('have.length',user.tags.split(',').length)
          //  .get('[data-cy="max"]')
            
    })
})