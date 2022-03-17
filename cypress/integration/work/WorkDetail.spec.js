/// <reference types="cypress"/>
import { WorkplaceShareButton } from 'react-share';
import {PostMosaicItem} from '@/types/post';
import {isComment, isPost} from '../../../src/types'
import {getPosts} from '../../../src/usePosts'
describe('WorkDetail suit',()=>{

  beforeEach(()=>{
      cy.login();
    
    // const whereForWorkInACycle = encodeURIComponent(
    //   JSON.stringify({
    //     cycles:{
    //       some:{
    //         id:{
    //           gt:0
    //         }
    //       }
    //     },
    //     posts:{
    //       some:{
    //         id:{
    //           gt:0
    //         }
    //       }
    //     },     
    //   })
    // );
    // cy.request(`/api/work?where=${whereForWorkInACycle}&take=1`).as('work')
    //     .its('body')
    //     .should('have.property','data')
    //     .and((data)=>{
    //       expect(data).to.be.length.gte(1)              
    //       expect(data[0].posts).have.length.gte(1)
    //       expect(data[0].cycles).have.length.gte(1)
    //     })
  });
    it('has the mosaic card',()=>{
      cy.get('@work')
      .then(({body})=>{
        const work = body.data[0];
        cy.get(`[data-cy="mosaic-item-work-${work.id}"]`).should('not.be.empty')
      })
    })

    
    it.only('show public posts from a work not belongs to a cycle',()=>{
      const whereWorkWithPublicPostsAndWithoutCycle = {
        cycles:{
          none:{}
        },
        posts:{
          some:{
            id:{gt:1}
          }
        },      
      }
      cy.request(`/api/work?where=${encodeURIComponent(JSON.stringify(whereWorkWithPublicPostsAndWithoutCycle))}`)
      .as('workWithPostsAndWithoutCycle')
      .get('@workWithPostsAndWithoutCycle')
      .its('body')
      .should('have.property','data')
      .should('have.length.gte',1)
      .then((data)=>{
        console.log(data,'works')
        const work = data[0]
        const wherePosts = encodeURIComponent(JSON.stringify({
          works:{some:{id:work.id}}
        }))
        cy.request(`/api/post?where=${wherePosts}`)
        .as('posts')
        .get('@posts')
        .its('body')
        .should('have.property','data')
        .should('have.length.gte',1)
        .then((data)=>{
          cy.visit(`/work/${work.id}`)
          .get('[data-cy="posts"]')
          .click({force:true})
          .get('[data-cy="items"]:visible')
          .find('[data-cy^="mosaic-item-post-"]:visible')
          .then(items=>{
            expect(items).have.length(data.length)
          })
          
        })
      })
    })
    

    // it('render only comments that belongs to this context',()=>{
    //   cy.visit('/about')
    //   .get('@work')
    //   .then(({body})=>{
    //     const work = body.data[0];
    //     const workComments = work.comments.filter(c=>!c.cycleId && !c.postId)//directly comments only
    //     cy.visit(`/work/${work.id}`)
    //     console.log(workComments,'workComments')

    //     if(workComments.length)
    //       cy.get(`[data-cy^="comment-cmp-"]:visible`).then(comments=>{
    //         cy.wrap(comments)
    //         .should('have.length',workComments.length)
    //         for(let c of workComments)
    //           cy.wrap(comments).get(`[data-cy="comment-cmp-${c.id}"]`)  
    //       })
    //     else{
    //       cy.get(`[data-cy^="comment-cmp-"]:visible`).should('not.exist')
    //     }
          
    //   })
    // })
    /* it.only('render parent cycle and child post mosaics on All tab',()=>{
      cy.visit('/about')
      .get('@work')
      .then(({body})=>{
        const work = body.data[0];
        cy.visit(`/work/${work.id}`)
        .get('[data-rr-ui-event-key="all"]').click({force:true})
        .get('[data-cy^="mosaic-item-cycle-"]')
            .then(cards=>{
              for(let cycle of work.cycles){
                cy.wrap(cards).get(`[data-cy="mosaic-item-cycle-${cycle.id}"]`)
              }

            })
          .get('[data-cy^="mosaic-item-post-"]')
            .then(posts=>{
              for(let post of work.posts){
                cy.wrap(posts).get(`[data-cy="mosaic-item-post-${post.id}"]`)
              }
        })
        
      })

    });
 */
    
});