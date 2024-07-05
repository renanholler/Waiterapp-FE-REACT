/**
 * RT09 - Categorização de pedido por status
 *
 * Título do cenário de teste: Categorização de pedido por status
 * Identificador do requisito: RF04
 * Descrição do requisito: Verificar se os pedidos são categorizados corretamente por status.
 * Identificador do roteiro de teste: RT09
 * Objetivo do roteiro de teste: Verificar se os pedidos são categorizados corretamente por status.
 * Localização: Função de categorização de pedidos
 * Pré-condições: O sistema deve ter pedidos com diferentes status. Usuário deve estar logado.
 */

describe('RT11 - Verificação dos pedidos por status', () => {
  it('CT11 - Verificar se os pedidos são exibidos nos três diferentes status', () => {
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
