context('Actions', () => {
  const dbVoName = 'test-e2e-vo-from-db-for-sponsor';

  const dbVoManager = 'vo-manager-sponsor';
  const dbUser = 'test7';
  const dbExistingMember = 'test8';

  const newMemberFirstName = "Member";
  const newMemberLastName = "Test";
  const newMemberFullName = newMemberFirstName + " " + newMemberLastName;
  const newMemberNamespace = "No namespace";
  const newMemberEmail = "newmember@test.com";

  // csv-like input used to generate sponsored members
  const generateMemberFirstName = "testgen";
  const generateMemberLastName = "testgen";
  const generateMemberFullName = generateMemberFirstName + " " + generateMemberLastName;
  const generateMemberEmail = "testgen@test.com";
  const generateMemberInput = `${generateMemberFirstName};${generateMemberLastName};${generateMemberEmail}`;

  before(() => {
    if (Cypress.env('BA_USERNAME_SPONSOR')) {
      sessionStorage.setItem('baPrincipal', '{"name": "voManagerSponsor"}');
      sessionStorage.setItem('basicUsername', Cypress.env('BA_USERNAME_SPONSOR'));
      sessionStorage.setItem('basicPassword', Cypress.env('BA_PASSWORD_SPONSOR'));
      cy.visit('service-access');
    }
  });

  beforeEach(() => {
    cy.visit('organizations')
      .get(`[data-cy=${dbVoName}]`)
      .click()
      .get('[data-cy=sponsored-members]')
      .click()
  });

  // TODO: verify test
  it('test sponsor existing member', () => {
    cy.get('[data-cy="sponsor-existing-member-button"]')
      .click()
      .get('[data-cy="sponsor-existing-member-input"]')
      .type(`${dbExistingMember}`)
      .get('[data-cy="sponsor-existing-member-search-button"]')
      .click()
      .get(`[data-cy=${dbExistingMember}-checkbox]`)
      .click()
      .intercept('**/membersManager/findCompleteRichMembers**').as('getSponsoredMembers')
      .get('[data-cy="sponsor-existing-member-submit-button"]')
      .click()
      .wait('@getSponsoredMembers')

      // assert that sponsored member was added
      .get(`[data-cy=${dbExistingMember.toLowerCase()}-name-td]`)
      .should('exist')
  });

  // TODO: verify
  it('test sponsor create new member', () => {
    cy.get('[data-cy="create-sponsored-members-button"]')
      .click()
      .get('[data-cy="create-sponsored-members-item-one"]')
      .click()
      .get('[data-cy="create-sponsored-member-first-name"]')
      .type(`${newMemberFirstName}`)
      .get('[data-cy="create-sponsored-member-last-name"]')
      .type(`${newMemberLastName}`)
      .get('[data-cy="create-sponsored-member-stepper-next"]')
      .click()
      .get('[data-cy="create-sponsored-member-select-menu"]')
      .select(`[data-cy="create-sponsored-member-${newMemberNamespace}-option"]`)
      .get('[data-cy="create-sponsored-member-email"]')
      .type(`${newMemberEmail}`)
      .get('[data-cy="create-sponsored-member-stepper-next"]')
      .click()
      .get('[data-cy="create-sponsored-member-stepper-submit"]')
      .click()

      // assert that sponsored member was created
      .get(`[data-cy=${newMemberFullName.toLowerCase()}-name-td]`)
      .should('exist')
  })

  // TODO: finish
  it('test sponsor generate members', () => {
    cy.get('[data-cy="create-sponsored-members-button"]')
      .click()
      .get('[data-cy="create-sponsored-members-item-generate"]')
      .click()
      .get('[data-cy="generate-sponsored-members-text-input"]')
      .type(`${generateMemberInput}`)
      .get('[data-cy="generate-sponsored-members-stepper-next"]')
      .click()
      .get('[data-cy="generate-sponsored-members-stepper-next"]')
      .click()
      .get('[data-cy="generate-sponsored-members-stepper-next"]')
      .click()
      .get('[data-cy="generate-sponsored-member-no-group-assignment-radio-button"]')
      .check()
      .intercept('**/membersManager/createSponsoredMembersFromCSV**').as('generateSponsoredMembers')
      .get('[data-cy="generate-sponsored-members-stepper-submit"]')
      .click()
      .wait('@generateSponsoredMembers')
      .get('[data-cy="generate-sponsored-members-result-close-button"]')
      .click()

      // assert that sponsored member was created
      .get(`[data-cy=${generateMemberFullName.toLowerCase()}-name-td]`)
      .should('exist')
  })

  // TODO: implement test -> list member's sponsors

  // TODO: implement test -> remove sponsor from sponsored member

  // TODO: implement test -> send account activation/reset link to member
});
