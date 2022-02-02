/// <reference types="cypress"/>
import {mount} from '@cypress/react'
import Test from './Test'

describe('Test cmp suite',()=>{

    
    it.only('display witout crash', ()=>{
        mount(<Test/>)
        cy.get(['data-cy="container"'])
    })

});