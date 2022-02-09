/// <reference types="cypress"/>

describe('MosaicPostItem suit',()=>{
    let user = {}
    beforeEach(()=>{
      cy.login(user);
    });

    it('post in cycle with the same cycle as parent',()=>{
      
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

    it('post in cycle with a work as parent',()=>{
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

    it('check actions bar is displayed correctly',()=>{
      const whereQuery = encodeURIComponent(
        JSON.stringify({
          posts:{
            some:{
              creatorId:user.id
            }
          },    
          comments:{
            some:{
              creatorId:user.id
            }
          },  
        })
      );
      cy.request(`/api/cycle?where=${whereQuery}&take=1`)
      .its('body')
      .should('have.property','data')
      .and((data)=>{
        expect(data).to.be.length.gte(1)              
        expect(data[0].posts).have.length.gte(1)
        expect(data[0].comments).have.length.gte(1)
      })
      .then(data=>{
        const cycle = data[0];
        const postsCreatedByUser = cycle.posts.filter(p=>p.creatorId === user.id).map(p=>p.id);
      
        cy.visit(`/cycle/${cycle.id}`);
        cy.get('[data-rr-ui-event-key="cycle-discussion"]').click({force:true});

        cy.get(`[data-cy^="mosaic-item-post-"]:visible`)
          .get('[data-cy="actions-bar"]:visible').should('have.length',postsCreatedByUser.length)
        
      })
        
    })

    // it.only('intercepting useCycle',()=>{//not working always because react-query cache -that avoid new requests
    //   cy.intercept('GET','**/cycle/*',(req)=>{
    //     console.log('intercepted',req)
    //   })
    //   cy.visit('http://localhost:3000/cycle/28');
            
    //  })

});