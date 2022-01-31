/// <reference types="cypress"/>

describe('cycle detail suite',()=>{

    it('cycle mosaic tests',()=>{
        cy.visit("http://localhost:3000/cycle/28")
        
        const card = cy.get('div.mosaic.card')
        const joinBtn = card.find('.prymary',"button").first()
            .should("not.be.empty")
            .click({force:true})
        cy.get('[role="dialog"].modal').find('.btn-close').click()
        
        cy.contains("Participantes").first().click({force:true})        
    });

});