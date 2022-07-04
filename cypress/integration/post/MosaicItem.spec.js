/// <reference types="cypress"/>

describe('MosaicPostItem suit',()=>{
    
    beforeEach(()=>{
      cy.login();
    });

    it('post in cycle with the same cycle as parent',()=>{
      cy.visit('/about')
      .wait('@session')
      .then(interception=>{
        const session = interception.response.body;
        const user = session.user;

        const whereForPostInCycleWithCycleAsParent = encodeURIComponent(
          JSON.stringify({
            cycles:{
              some:{              
                NOT:{
                  title:''
                }
              }
            },
            works:{
              every:{
                id:{
                  in:[]
                }
              }
            }         
          })
        );
        cy.request(`/api/post?where=${whereForPostInCycleWithCycleAsParent}&take=1`)
        .its('body')
        .should('have.property','data')
        .and((data)=>{
          expect(data).to.be.length.gte(1)              
          expect(data[0].works).have.length.lt(1)
        })
        .then(data=>{
          const post = data[0];
          const parent = post.cycles[0];
          if(parent.acces ===1){//or implement loging and check if the user is participant
            cy.visit(`/cycle/${parent.id}`);
            cy.get('[data-rr-ui-event-key="cycle-discussion"]').click({force:true});
            cy.get([`data-cy=mosaic-item-post-${post.id}`]).then(card=>{
              let parentUrl = `/cycle/${parent.id}`;
              let postUrl = `/cycle/${parent.id}/post/${post.id}`;
              cy.wrap(card)
              .get('[data-cy="parent-title"]')
                .find(`[href="${parentUrl}"]`)
                .contains(parent.title)
              .get('[data-cy="post-title"]')
                .find(`[href="/cycle/${parent.id}/post/${post.id}"]`)
                .contains(post.title)
            })
  
          }
  
        })
      })

    })

    it('post in cycle with a work as parent',()=>{
      cy.visit('/about')
      .wait('@session')
      .then(interception=>{
        const session = interception.response.body;
        const user = session.user;
        
        const whereForPostInCycleWithWorkAsParent = encodeURIComponent(
          JSON.stringify({
            works:{
              some:{              
                NOT:{
                  title:''
                }
              }
            }
          })
        );
        cy.request(`/api/post?where=${whereForPostInCycleWithWorkAsParent}&take=1`)
        .its('body')
        .should('have.property','data')
        .and((data)=>{
          expect(data).to.be.length.gte(1)             
          expect(data[0].works).have.length(1)
        })
        .then(data=>{
          const post = data[0]
          const parent = post.works[0]
          const cycle = post.cycles[0];
          if(cycle.acces ===1){//or implement loging and check if the user is participant
            cy.visit(`/cycle/${cycle.id}`);
            cy.get('[data-rr-ui-event-key="cycle-discussion"]').click({force:true});
            cy.get([`data-cy=mosaic-item-post-${post.id}`]).then(card=>{
              let parentUrl = `/work/${parent.id}`;
              let postUrl = `/work/${parent.id}/post/${post.id}`;
              cy.wrap(card)
              .get('[data-cy="parent-title"]')
                .find(`[href="${parentUrl}"]`)
                .contains(parent.title)
              .get('[data-cy="post-title"]')
                .find(`[href="/work/${parent.id}/post/${post.id}"]`)
                .contains(post.title)
            })
          }
        })
      })
    })

});