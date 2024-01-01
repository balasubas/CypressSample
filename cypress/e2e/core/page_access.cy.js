
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

      cy.wrap(performance.now())
        .then(($start)=>{
          cy.logIn('GLITCH')

          cy.get('.title')
            .should('have.text','Products')

          cy.wrap(performance.now())
            .then(($finish_time)=>{
               expect($finish_time - $start).to.be.greaterThan(0)
            }) 
        })
        
        cy.logOut()  
    })

    ////////////////////////////////
    it('I log in as a user who lands on the homepage with layout problems',()=>{
      cy.logIn('VISUAL')

      cy.get('.title')
        .should('have.text','Products')     

      const button_props = []  

      cy.get('div.inventory_item > div:nth-child(2) > div:nth-child(2) > button')
        .each(($el, index, $list)=>{
          const win = cy.state('window')
          const styles = win.getComputedStyle($el[0])
          const right_justify = styles.getPropertyValue('right')
          button_props.push(right_justify) 
        }).then(()=>{
          cy.log('One of these buttons is expected to have a horizontal position that is different from the others and so is misaligned.')
          expect(button_props).to.include('-20px')
        })  
      
        cy.logOut()  
    })

})