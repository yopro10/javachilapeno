it('Redirige a Principal.html con credenciales válidas', () => {
    cy.visit('http://192.168.56.1:8080/login.html');
    cy.wait(500);
    cy.get('#btnAdmin').click()
    cy.get('#email').type('admin@chilapeños.com');
    cy.get('#password').type('admin123');
    cy.get('#loginForm').submit();
    cy.url().should('include', 'Principal.html');
});

