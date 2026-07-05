describe("Admin - Login", () => {
  it("Login admin berhasil", () => {
    cy.visit("http://localhost:3000/login")
    cy.get('input[name="email"]').type("admin@kembara.com")
    cy.get('input[name="password"]').type("admin123")
    cy.get('button[type="submit"]').click()
    cy.url().should("include", "/admin")
  })

  it("Login gagal dengan kredensial salah", () => {
    cy.visit("http://localhost:3000/login")
    cy.get('input[name="email"]').type("salah@kembara.com")
    cy.get('input[name="password"]').type("salahjuga")
    cy.get('button[type="submit"]').click()
    cy.url().should("not.include", "/admin")
  })
})