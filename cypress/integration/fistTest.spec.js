/// <reference types="cypress"/>

describe('cycle detail suite',()=>{

    it('cycle mosaic tests',()=>{
        cy.visit("http://localhost:3000/cycle/28")

        cy.get('h1.fw-bold.text-secondary')
        
        // const card = cy.get('div.mosaic.card').then(card =>{
        //     cy.wrap(card).contains('h1.fw-bold.text-secondary','')
        // })
        // const joinBtn = card.find('.btn-primary',"button").first()
        //     .should("not.be.empty")
        //     .click({force:true})
        // cy.get('[role="dialog"].modal').find('.btn-close').click()
        
        // cy.contains("Participantes").first().click({force:true})        
    });


});