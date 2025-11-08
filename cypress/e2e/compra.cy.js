describe('Flujo completo desde Postres: intento sin login, login, agregar y pagar', () => {

    it('Intenta agregar productos sin iniciar sesión, inicia sesión y completa el pago', () => {
        cy.visit('http://192.168.56.1:8080/opciones/Postres.html')
        cy.wait(1000)

        cy.get('.item').first().find('.add-to-cart-btn').click()

        cy.get('body').then(($body) => {
            if ($body.find('#login-popup').length) {
                cy.get('#login-popup').should('be.visible')
                cy.log('⚠️ Aparece el aviso de iniciar sesión')
            } else {
                cy.url().should('include', 'login.html')
                cy.log('🔁 Redirigido al login por no estar autenticado')
            }
        })

        cy.url().then(url => {
            if (!url.includes('login.html')) {
                cy.visit('http://192.168.56.1:8080/login.html')
            }
        })

        cy.wait(500)
        cy.get('#btnAdmin').click()
        cy.get('#email').type('admin@chilapeños.com')
        cy.get('#password').type('admin123')
        cy.get('#loginForm').submit()

        cy.url().should('include', 'Principal.html')
        cy.wait(500)

        cy.visit('http://192.168.56.1:8080/opciones/Postres.html')
        cy.wait(500)

        cy.get('.item').eq(0).find('.add-to-cart-btn').click()
        cy.get('.item').eq(1).find('.add-to-cart-btn').click()
        cy.get('.item').eq(2).find('.add-to-cart-btn').click()

        cy.get('#open-cart-btn').click()

        cy.get('#cart-items').should('not.contain.text', 'Tu carrito está vacío')

        cy.get('.checkout-btn').click()

        cy.get('#payment-confirmation-popup').should('be.visible')
        cy.get('.confirm-payment-btn').click()

        cy.get('#payment-success-popup')
            .should('be.visible')
            .and('contain.text', 'Pago Exitoso')

        cy.get('#payment-success-popup .return-btn').click()
        cy.get('#cart-total').should('contain.text', '0')
    })
})
