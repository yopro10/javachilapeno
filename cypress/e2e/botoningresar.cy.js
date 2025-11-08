it('entrar a cada pagina y buscar el boton de ingresar usuario, salirse usuario', () => {
    cy.visit('http://192.168.56.1:8080');
    cy.wait(500);
    cy.get('#loginFloatingBtn').click()
    cy.get('.quick-login').eq(1).click()
    cy.get('.card').eq(0).click()
    cy.get('.btn-logout').click()
    cy.get('.quick-login').eq(1).click()
    cy.get('.card').eq(1).click()
    cy.get('.btn-logout').click()
    cy.get('.quick-login').eq(1).click()
    cy.get('.card').eq(2).click()
    cy.get('.btn-logout').click()
    cy.get('.quick-login').eq(1).click()
    cy.get('.card').eq(3).click()
    cy.get('.btn-logout').click()
    cy.get('.quick-login').eq(1).click()
    cy.url().should('include', 'login.html');
});