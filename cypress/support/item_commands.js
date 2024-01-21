
//////////////////////////////////////////////////////////
Cypress.Commands.add('find_item',(item_name)=>{
    return cy.get('div[class="inventory_item"]')
             .find('div[class="inventory_item_description"]')
             .contains(item_name)
})