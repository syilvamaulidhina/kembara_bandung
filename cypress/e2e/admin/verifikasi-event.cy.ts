describe("Admin - Verifikasi Event", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login")
    cy.get('input[name="email"]').type("admin@kembara.com")
    cy.get('input[name="password"]').type("admin123")
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.url().should("include", "/admin")
  })

  it("Halaman verifikasi event dapat diakses", () => {
    cy.visit("http://localhost:3000/admin/verifikasi-event")
    cy.wait(2000)
    cy.contains("Verifikasi Event").should("be.visible")
  })

  it("Tab filter event tampil", () => {
    cy.visit("http://localhost:3000/admin/verifikasi-event")
    cy.wait(2000)
    cy.contains("Pending").should("be.visible")
    cy.contains("Disetujui").should("be.visible")
    cy.contains("Ditolak").should("be.visible")
  })
})