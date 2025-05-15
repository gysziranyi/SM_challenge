const TEST_IDS = {
  spinner: "loader",
  inputfieldPostcode: "postcode",
  userlistRow: "userRow",
  userlistButtonPrev: "buttonPrev",
  userlistButtonNext: "buttonNext",
};

describe("SiemensMobility challenge loads", () => {

  it("enter postcode - shows some", () => {
    cy.intercept("GET", "https://randomuser.me/api*", {
      delay: 1000,
      fixture: "users.json",
    }).as("getUsers");

    cy.visit("/");
    cy.wait("@getUsers");

    cy.get('[name="postcode"]').type("720");
    cy.contains("72008").should("be.visible");
  });

  it("enter postcode - shows no result", () => {
    cy.intercept("GET", "https://randomuser.me/api*", {
      delay: 1000,
      fixture: "users.json",
    }).as("getUsers");

    cy.visit("/");
    cy.wait("@getUsers");

    cy.get('[name="postcode"]').type("7201");
    cy.contains("Nincs ilyen felhasználó").should("be.visible");
  });

  it("select sex", () => {
    cy.intercept("GET", "https://randomuser.me/api*", {
      delay: 1000,
      fixture: "users.json",
    }).as("getUsers");

    cy.visit("/");
    cy.wait("@getUsers");

    cy.get('[name="sex"]').select("female");

    cy.get(`[data-testid="${TEST_IDS.userlistRow}"]`).should("have.length", 6); // csak ennyi prímszámos volt!
  });

  it("enter postcode together with sex", () => {
    cy.intercept("GET", "https://randomuser.me/api*", {
      delay: 1000,
      fixture: "users.json",
    }).as("getUsers");

    cy.visit("/");
    cy.wait("@getUsers");

    cy.get('[name="sex"]').select("female");
    cy.get('[name="postcode"]').type("35011");

    cy.get(`[data-testid="${TEST_IDS.userlistRow}"]`).should("have.length", 1);
  });

  describe("paging", () => {
    it("Previous and Next buttons are disabled, as there are too few rows", () => {
      cy.intercept("GET", "https://randomuser.me/api*", {
        delay: 1000,
        fixture: "users.json",
      }).as("getUsers");

      cy.visit("/");
      cy.wait("@getUsers");

      cy.get('[name="sex"]').select("female");
      cy.get('[name="postcode"]').type("35011");

      cy.get(`[data-testid="${TEST_IDS.userlistButtonPrev}"]`).should(
        "have.prop",
        "disabled",
        true
      );
      cy.get(`[data-testid="${TEST_IDS.userlistButtonNext}"]`).should(
        "have.prop",
        "disabled",
        true
      );
    });

    it("Next button is not disabled, as there are multiple pages", () => {
      cy.intercept("GET", "https://randomuser.me/api*", {
        delay: 1000,
        fixture: "users.json",
      }).as("getUsers");

      cy.visit("/");
      cy.wait("@getUsers");

      cy.get('[name="sex"]').select("male");

      cy.get(`[data-testid="${TEST_IDS.userlistButtonNext}"]`).should(
        "have.prop",
        "disabled",
        false
      );
    });

    it("Lets head over to the next page", () => {
      cy.intercept("GET", "https://randomuser.me/api*", {
        delay: 1000,
        fixture: "users.json",
      }).as("getUsers");

      cy.visit("/");
      cy.wait("@getUsers");

      cy.get('[name="sex"]').select("male");

      cy.get(`[data-testid="${TEST_IDS.userlistButtonNext}"]`).click();

      cy.get(`[data-testid="${TEST_IDS.userlistButtonPrev}"]`).should(
        "have.prop",
        "disabled",
        false
      );
      cy.get(`[data-testid="${TEST_IDS.userlistButtonNext}"]`).should(
        "have.prop",
        "disabled",
        true
      );
    });
  });
});
