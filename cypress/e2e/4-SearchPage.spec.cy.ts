describe('Offline home page',()=>{
    const url_featured_cycles = '/api/cycle?props=%7B%22take%22%3A8%2C%22where%22%3A%7B%22OR%22%3A%5B%7B%22AND%22%3A%5B%7B%22title%22%3A%7B%22contains%22%3A%22femin%22%7D%7D%5D%7D%2C%7B%22AND%22%3A%5B%7B%22contentText%22%3A%7B%22contains%22%3A%22femin%22%7D%7D%5D%7D%2C%7B%22AND%22%3A%5B%7B%22tags%22%3A%7B%22contains%22%3A%22femin%22%7D%7D%5D%7D%2C%7B%22AND%22%3A%5B%7B%22topics%22%3A%7B%22contains%22%3A%22femin%22%7D%7D%5D%7D%5D%2C%22AND%22%3A%7B%22access%22%3A%7B%22in%22%3A%5B1%2C2%5D%7D%7D%7D%7D'
    
    const url_taxonomy_countries = '/api/taxonomy/countries*'
    beforeEach(()=>{
        cy.intercept(url_featured_cycles,{fixture:'api-featured-cycles.json'})
        cy.intercept({
            method:'POST',
            url:'https://d.clarity.ms/collect'
        },{statusCode:204})
        cy.intercept(url_taxonomy_countries,{fixture:'api-taxonomy-countries.json'})

    })
    it('should be found',()=>{
        cy.visit('/en')
    })

    it('should have the search engine and works',()=>{
        const url_search_femin_in_cycles='/api/cycle?props*'
        const url_search_femin_in_posts='/api/post?props*'
        const url_search_femin_in_works='/api/work?props*'

        cy.intercept(url_search_femin_in_cycles,{fixture:'api-search-femin-in-cycles'}).as('reqCycles')
        cy.intercept(url_search_femin_in_posts,{fixture:'api-search-femin-in-posts.json'}).as('reqPosts')
        cy.intercept(url_search_femin_in_works,{fixture:'api-search-femin-in-works.json'}).as('reqWorks')

        cy.get('[data-cy="search-engine"]').within(()=>{
            cy.get('[data-cy="search-engine-control"]').type('femin').type('{enter}')
            cy.url({timeout:30000}).should('match',/search\?q=femin/)
        })

        cy.contains('button','Cycles').click({force:true})
        cy.wait('@reqCycles').then(interc=>{
            cy.wrap(interc).its('response').its('body').its('data').then(data=>{
                cy.get('[data-cy="tab-cycles"]').within(()=>{
                    cy.get('[data-cy^="mosaic-item-cycle-"]').should('have.length',data.length)
                })
            })
        })

        cy.contains('button','Eureka Moments').click({force:true})
        cy.wait('@reqPosts').then(interc=>{
            cy.wrap(interc).its('response').its('body').its('data').then(data=>{
                    cy.get('[data-cy="tab-posts"]').within(()=>{
                        cy.get('[data-cy^="mosaic-item-post-"]').should('have.length',data.length)
                    })
            })
        })

        cy.contains('button','Works').click({force:true})
        cy.wait('@reqWorks').then(interc=>{
            cy.wrap(interc).its('response').its('body').its('data').then(data=>{
                    cy.get('[data-cy="tab-works"]').within(()=>{
                        cy.get('[data-cy^="mosaic-item-work-"]').should('have.length',data.length)
                    })
            })
        })

    })

    it('should filters works correctly in tab "Works"',()=>{
        cy.contains('button','Works').click({force:true})
        cy.get('[data-cy="check-fiction-book"]').click({force:true})

        cy.get('[data-cy="tab-works"]').within(()=>{
            cy.get('[data-cy^="mosaic-item-work-"]').find('span').each(s=>{
                expect(s.text().match(/Fiction book/)).to.be.null
            })
        })

        cy.get('[data-cy="check-fiction-book"]').click({force:true})

        cy.get('[data-cy="tab-works"]').within(()=>{
            cy.contains('Fiction book')
        })

    })

    it('should filters works correctly in tab "Cycles"',()=>{
        cy.contains('button','Cycles').click({force:true})
        
        
        cy.get('[data-cy="tab-cycles"]').within(()=>{
            cy.get('[data-cy="check-private"]').uncheck({force:true})
            cy.get('[data-cy="check-public"]').uncheck({force:true})
            cy.get('[data-cy^="mosaic-item-cycle-"]').should('not.exist')

            cy.get('[data-cy="check-private"]').check({force:true})
            cy.get('[data-cy^="mosaic-item-cycle-"]').contains('span','Public cycle').should('not.exist')
            cy.get('[data-cy="check-private"]').uncheck({force:true})

            cy.get('[data-cy="check-public"]').check({force:true})
            cy.get('[data-cy^="mosaic-item-cycle-"]').contains('span','Private cycle').should('not.exist')
            cy.get('[data-cy="check-public"]').uncheck({force:true})

            cy.get('[data-cy="check-public"]').check({force:true})
            cy.get('[data-cy="check-private"]').check({force:true})
            // cy.get('[data-cy^="mosaic-item-cycle-"]').contains('span','Public cycle')
            // cy.get('[data-cy^="mosaic-item-cycle-"]').contains('span','Private cycle')
        
            // cy.get('[data-cy^="mosaic-item-cycle-"]').find('span')
            // .each(s=>{
            //     expect(s.text().match(/Public cycle/)).to.be.null
            // })

            
            // expect(cy.get('[data-cy^="mosaic-item-cycle-"]')).to.be.null;
            // cy.get('[data-cy^="mosaic-item-cycle-"]').find('span')
            // .each(s=>{
            //     expect(s.text().match(/Private cycle/)).to.be.null
            // })
            // cy.get('[data-cy="check-private"]').check({force:true})
            // cy.get('[data-cy="tab-cycles"]').within(()=>{
            //     cy.contains('Private cycle')
            // })
        })

        cy.contains('button','Geography:visible')
        // cy.get('[data-cy="tab-cycles"]')
        //     .find('[data-cy="btn-filters-geography"]').click({force:true})
        //     // data-cy='popover-geography'
        // cy.get('[data-cy="check-laac"]').check({force:true})
            
    })
    
})
export {}