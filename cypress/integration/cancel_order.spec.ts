describe('Numeração a verificar - Cancelamento de pedidos', () => {
  it('Verificar se os pedidos são cancelados corretamente', () => {
    cy.visit('http://localhost:5173/login');

    // Verifique se o campo de entrada "email" está presente na DOM e visível
    cy.get('[type="email"]').should('be.visible').type('batata@teste.com');
    cy.get('[type="password"]').should('be.visible').type('12345');
    cy.get('.sc-dcJsrY').click();

    // Aguarde a navegação para a URL de pedidos
    cy.url().should('include', '/orders');
    cy.wait(500); // Aguarde 500ms

    // Verifique condicionalmente a presença de pedidos
    cy.get('body').then($body => {
      if ($body.find('.sc-dhKdcB').length > 0) {
        cy.log('Pedidos encontrados');

        // Captura o estado inicial dos contadores
        let initialWaitCount, initialPrepCount, initialReadyCount;

        cy.get('.sc-kpDqfm > :nth-child(1) > header > :nth-child(3)').then($element => {
          initialWaitCount = parseInt($element.text().match(/\d+/)[0]);
        });

        cy.get('.sc-kpDqfm > :nth-child(2) > header > :nth-child(3)').then($element => {
          initialPrepCount = parseInt($element.text().match(/\d+/)[0]);
        });

        cy.get('.sc-kpDqfm > :nth-child(3) > header > :nth-child(3)').then($element => {
          initialReadyCount = parseInt($element.text().match(/\d+/)[0]);
        });

        // Seleciona e clica no primeiro pedido
        cy.get('.sc-dhKdcB > :nth-child(1)').first().click();

        // Verifica se o botão .secondary está presente
        cy.get('body').then($body => {
          if ($body.find('.secondary').length > 0) {
            cy.get('.secondary').click();

            // Aguarde algum tempo para a mudança de status
            cy.wait(1000);

            // Verifica se os contadores foram atualizados corretamente
            cy.get('.sc-kpDqfm > :nth-child(1) > header > :nth-child(3)').then($element => {
              const newWaitCount = parseInt($element.text().match(/\d+/)[0]);
              if (initialWaitCount > 0) {
                expect(newWaitCount).to.be.lessThan(initialWaitCount);
              }
            });

            cy.get('.sc-kpDqfm > :nth-child(2) > header > :nth-child(3)').then($element => {
              const newPrepCount = parseInt($element.text().match(/\d+/)[0]);
              if (initialWaitCount == 0 && initialPrepCount > 0) {
                expect(newPrepCount).to.be.lessThan(initialPrepCount);
              }
            });

            cy.get('.sc-kpDqfm > :nth-child(3) > header > :nth-child(3)').then($element => {
              const newReadyCount = parseInt($element.text().match(/\d+/)[0]);
              if (initialWaitCount == 0 && initialPrepCount == 0 && initialReadyCount > 0) {
                expect(newReadyCount).to.be.lessThan(initialReadyCount);
              }
            });
          } else {
            cy.log('Botão .secondary não encontrado, nenhum pedido para cancelar');
          }
        });

      } else {
        cy.log('Nenhum pedido encontrado');
      }
    });

  });
});
