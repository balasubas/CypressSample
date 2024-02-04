
//////////////////////////////////////////////////////////
Cypress.Commands.add('find_item',(item_name)=>{
    return cy.get('div[class="inventory_item"]')
             .find('div[class="inventory_item_description"]')
             .contains(item_name)
             .parent()
             .parent()
             .parent()
})

//////////////////////////////////////////////////////////
Cypress.Commands.add('navigate_to_cart',()=>{
    cy.get('#shopping_cart_container > a')
      .click({ force : true })
    cy.contains('Your Cart')
})

//////////////////////////////////////////////////////////
Cypress.Commands.add('find_cart_item', (name)=>{
    return cy.get('div[class="inventory_item_name"]')
             .contains(name)
             .parent()
             .parent()
             .parent()
})

//////////////////////////////////////////////////////////
Cypress.Commands.add('checkout',(first, last,zip)=>{
    cy.get('#checkout').click({ force : true })
    cy.contains('Checkout: Your Information')
    cy.get('#first-name').clear().type(first)
    cy.get('#last-name').clear().type(first)
    cy.get('#postal-code').clear().type(first)
    cy.get('#continue').click({ force : true })
})