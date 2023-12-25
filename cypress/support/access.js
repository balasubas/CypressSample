
//////////////////////////////////////////////////////////
Cypress.Commands.add('logIn',(user_type)=>{
    var fixture_file = null
    switch(user_type){
        default: fixture_file = 'standard-user'
                 break
    }

    cy.fixture(fixture_file)
      .then((user_data)=>{
         var username = user_data.username
         var password = user_data.password
 
        cy.enterUsername(username)
        cy.enterPassword(password)
        cy.clickLogin()  
          
      })

})

//////////////////////////////////////////////////////////
Cypress.Commands.add('enterUsername',(username)=>{
    cy.get('#user-name')
      .clear()
      .type(username, { force : true })
})

//////////////////////////////////////////////////////////
Cypress.Commands.add('enterPassword',(password)=>{
    cy.get('#password')
      .clear()
      .type(password, { force : true })    
})

//////////////////////////////////////////////////////////
Cypress.Commands.add('clickLogin',()=>{
    cy.get('#login-button')
      .click({force : true })  
})

//////////////////////////////////////////////////////////
Cypress.Commands.add('logOut',()=>{
    cy.get('#logout_sidebar_link')
      .should('not.be.visible')

    cy.get('#react-burger-menu-btn')
      .click({ force : true })
    
    cy.get('#logout_sidebar_link')
      .click({ force : true })  
    
    cy.get('#login-button')
      .should('be.visible')  
})