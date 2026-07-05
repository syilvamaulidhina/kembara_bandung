describe("Admin - Approval Wisata", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login")
    cy.get('input[name="email"]').type("admin@kembara.com")
    cy.get('input[name="password"]').type("admin123")
    cy.get('button[type="submit"]').click()
    cy.url().should("include", "/admin")
  })

  it("Halaman approval wisata dapat diakses", () => {
    cy.visit("http://localhost:3000/admin/approval-wisata")
    cy.wait(2000)
    cy.contains("Approval Wisata").should("be.visible")
  })

  it("Filter tab approval wisata tampil", () => {
    cy.visit("http://localhost:3000/admin/approval-wisata")
    cy.wait(2000)
    cy.contains("Pending").should("be.visible")
    cy.contains("Disetujui").should("be.visible")
    cy.contains("Ditolak").should("be.visible")
  })
})