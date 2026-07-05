describe("Admin - Kelola Kategori", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login")
    cy.get('input[name="email"]').type("admin@kembara.com")
    cy.get('input[name="password"]').type("admin123")
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.url().should("include", "/admin")
  })

  it("Halaman kelola kategori dapat diakses", () => {
    cy.visit("http://localhost:3000/admin/kategori")
    cy.wait(2000)
    cy.contains("Kelola Kategori").should("be.visible")
  })

  it("Daftar kategori tampil", () => {
    cy.visit("http://localhost:3000/admin/kategori")
    cy.wait(2000)
    cy.contains("Daftar Kategori").should("be.visible")
  })

  it("Fitur pencarian kategori berfungsi", () => {
    cy.visit("http://localhost:3000/admin/kategori")
    cy.wait(2000)
    cy.get('input[placeholder="Cari kategori..."]').type("wisata")
    cy.wait(1000)
  })
})