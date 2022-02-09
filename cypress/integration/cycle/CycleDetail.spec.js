/// <reference types="cypress"/>
import {isComment, isPost} from '../../../src/types'

describe('CycleDetail suit',()=>{

  let user = {}
  beforeEach(()=>{
    cy.login(user);
  });

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
          participants:{
            some:{
              id:user.id
            }
          }         
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
        cy.get('[data-cy^="mosaic-item-comment"]:visible').should('have.length',cycleComments.length); // * 2 because we have duplicate card for mobile and descktop
        
        cy.get('[data-cy^="mosaic-item-comment"]:visible')
          .find('[data-cy="parent-title"]')
          .filter(`:contains(${cycle.title})`)
          .should('have.length',cycleOwnComments.length)// * 2 because we have duplicate card for mobile and descktop
             
      })

    });

    it('render post and quick comments sorted desc',()=>{
      const whereForACycleWithCommentsAndPosts = encodeURIComponent(
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
          posts:{
            some:{
              id:{
                gt:0
              }
            }
          },
          participants:{
            some:{
              id:user.id
            }
          }       
        })
      );
      cy.request(`/api/cycle?where=${whereForACycleWithCommentsAndPosts}&take=1`)
      .its('body')
      .should('have.property','data')
      .and((data)=>{
        expect(data).to.be.length.gte(1)              
        expect(data[0].comments).have.length.gte(1)
        expect(data[0].posts).have.length.gte(1)
      })
      .then(data=>{
        const cycle = data[0];
        const cycleComments = cycle.comments
        .filter((c) => !c.postId && !c.commentId)
        .sort((a,b) => a.createdAt > b.createdAt ? -1 : 1);


      const cyclePosts = cycle.posts
        .sort((a,b) => a.createdAt > b.createdAt ? -1 : 1);

      const items = [
        ... cycleComments,
        ... cyclePosts,
      ]
      .sort((a,b) => a.createdAt > b.createdAt ? -1 : 1)

      console.log(items);
      const first = items[0]
      let first_str_id = '';
      let last_str_id = '';
      const last = items.slice(-1)[0]

      if(isPost(first))
        first_str_id = `mosaic-item-post-${first.id}`;
      else if(isComment(first)) 
        first_str_id = `mosaic-item-comment-${first.id}`; 

      if(isPost(last))
        last_str_id = `mosaic-item-post-${last.id}`;
      else if(isComment(last)) 
        last_str_id = `mosaic-item-comment-${last.id}`; 

        cy.visit(`/cycle/${cycle.id}`);
        cy.get('[data-rr-ui-event-key="cycle-discussion"]')
          .click({force:true});
        
        cy.get('[data-cy="comments-and-posts"]')
          .find('[data-cy^="mosaic-item-"]:visible')
          .should('have.length',items.length)
          .first().invoke('attr','data-cy').should('eq',first_str_id)

        cy.get('[data-cy="comments-and-posts"]')
          .find('[data-cy^="mosaic-item-"]:visible')
          .should('have.length',items.length)
          .last().invoke('attr','data-cy').should('eq',last_str_id)          
             
      })

    });
    
});