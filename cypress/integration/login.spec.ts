describe('RT15 - Login', () => {
  it('CT15 - Verificar se é possível efetuar login corretamente', () => {
    cy.visit('http://localhost:5173/login');

    // Verifique se o campo de entrada "email" está presente na DOM e visível
    cy.get('[type="email"]').should('be.visible').type('batata@teste.com');
    cy.get('[type="password"]').should('be.visible').type('12345');
    cy.get('.sc-dcJsrY').click();

    // Aguarde a navegação para a URL de pedidos
    cy.url().should('include', '/orders');
  });
});
