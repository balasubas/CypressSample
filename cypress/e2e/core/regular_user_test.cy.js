
//////////////////////////////////////////////////////////
describe('As a Regular User I want to be able to do a full checkout',()=>{

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
    it('And I have seconds thoughts about one item and remove it from the cart', ()=>{
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
    })

    ////////////////////////////////
    it('Then I do the purchase',()=>{
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

        verify_item_prices()
        verify_subtotal()
        cy.get('#finish').click({ force : true })

        verify_checkout_completion()

        cy.get('#back-to-products').click({ force : true })
        cy.get('.title')
          .should('have.text','Products')
    })

})

//////////////////////////////////////////////////////////
function verify_item_prices(){
   cy.fixture('lists/shopping_list')
     .then((data)=>{
         return cy.wrap(data.final_shopping_list)
     }).then((final_shopping_list)=>{
         var sub_total = 0
         final_shopping_list.forEach((item)=>{
            cy.get('div[class="inventory_item_name"]')
              .contains(item)
         })
     })
}

//////////////////////////////////////////////////////////
function verify_subtotal(){
    var sub_total = 0

    cy.get('div[class="inventory_item_price"]')
      .each((item, index, prices)=>{
          cy.wrap(item)
            .invoke('text')
            .then((text)=>{
                var actual_price = parseFloat(text.replace(/[^0-9]/,''))
                sub_total += actual_price
            })
      }).then(()=>{
          cy.get('div[class="summary_subtotal_label"]')
            .invoke('text')
            .then((text)=>{
                var final_sub_total = parseFloat(text.replace(/[^0-9.]/g,''))
                expect(final_sub_total).to.equal(sub_total)
            })
      })
}

//////////////////////////////////////////////////////////
function verify_checkout_completion(){
      cy.fixture('messages/std_messages')
        .then((data)=>{
            cy.get('div[class="complete-text"]')
              .contains(data.checkout_complete)
        })
}

//////////////////////////////////////////////////////////
describe('Additional Regular User Test Scenarios',()=>{

    beforeEach(()=>{
        cy.visit(Cypress.config().baseUrl)
        cy.logIn('STANDARD')
        cy.get('.title')
          .should('have.text','Products')
    })

    afterEach(()=>{
        cy.logOut()
    })

    ////////////////////////////////
    it('Should verify all products are displayed on the products page',()=>{
        cy.get('.inventory_item').should('have.length.at.least', 1)
        cy.get('.inventory_item_name').should('be.visible')
        cy.get('.inventory_item_price').should('be.visible')
        cy.get('.btn_inventory').should('be.visible')
    })

    ////////////////////////////////
    it('Should be able to view product details',()=>{
        cy.get('.inventory_item_name').first().click()
        cy.get('.inventory_details_name').should('be.visible')
        cy.get('.inventory_details_price').should('be.visible')
        cy.get('.inventory_details_desc').should('be.visible')
        cy.get('#back-to-products').click()
        cy.get('.title').should('have.text','Products')
    })

    ////////////////////////////////
    it('Should validate cart badge updates when adding items',()=>{
        cy.get('.shopping_cart_badge').should('not.exist')

        cy.get('.btn_inventory').first().click()
        cy.get('.shopping_cart_badge').should('contain','1')

        cy.get('.btn_inventory').eq(1).click()
        cy.get('.shopping_cart_badge').should('contain','2')
    })

    ////////////////////////////////
    it('Should be able to add and remove items from cart multiple times',()=>{
        const firstItem = cy.get('.inventory_item').first()

        firstItem.find('.btn_inventory').click()
        cy.get('.shopping_cart_badge').should('contain','1')

        firstItem.find('.btn_inventory').should('contain','Remove')
        firstItem.find('.btn_inventory').click()
        cy.get('.shopping_cart_badge').should('not.exist')

        firstItem.find('.btn_inventory').should('contain','Add to cart')
    })

    ////////////////////////////////
    it('Should validate empty cart state',()=>{
        cy.navigate_to_cart()
        cy.get('#continue-shopping').should('be.visible')
        cy.get('.cart_item').should('not.exist')
        cy.get('#checkout').should('be.disabled')
    })

    ////////////////////////////////
    it('Should maintain cart contents when navigating back from cart',()=>{
        cy.get('.btn_inventory').first().click()
        cy.get('.btn_inventory').eq(1).click()

        cy.navigate_to_cart()
        cy.get('.cart_item').should('have.length',2)

        cy.get('#continue-shopping').click()
        cy.get('.title').should('have.text','Products')
        cy.get('.shopping_cart_badge').should('contain','2')
    })

    ////////////////////////////////
    it('Should validate product sorting functionality',()=>{
        cy.get('.product_sort_container').select('za')
        cy.get('.inventory_item_name').first().should('contain','Test.allTheThings()')

        cy.get('.product_sort_container').select('az')
        cy.get('.inventory_item_name').first().should('contain','Sauce Labs Backpack')

        cy.get('.product_sort_container').select('hilo')
        cy.get('.inventory_item_price').first().invoke('text').then((price1) => {
            cy.get('.inventory_item_price').eq(1).invoke('text').then((price2) => {
                const p1 = parseFloat(price1.replace('$',''))
                const p2 = parseFloat(price2.replace('$',''))
                expect(p1).to.be.at.least(p2)
            })
        })

        cy.get('.product_sort_container').select('lohi')
        cy.get('.inventory_item_price').first().invoke('text').then((price1) => {
            cy.get('.inventory_item_price').eq(1).invoke('text').then((price2) => {
                const p1 = parseFloat(price1.replace('$',''))
                const p2 = parseFloat(price2.replace('$',''))
                expect(p1).to.be.at.most(p2)
            })
        })
    })

    ////////////////////////////////
    it('Should validate checkout form field requirements',()=>{
        cy.get('.btn_inventory').first().click()
        cy.navigate_to_cart()
        cy.get('#checkout').click()

        cy.get('#continue').click()
        cy.get('.error-message-container').should('be.visible')
        cy.get('.error-message-container').should('contain','First Name is required')

        cy.get('#first-name').type('John')
        cy.get('#continue').click()
        cy.get('.error-message-container').should('contain','Last Name is required')

        cy.get('#last-name').type('Doe')
        cy.get('#continue').click()
        cy.get('.error-message-container').should('contain','Postal Code is required')

        cy.get('#postal-code').type('12345')
        cy.get('#continue').click()
        cy.get('.title').should('contain','Checkout: Overview')
    })

    ////////////////////////////////
    it('Should validate checkout overview calculations',()=>{
        cy.get('.btn_inventory').first().click()
        cy.get('.btn_inventory').eq(1).click()

        cy.navigate_to_cart()
        cy.get('#checkout').click()

        cy.get('#first-name').type('John')
        cy.get('#last-name').type('Doe')
        cy.get('#postal-code').type('12345')
        cy.get('#continue').click()

        let itemTotal = 0
        cy.get('.inventory_item_price').each(($el) => {
            const price = parseFloat($el.text().replace('$',''))
            itemTotal += price
        }).then(() => {
            cy.get('.summary_subtotal_label').invoke('text').then((subtotalText) => {
                const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g,''))
                expect(subtotal).to.equal(itemTotal)
            })

            cy.get('.summary_tax_label').invoke('text').then((taxText) => {
                const tax = parseFloat(taxText.replace(/[^\d.]/g,''))
                expect(tax).to.be.greaterThan(0)

                cy.get('.summary_total_label').invoke('text').then((totalText) => {
                    const total = parseFloat(totalText.replace(/[^\d.]/g,''))
                    expect(total).to.equal(itemTotal + tax)
                })
            })
        })
    })

    ////////////////////////////////
    it('Should be able to cancel checkout and return to cart',()=>{
        cy.get('.btn_inventory').first().click()
        cy.navigate_to_cart()
        cy.get('#checkout').click()

        cy.get('#cancel').click()
        cy.get('.title').should('contain','Your Cart')
        cy.get('.cart_item').should('have.length',1)
    })

    ////////////////////////////////
    it('Should validate successful checkout completion flow',()=>{
        cy.get('.btn_inventory').first().click()

        cy.navigate_to_cart()
        cy.get('#checkout').click()

        cy.get('#first-name').type('Test')
        cy.get('#last-name').type('User')
        cy.get('#postal-code').type('12345')
        cy.get('#continue').click()

        cy.get('#finish').click()

        cy.get('.complete-header').should('contain','Thank you for your order!')
        cy.get('.complete-text').should('be.visible')
        cy.get('#back-to-products').should('be.visible')

        cy.get('#back-to-products').click()
        cy.get('.title').should('have.text','Products')
        cy.get('.shopping_cart_badge').should('not.exist')
    })

    ////////////////////////////////
    it('Should validate burger menu functionality',()=>{
        cy.get('#react-burger-menu-btn').click()
        cy.get('.bm-menu').should('be.visible')
        cy.get('#inventory_sidebar_link').should('be.visible')
        cy.get('#about_sidebar_link').should('be.visible')
        cy.get('#logout_sidebar_link').should('be.visible')
        cy.get('#reset_sidebar_link').should('be.visible')

        cy.get('.bm-cross-button').click()
        cy.get('.bm-menu').should('not.be.visible')
    })

    ////////////////////////////////
    // it('Should validate reset app state functionality',()=>{
    //     cy.get('.btn_inventory').first().click()
    //     cy.get('.btn_inventory').eq(1).click()
    //     cy.get('.shopping_cart_badge').should('contain','2')

    //     cy.get('#react-burger-menu-btn').click()
    //     cy.get('#reset_sidebar_link').click()

    //     cy.get('.shopping_cart_badge').should('not.exist')
    //     cy.get('.btn_inventory').should('contain','Add to cart')
    // })

    ////////////////////////////////
    it('Should validate product image display',()=>{
        cy.get('.inventory_item_img').should('be.visible')
        cy.get('.inventory_item_img').each(($img) => {
            cy.wrap($img).should('have.attr','src').and('not.be.empty')
            cy.wrap($img).should('have.attr','alt').and('not.be.empty')
        })
    })

    ////////////////////////////////
    it('Should validate footer information',()=>{
        cy.get('.footer').should('be.visible')
        cy.get('.social_twitter').should('be.visible')
        cy.get('.social_facebook').should('be.visible')
        cy.get('.social_linkedin').should('be.visible')
        cy.get('.footer_copy').should('include','Sauce Labs')
    })

})