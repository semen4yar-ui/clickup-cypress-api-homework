describe("ClickUp Goals API", () => {
  const token = Cypress.env("token");
  const teamId = Cypress.env("teamId");
  const baseUrl = Cypress.env("baseUrl");

  const headers = {
    Authorization: token,
    "Content-Type": "application/json"
  };

  it("should create, get, update and delete goal", () => {
    const goalName = "Cypress Goal " + Date.now();
    const updatedGoalName = "Updated Cypress Goal " + Date.now();

    cy.request({
      method: "POST",
      url: `${baseUrl}/team/${teamId}/goal`,
      headers,
      body: {
        name: goalName,
        due_date: Date.now() + 86400000
      }
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(200);
      expect(createResponse.body.goal.name).to.eq(goalName);
      expect(createResponse.body.goal.id).to.exist;

      const goalId = createResponse.body.goal.id;

      cy.request({
        method: "GET",
        url: `${baseUrl}/goal/${goalId}`,
        headers
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.goal.id).to.eq(goalId);
        expect(getResponse.body.goal.name).to.eq(goalName);
      });

      cy.request({
        method: "PUT",
        url: `${baseUrl}/goal/${goalId}`,
        headers,
        body: {
          name: updatedGoalName
        }
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body.goal.name).to.eq(updatedGoalName);
      });

      cy.request({
        method: "DELETE",
        url: `${baseUrl}/goal/${goalId}`,
        headers
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
      });
    });
  });

  it("should not get goals without authorization", () => {
    const goalName = "Negative Cypress Goal " + Date.now();

    cy.request({
      method: "POST",
      url: `${baseUrl}/team/${teamId}/goal`,
      headers,
      body: {
        name: goalName,
        due_date: Date.now() + 86400000
      }
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(200);

      const goalId = createResponse.body.goal.id;

      cy.request({
        method: "GET",
        url: `${baseUrl}/team/${teamId}/goal`,
        failOnStatusCode: false
      }).then((negativeResponse) => {
        expect(negativeResponse.status).to.be.oneOf([400, 401]);
      });

      cy.request({
        method: "DELETE",
        url: `${baseUrl}/goal/${goalId}`,
        headers
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
      });
    });
  });
});