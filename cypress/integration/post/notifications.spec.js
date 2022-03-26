/// <reference types="cypress"/>
import {getCycles} from '../../../src/useCycles'
import {getWorks} from '../../../src/useWorks'

describe('notifications on eurekas suit',()=>{
    
    beforeEach(()=>{
      process.env.NEXT_PUBLIC_WEBAPP_URL = "http://localhost:3000"
      cy.login();
    });

    it('notification created when user create an eureka', ()=>{
      cy.visit('/about')
      .wait('@session')
      .then(async interception=>{
        const session = interception.response.body;
        const user = session.user;
        expect(user).has.property('id',127)
        const cycles = await getCycles({
          participants:{some:{id:user.id}},
          access:1
        })
        const cycle = cycles[0]
        cy.visit(`/en/cycle/${cycle.id}`)
        const works = await getWorks({
          cycles:{some:{id:cycle.id}}
        })
        const work = works[0]
        cy.get('[data-rr-ui-event-key="eurekas"]')
        .click({force:true})
        .get('[data-cy="bt-create-eureka"]')
        .click({force:true})
        .get('[id="discussionItem"]')
        .select(`work-${work.id}`,{force:true})
        .get('[id="eureka-title"]')
        .type(work.title+' - test',{force:true})
        .get('[data-cy="image-load"]')
        .click({force:true})
        .get('[type="file"]')
        .selectFile(`public/img/ico-painting.png`,{force:true})//TODO i can not set the file because the crop :|
        .then(res=>{
          console.log(res[0])
        })
        .get('[type="range"]')
        .invoke('val',2).trigger('change',{force:true})
        .get('[data-cy="create-eureka-btn"]').click({force:true})

        //.get('[data-cy="set-image"]')
        // .click({force:true})
        //.get('[type="file"]')
        
      })

    })


    
});