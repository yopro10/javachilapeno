describe('Prueba de login - Chilapeños', () => {
    it('Envia el formulario de login correctamente', () => {
        cy.visit('http://192.168.56.1:8080/login.html');

        cy.get('#email').type('admin@correo.com');
        cy.get('#password').type('1234');

        cy.get('#loginForm').submit();

        cy.contains('usuario o contraseña incorrecto', { matchCase: false }).should('be.visible');
    });
});
