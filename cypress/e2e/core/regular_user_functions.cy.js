
//////////////////////////////////////////////////////////
describe('As a Regular User I want to be able to perform basic',()=>{

    ////////// DECLARATIONS ////////

    var budget = -1
    var items_within_budget = null

    ////////////////////////////////
    before(()=>{
        budget = 65.00
        items_within_budget = []
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
             var shopping_list = data.standard_shopping_list
             shopping_list.forEach((item)=>{
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
    it('And I have seconds thoughts about one item, remove from the cart and do the purchase', ()=>{
        cy.fixture('lists/shopping_list')
          .then((data)=>{
             return data.remove_from_cart
          })
          .then((to_remove)=>{
             cy.find_item(to_remove)
               .find('div[class="pricebar"]')
               .first()
               .find('button')
               .contains('Remove')
               .click({force: true})
          })

        cy.fixture('lists/shopping_list')
          .then((data)=>{
             return cy.wrap(data.final_shopping_list)
          }).then((final_shopping_list)=>{
             cy.navigate_to_cart()
             final_shopping_list.forEach((item)=>{
                cy.find_cart_item(item)
             })
          })

        cy.fixture('lists/shopping_list')
          .then((data)=>{
             return cy.wrap(data.checkout_regular_user_info)
          }).then((user_info)=>{
             cy.checkout(user_info.first, user_info.last, user_info.zip)
          })

          // TODO: continue implementing:
          //      - Verify final checkout items
          //      - verify totals
          //      - verify items
          //      - verify card info
    })

})