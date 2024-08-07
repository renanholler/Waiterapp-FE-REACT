describe('RT19 - Mudança de status de pedidos', () => {
  it('CT19 - Verificar se os pedidos mudam de status corretamente', () => {
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

        // Verifica se o botão .primary está presente
        cy.get('body').then($body => {
          if ($body.find('.primary').length > 0) {
            cy.get('.primary').click();

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
              if (initialWaitCount == 0) {
                expect(newPrepCount).to.be.lessThan(initialPrepCount);
              } else {
                expect(newPrepCount).to.be.greaterThan(initialPrepCount);
              }
            });

            // Verifique se há pedidos "Pronto!"
            cy.get('.sc-kpDqfm > :nth-child(3) > header > :nth-child(3)').then($element => {
              const newReadyCount = parseInt($element.text().match(/\d+/)[0]);
              cy.log(`Contador em pronto: ${newReadyCount}`);
              if (initialReadyCount > 0) {
                expect(newReadyCount).to.be.greaterThan(initialReadyCount);
              }
            });
          } else {
            cy.log('Botão .primary não encontrado, todos os pedidos podem estar no último status');
          }
        });

      } else {
        cy.log('Nenhum pedido encontrado');
      }
    });

  });
});
