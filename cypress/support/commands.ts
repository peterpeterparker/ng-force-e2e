Cypress.Commands.add('init', () => {
    cy.visit('/');
});

Cypress.Commands.add('initPDFWorker', () => {
    return cy.intercept('https://cdnjs1.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js', {
        body: require('../fixtures/pdf.worker.min.json').content,
        headers: { 'Content-Type': 'application/javascript' }
    });
});

declare namespace Cypress {
    interface Chainable<Subject> {
        init(): Chainable<void>;
        initPDFWorker(): Chainable<void>;
    }
}
