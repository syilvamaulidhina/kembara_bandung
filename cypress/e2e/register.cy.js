// cypress/e2e/auth/register.cy.js
// -----------------------------------------------------------------------
// Pengujian fungsionalitas halaman Register (Kembara Bandung)
// File sumber: app/register/page.tsx
// Endpoint: POST /api/register
// -----------------------------------------------------------------------

describe("Halaman Register (/register)", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/register");
  });

  // ---------------------------------------------------------------------
  // 1. POSITIF - Register berhasil dengan data valid
  // ---------------------------------------------------------------------
  it("TC-01: Register berhasil dengan data valid dan redirect ke /select-role", () => {
    cy.intercept("POST", "/api/register", {
      statusCode: 200,
      body: {
        user: { id: 10, name: "Regina Baru", email: "reginabaru@gmail.com" },
      },
    }).as("registerRequest");

    cy.get('input[name="name"]').type("Regina Baru");
    cy.get('input[name="email"]').type("reginabaru@gmail.com");
    cy.get('input[name="password"]').type("passwordkuat123");
    cy.get('input[name="confirmPassword"]').type("passwordkuat123");
    cy.get('input[name="terms"]').check();
    cy.contains("button", "Daftar").click();

    cy.wait("@registerRequest");
    cy.url().should("include", "/select-role");
    cy.window().its("localStorage.user").should("contain", "reginabaru@gmail.com");
  });

  // ---------------------------------------------------------------------
  // 2. NEGATIF - Semua field kosong -> semua pesan validasi muncul
  // ---------------------------------------------------------------------
  it("TC-02: Menampilkan semua pesan validasi saat form kosong", () => {
    cy.contains("button", "Daftar").click();
    cy.contains("Nama wajib diisi").should("be.visible");
    cy.contains("Email wajib diisi").should("be.visible");
    cy.contains("Password wajib diisi").should("be.visible");
    cy.contains("Konfirmasi password wajib diisi").should("be.visible");
    cy.contains("Harus disetujui").should("be.visible");
  });

  // ---------------------------------------------------------------------
  // 3. NEGATIF - Password dan konfirmasi password tidak sama
  // ---------------------------------------------------------------------
  it("TC-03: Menampilkan error saat password dan konfirmasi tidak sama", () => {
    cy.get('input[name="name"]').type("Regina Baru");
    cy.get('input[name="email"]').type("reginabaru@gmail.com");
    cy.get('input[name="password"]').type("passwordA");
    cy.get('input[name="confirmPassword"]').type("passwordB");
    cy.get('input[name="terms"]').check();
    cy.contains("button", "Daftar").click();

    cy.contains("Password tidak sama").should("be.visible");
  });

  // ---------------------------------------------------------------------
  // 4. NEGATIF - Terms belum dicentang
  // ---------------------------------------------------------------------
  it("TC-04: Menampilkan error saat syarat & ketentuan belum disetujui", () => {
    cy.get('input[name="name"]').type("Regina Baru");
    cy.get('input[name="email"]').type("reginabaru@gmail.com");
    cy.get('input[name="password"]').type("passwordkuat123");
    cy.get('input[name="confirmPassword"]').type("passwordkuat123");
    cy.contains("button", "Daftar").click();

    cy.contains("Harus disetujui").should("be.visible");
  });

  // ---------------------------------------------------------------------
  // 5. NEGATIF - Email sudah terdaftar (API mengembalikan error)
  // ---------------------------------------------------------------------
  it("TC-05: Menampilkan alert saat email sudah terdaftar", () => {
    cy.intercept("POST", "/api/register", {
      statusCode: 400,
      body: { message: "Email sudah terdaftar" },
    }).as("registerFail");

    cy.on("window:alert", (msg) => {
      expect(msg).to.contains("Email sudah terdaftar");
    });

    cy.get('input[name="name"]').type("Regina Baru");
    cy.get('input[name="email"]').type("reginawisatawan@gmail.com");
    cy.get('input[name="password"]').type("passwordkuat123");
    cy.get('input[name="confirmPassword"]').type("passwordkuat123");
    cy.get('input[name="terms"]').check();
    cy.contains("button", "Daftar").click();

    cy.wait("@registerFail");
  });

  // ---------------------------------------------------------------------
  // 6. POSITIF - Toggle show/hide password & confirm password
  // ---------------------------------------------------------------------
  it("TC-06: Tombol mata dapat menampilkan/menyembunyikan password dan konfirmasi password", () => {
    cy.get('input[name="password"]').type("passwordkuat123");
    cy.get('input[name="confirmPassword"]').type("passwordkuat123");

    cy.get('input[name="password"]').should("have.attr", "type", "password");
    cy.get('input[name="confirmPassword"]').should("have.attr", "type", "password");

    // Toggle password pertama
    cy.get('input[name="password"]')
      .parent()
      .find('button[type="button"]')
      .click();
    cy.get('input[name="password"]').should("have.attr", "type", "text");

    // Toggle konfirmasi password
    cy.get('input[name="confirmPassword"]')
      .parent()
      .find('button[type="button"]')
      .click();
    cy.get('input[name="confirmPassword"]').should("have.attr", "type", "text");
  });

  // ---------------------------------------------------------------------
  // 7. POSITIF - Link menuju halaman Login tersedia
  // ---------------------------------------------------------------------
  it("TC-07: Link 'Masuk' mengarah ke halaman login", () => {
    cy.contains("a", "Masuk").should("have.attr", "href", "/login");
  });

  // ---------------------------------------------------------------------
  // 8. NEGATIF - Terjadi kegagalan jaringan saat register
  // ---------------------------------------------------------------------
  it("TC-08: Menampilkan alert saat terjadi kegagalan jaringan", () => {
    cy.intercept("POST", "/api/register", { forceNetworkError: true }).as(
      "registerNetworkError"
    );

    cy.on("window:alert", (msg) => {
      expect(msg).to.contains("Terjadi error, coba lagi");
    });

    cy.get('input[name="name"]').type("Regina Baru");
    cy.get('input[name="email"]').type("reginabaru@gmail.com");
    cy.get('input[name="password"]').type("passwordkuat123");
    cy.get('input[name="confirmPassword"]').type("passwordkuat123");
    cy.get('input[name="terms"]').check();
    cy.contains("button", "Daftar").click();
  });
});
