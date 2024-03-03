
//////////////////////////////////////////////////////////
describe('As a Problem User I want to try and make a purchase',()=>{

    ////////// DECLARATIONS ////////

    var budget = -1
    var items_within_budget = null

    ////////////////////////////////
    before(()=>{
        budget = 65.00
        items_within_budget = []
        cy.visit(Cypress.config().baseUrl)
        cy.logIn('PROBLEM')
        cy.get('.title')
          .should('have.text','Products')
    })

    ////////////////////////////////
    after(()=>{
        cy.logOut()
    })

    ////////////////////////////////
    it('I look for the following items on my shopping list that are within my budget',()=>{
        var total = 0.00
        var expected_not_in_list = 'Sauce Labs Fleece Jacket'
        cy.fixture('lists/shopping_list')
          .then((data)=>{
             var shopping_list = data.standard_shopping_list
             shopping_list.forEach((item)=>{
                cy.find_item(item)
                  .find('div[class="pricebar"] > div[class="inventory_item_price"]')
                  .invoke('text')
                  .then((price)=>{
                     price = parseFloat(price.replace('$',''))
                     total = total + price
                     if(total <= budget){
                        items_within_budget.push(item)
                     }else{
                        total = total - price
                     }
                  })
             })

             expect(items_within_budget.includes(expected_not_in_list)).to.be.false
          })
    })

    ////////////////////////////////
    it('Then I add the following items within my budget to the cart',()=>{
        cy.fixture('lists/shopping_list')
          .then((data)=>{
             return cy.wrap(data.problem_user_shopping_list)
          }).then((combined)=>{
             combined.forEach((item)=>{
                if(items_within_budget.includes(item)){
                    cy.find_item(item)
                      .find('div[class="pricebar"]')
                      .first()
                      .find('button')
                      .contains('Add to cart')
                      .click({force: true})
                }
             })
          })
    })

    ////////////////////////////////
    it('And I have seconds thoughts about one item and remove it through the main items screen', ()=>{
        cy.fixture('lists/shopping_list')
          .then((data)=>{
             return cy.wrap(data.problem_cart_removal)
          })
          .then((to_remove)=>{
             cy.find_item(to_remove)
               .find('div[class="pricebar"]')
               .first()
               .find('button')
               .should('not.have.text','Remove')

             cy.log('Item: ' + to_remove + ' could not be added to the cart')
          })
    })

    ////////////////////////////////
    it('Then I try to remove my other orders through the main screen',()=>{
        cy.fixture('lists/shopping_list')
          .then((data)=>{
             return cy.wrap(data.problem_items_removal)
          })
          .then((removal_items)=>{
             removal_items.forEach((to_remove)=>{
                 cy.find_item(to_remove)
                   .find('div[class="pricebar"]')
                   .first()
                   .find('button')
                   .contains('Remove')
                   .click({force: true})

                 cy.find_item(to_remove)
                   .find('div[class="pricebar"]')
                   .first()
                   .find('button')
                   .contains('Remove')

                 cy.log('Main screen remove button is not working for: ' + to_remove)

             })
          })
    })

    ////////////////////////////////
    it('Then I try to remove my items through the cart',()=>{
        // TODO: Implement
    })
})
