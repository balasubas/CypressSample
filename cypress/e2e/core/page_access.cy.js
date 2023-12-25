
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

       cy.get('h3')
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

})