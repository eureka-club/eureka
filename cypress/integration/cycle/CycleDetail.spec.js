/// <reference types="cypress"/>
describe('CycleDetail suit',()=>{
    
    it('render comments under the cycle with the correct parent',()=>{
      
      const whereForACycleWithComments = encodeURIComponent(
        JSON.stringify({
          comments:{
            some:{              
              cycleId:{
                gt:0
              },
              AND:{
                postId:{
                  gt:0
                }
              }
            }
          },
                   
        })
      );
      cy.request(`/api/cycle?where=${whereForACycleWithComments}&take=1`)
      .its('body')
      .should('have.property','data')
      .and((data)=>{
        expect(data).to.be.length.gte(1)              
        expect(data[0].comments).have.length.gte(1)
      })
      .then(data=>{
        const cycle = data[0];
        const cycleComments = cycle.comments.filter((c) => !c.postId && !c.commentId);
        const cycleOwnComments = cycle.comments.filter((c) => !c.postId && !c.commentId && !c.workId);

        cy.visit(`/cycle/${cycle.id}`);
        cy.get('[data-rr-ui-event-key="cycle-discussion"]').click({force:true});
        cy.get('[data-cy="mosaic-item-comment"]').should('have.length',cycleComments.length * 2); // * 2 because we have duplicate card for mobile and descktop
        
        cy.get('[data-cy="mosaic-item-comment"]')
          .find('[data-cy="parent-title"]')
          .filter(`:contains(${cycle.title})`)
          .should('have.length',cycleOwnComments.length * 2)// * 2 because we have duplicate card for mobile and descktop
             
      })

    })
    
});