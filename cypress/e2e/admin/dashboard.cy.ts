describe("Admin - Dashboard", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login")
    cy.get('input[name="email"]').type("admin@kembara.com")
    cy.get('input[name="password"]').type("admin123")
    cy.get('button[type="submit"]').click()
    cy.url().should("include", "/admin")
  })

  it("Halaman dashboard dapat diakses", () => {
    cy.visit("http://localhost:3000/admin/dashboard")
    cy.contains("Dashboard").should("be.visible")
  })

  it("Statistik dashboard tampil", () => {
    cy.visit("http://localhost:3000/admin/dashboard")
    cy.wait(2000)
    cy.get("canvas, svg, .recharts-wrapper").should("exist")
  })
})