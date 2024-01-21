
//////////////////////////////////////////////////////////
describe('As a Regular User I want to be able to perform basic',()=>{

    ////////////////////////////////
    before(()=>{
        cy.visit(Cypress.config().baseUrl)
        cy.logIn('STANDARD')
        cy.get('.title')
          .should('have.text','Products')
    })

    ////////////////////////////////
    after(()=>{
        cy.logOut()
    })

    ////////////////////////////////
    it('I purchase the following items on my shopping list',()=>{
        cy.fixture('lists/shopping_list')
          .then((data)=>{
             var shopping_list = data.standard_shopping_list
             shopping_list.forEach((item)=>{
                // TODO: Continue with the purchase
                cy.find_item(item)
             })
          })
    })

})