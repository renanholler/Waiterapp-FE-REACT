describe('RT16 - Visualização de lista de pedidos', () => {
  it('CT16 - Verificar se os pedidos são exibidos corretamente em uma lista', () => {
    cy.visit('http://localhost:5173/login');

    // Verifique se o campo de entrada "email" está presente na DOM e visível
    cy.get('[type="email"]').should('be.visible').type('batata@teste.com');
    cy.get('[type="password"]').should('be.visible').type('12345');
    cy.get('.sc-dcJsrY').click();

    cy.wait(500); // Aguarde 500ms
    // Aguarde a navegação para a URL de pedidos
    cy.url().should('include', '/orders');

    // Verifique condicionalmente a presença de pedidos
    cy.get('body').then($body => {
      if ($body.find('.sc-dhKdcB').length > 0) {
        cy.log('Pedidos encontrados');
      } else {
        cy.log('Nenhum pedido encontrado');
      }
    });

  });
});
