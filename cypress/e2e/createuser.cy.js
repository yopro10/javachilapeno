it('creacion de usuario', () => {
    cy.visit('http://192.168.56.1:8080/login.html');
    cy.wait(500);
    cy.get('#crearCuentaLink').click()
    cy.get('#newEmail').type('prueba@nose.com');
    cy.get('#newPassword').type('prueba123');
    cy.get('#confirmCreate').click()
    cy.url().should('include', 'Principal.html');
});
