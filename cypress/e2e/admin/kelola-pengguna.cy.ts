describe("Admin - Kelola Pengguna", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login")
    cy.get('input[name="email"]').type("admin@kembara.com")
    cy.get('input[name="password"]').type("admin123")
    cy.get('button[type="submit"]').click()
    cy.url().should("include", "/admin")
  })

  it("Halaman kelola pengguna dapat diakses", () => {
    cy.visit("http://localhost:3000/admin/kelola-pengguna")
    cy.wait(2000)
    cy.contains("Pengguna").should("be.visible")
  })

  it("Daftar pengguna tampil", () => {
    cy.visit("http://localhost:3000/admin/kelola-pengguna")
    cy.wait(2000)
    cy.get("table, .pengguna-list").should("exist")
  })
})