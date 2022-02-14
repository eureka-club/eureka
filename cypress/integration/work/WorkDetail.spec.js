/// <reference types="cypress"/>
import { WorkplaceShareButton } from 'react-share';
import {isComment, isPost} from '../../../src/types'

describe('WorkDetail suit',()=>{

  beforeEach(()=>{
    cy.login();

    const whereForWork = encodeURIComponent(
      JSON.stringify({
        cycles:{
          some:{              
            id:{
              gt:0
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
        // comments:{
        //   every:{
        //     id:9999
        //   }
        // }       
      })
    );
    cy.request(`/api/work?where=${whereForWork}&take=1`).as('work')
        .its('body')
        .should('have.property','data')
        .and((data)=>{
          expect(data).to.be.length.gte(1)              
          expect(data[0].posts).have.length.gte(1)
          expect(data[0].cycles).have.length.gte(1)
        })
  });
    it('has the mosaic card',()=>{
      cy.get('@work')
      .its('body')
      .should('have.property','data')
      .then(data=>{
        const work = data[0];
        cy.get(`[data-cy="mosaic-item-work-${work.id}"]`).should('not.be.empty')

      })
    })
    it('render only comments that belongs to this context',()=>{
      cy.visit('/about')
      .get('@work')
      .its('body')
      .should('have.property','data')
      .then(data=>{
        const work = data[0];
        const workComments = work.comments.filter(c=>!c.cycleId && !c.postId)//directly comments only
        cy.visit(`/work/${work.id}`)
        console.log(workComments,'workComments')

        if(workComments.length)
          cy.get(`[data-cy^="comment-cmp-"]:visible`).then(comments=>{
            cy.wrap(comments)
            .should('have.length',workComments.length)
            for(let c of workComments)
              cy.wrap(comments).get(`[data-cy="comment-cmp-${c.id}"]`)  
          })
        else{
          cy.get(`[data-cy^="comment-cmp-"]:visible`).should('not.exist')
        }
          
      })
    })
    it('render parent cycle and child post mosaics on All tab',()=>{
      cy.visit('/about')
      .get('@work')
      .its('body')
      .should('have.property','data')
      .then(data=>{
        const work = data[0];
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

    
});