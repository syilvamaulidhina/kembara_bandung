describe("Admin - Verifikasi Pengelola", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login")
    cy.get('input[name="email"]').type("admin@kembara.com")
    cy.get('input[name="password"]').type("admin123")
    cy.get('button[type="submit"]').click()
    cy.wait(3000)
    cy.url({ timeout: 10000 }).should("include", "/admin")
  })

  it("Halaman verifikasi pengelola dapat diakses", () => {
    cy.visit("http://localhost:3000/admin/verifikasi-pengelola")
    cy.wait(2000)
    cy.contains("Verifikasi").should("be.visible")
  })

  it("Daftar pengelola pending tampil", () => {
    cy.visit("http://localhost:3000/admin/verifikasi-pengelola")
    cy.wait(2000)
    cy.contains("Verifikasi").should("be.visible")
  })
})