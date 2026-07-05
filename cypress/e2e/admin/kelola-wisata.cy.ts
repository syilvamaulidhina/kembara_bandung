describe("Admin - Kelola Wisata", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login")
    cy.get('input[name="email"]').type("admin@kembara.com")
    cy.get('input[name="password"]').type("admin123")
    cy.get('button[type="submit"]').click()
    cy.wait(3000)
    cy.url({ timeout: 10000 }).should("include", "/admin")
  })

  it("Halaman kelola wisata dapat diakses", () => {
    cy.visit("http://localhost:3000/admin/kelola-wisata")
    cy.wait(2000)
    cy.contains("Manajemen Wisata").should("be.visible")
  })

  it("Daftar wisata tampil", () => {
    cy.visit("http://localhost:3000/admin/kelola-wisata")
    cy.wait(2000)
    cy.contains("Daftar Wisata").should("be.visible")
  })
})