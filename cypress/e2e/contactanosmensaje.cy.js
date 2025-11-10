it('Debería enviar un mensaje desde el formulario de contacto', () => {
    cy.visit('http://192.168.56.1:8080/contacto')

    cy.get('#nombre').type('Juan Pérez')
    cy.get('#email').type('juan@example.com')
    cy.get('#telefono').type('123456789')
    cy.get('#mensaje').type('Hola, me gustaría obtener más información sobre sus servicios.')


    cy.get('button[type="submit"]').click()


    cy.contains('Mensaje enviado').should('be.visible')
})
