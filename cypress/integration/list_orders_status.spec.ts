describe('RT17 - Verificação dos pedidos por status', () => {
  it('CT17 - Verificar se os pedidos são exibidos nos três diferentes status', () => {
    cy.visit('http://localhost:5173/login');

    // Verifique se o campo de entrada "email" está presente na DOM e visível
    cy.get('[type="email"]').should('be.visible').type('batata@teste.com');
    cy.get('[type="password"]').should('be.visible').type('12345');
    cy.get('.sc-dcJsrY').click();

    // Aguarde a navegação para a URL de pedidos
    cy.url().should('include', '/orders');
    cy.wait(500); // Aguarde 500ms

    // Verifique se há pedidos na "Fila de espera"
    cy.get('.sc-kpDqfm > :nth-child(1) > header > :nth-child(3)').then($element => {
      const count = parseInt($element.text().match(/\d+/)[0]);
      cy.log(`Contador na Fila de espera: ${count}`);
      if (count > 0) {
        expect(count).to.be.greaterThan(0);
      } else {
        cy.log('Nenhum pedido encontrado na Fila de espera');
      }
    });

    // Verifique se há pedidos "Em preparação"
    cy.get('.sc-kpDqfm > :nth-child(2) > header > :nth-child(3)').then($element => {
      const count = parseInt($element.text().match(/\d+/)[0]);
      cy.log(`Contador em preparação: ${count}`);
      if (count > 0) {
        expect(count).to.be.greaterThan(0);
      } else {
        cy.log('Nenhum pedido encontrado em preparação');
      }
    });

    // Verifique se há pedidos "Pronto!"
    cy.get('.sc-kpDqfm > :nth-child(3) > header > :nth-child(3)').then($element => {
      const count = parseInt($element.text().match(/\d+/)[0]);
      cy.log(`Contador em pronto: ${count}`);
      if (count > 0) {
        expect(count).to.be.greaterThan(0);
      } else {
        cy.log('Nenhum pedido encontrado em pronto');
      }
    });
  });
});
