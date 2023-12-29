
//////////////////////////////////////////////////////////
describe('Perform basic logging in and out',()=>{

    beforeEach(()=>{
        cy.visit(Cypress.config().baseUrl)
    })

    ////////////////////////////////
    it('I attempt to log in with incomplete credentials',()=>{
       cy.clickLogin()
       cy.get('h3')
         .contains('Epic sadface: Username is required')
       
       cy.enterUsername('user')
       cy.clickLogin()

       cy.get('h3[data-test="error"]')
         .contains('Epic sadface: Password is required')
    })

    ////////////////////////////////
    it('I attempt to log in with wrong credentials', ()=>{
      cy.enterUsername('user')
      cy.enterPassword('wrongPwd')
      cy.clickLogin()
      
      cy.get('h3')
        .contains('Epic sadface: Username and password do not match any user in this service')
    })

    ////////////////////////////////
    it('I log into the website',()=>{
      cy.logIn('STANDARD')

      cy.get('.title')
        .should('have.text','Products')
        
      cy.logOut()    
    })

    ////////////////////////////////
    it('I attempt to log in as a locked out user',()=>{
      cy.logIn('LOCKED')

      cy.get('h3[data-test="error"]')
        .contains('Epic sadface: Sorry, this user has been locked out.')
    })

    ////////////////////////////////
    it('I attempt to log in as a performance glitch user',()=>{

      const start = performance.now()

      cy.logIn('GLITCH')

      cy.get('.title')
        .should('have.text','Products')

        // TODO: This needs fixed. It's not getting the correct result
      cy.wrap(performance.now())
        .then((finish_time)=>{
          cy.log(`${finish_time - start}`)
          cy.wrap(`${finish_time - start}`).then((result)=>{ expect(result).to.be.greaterThan(Cypress.config().idealPageLoadTime) })
        })    
    })

})