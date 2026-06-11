describe("ClickUp Goals API", () => {
  const token = "pk_302431133_BK1YCW2R158P66GBPPNAO55R5VCFXKV9";
  const teamId = "90121750965";

  let goalId;
  let goalName;
  let updatedGoalName;

  it("Create goal", () => {
    goalName = "Cypress Goal " + Date.now();

    cy.request({
      method: "POST",
      url: `https://api.clickup.com/api/v2/team/${teamId}/goal`,
      headers: {
        Authorization: token
      },
      body: {
        name: goalName,
        due_date: Date.now() + 86400000
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.goal.name).to.eq(goalName);
      expect(response.body.goal.id).to.exist;

      goalId = response.body.goal.id;
    });
  });

  it("Get goal", () => {
    cy.request({
      method: "GET",
      url: `https://api.clickup.com/api/v2/goal/${goalId}`,
      headers: {
        Authorization: token
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.goal.id).to.eq(goalId);
      expect(response.body.goal.name).to.eq(goalName);
    });
  });

  it("Update goal", () => {
    updatedGoalName = "Updated Cypress Goal " + Date.now();

    cy.request({
      method: "PUT",
      url: `https://api.clickup.com/api/v2/goal/${goalId}`,
      headers: {
        Authorization: token
      },
      body: {
        name: updatedGoalName
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.goal.name).to.eq(updatedGoalName);
    });
  });

  it("Delete goal", () => {
    cy.request({
      method: "DELETE",
      url: `https://api.clickup.com/api/v2/goal/${goalId}`,
      headers: {
        Authorization: token
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("Negative test - get goals without token", () => {
    cy.request({
      method: "GET",
      url: `https://api.clickup.com/api/v2/team/${teamId}/goal`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 401]);
    });
  });
});