describe("Admin - AI Insight", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login")
    cy.get('input[name="email"]').type("admin@kembara.com")
    cy.get('input[name="password"]').type("admin123")
    cy.get('button[type="submit"]').click()
    cy.url().should("include", "/admin")
  })

  it("Halaman AI Insight dapat diakses", () => {
    cy.visit("http://localhost:3000/admin/ai-insight")
    cy.wait(2000)
    cy.contains("AI Insight").should("be.visible")
  })

  it("Konten AI Insight tampil", () => {
    cy.visit("http://localhost:3000/admin/ai-insight")
    cy.wait(5000)
    cy.get("p, .prose, .ai-content").should("exist")
  })
})