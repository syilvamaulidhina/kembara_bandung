// cypress/e2e/auth/login.cy.js
// -----------------------------------------------------------------------
// Pengujian fungsionalitas halaman Login (Kembara Bandung)
// File sumber: app/login/page.tsx
// Endpoint: POST /api/login
// -----------------------------------------------------------------------

describe("Halaman Login (/login)", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/login");
  });

  // ---------------------------------------------------------------------
  // 1. POSITIF - Login sukses dengan role WISATAWAN
  // ---------------------------------------------------------------------
  it("TC-01: Login berhasil dengan akun WISATAWAN dan redirect ke /pengunjung", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          name: "Regina Wisatawan",
          email: "reginawisatawan@gmail.com",
          role: "WISATAWAN",
          verificationStatus: null,
        },
      },
    }).as("loginRequest");

    cy.get('input[name="email"]').type("reginawisatawan@gmail.com");
    cy.get('input[name="password"]').type("reginawisatawan");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");
    cy.url().should("include", "/pengunjung");
    cy.window().its("localStorage.user").should("contain", "WISATAWAN");
  });

  // ---------------------------------------------------------------------
  // 2. NEGATIF - Submit form kosong menampilkan pesan wajib diisi
  // ---------------------------------------------------------------------
  it("TC-02: Menampilkan pesan validasi saat email dan password kosong", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Email wajib diisi").should("be.visible");
    cy.contains("Password wajib diisi").should("be.visible");
  });

  // ---------------------------------------------------------------------
  // 3. NEGATIF - Hanya email diisi, password kosong
  // ---------------------------------------------------------------------
  it("TC-03: Menampilkan pesan validasi saat password kosong", () => {
    cy.get('input[name="email"]').type("reginawisatawan@gmail.com");
    cy.get('button[type="submit"]').click();
    cy.contains("Password wajib diisi").should("be.visible");
    cy.contains("Email wajib diisi").should("not.exist");
  });

  // ---------------------------------------------------------------------
  // 4. NEGATIF - Kredensial salah -> API mengembalikan error
  // ---------------------------------------------------------------------
  it("TC-04: Menampilkan pesan error saat email/password salah", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 401,
      body: { message: "Email atau password salah" },
    }).as("loginFail");

    cy.get('input[name="email"]').type("salah@gmail.com");
    cy.get('input[name="password"]').type("passwordsalah");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginFail");
    cy.contains("Email atau password salah").should("be.visible");
    cy.url().should("include", "/login");
  });

  // ---------------------------------------------------------------------
  // 5. POSITIF - Toggle show/hide password
  // ---------------------------------------------------------------------
  it("TC-05: Tombol mata dapat menampilkan dan menyembunyikan password", () => {
    cy.get('input[name="password"]').type("reginawisatawan");
    cy.get('input[name="password"]').should("have.attr", "type", "password");

    cy.get('form button[type="button"]').click();
    cy.get('input[name="password"]').should("have.attr", "type", "text");

    cy.get('form button[type="button"]').click();
    cy.get('input[name="password"]').should("have.attr", "type", "password");
  });

  // ---------------------------------------------------------------------
  // 6. POSITIF - Login role ADMIN redirect ke /admin/dashboard
  // ---------------------------------------------------------------------
  it("TC-06: Login berhasil dengan akun ADMIN dan redirect ke /admin/dashboard", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { user: { id: 2, role: "ADMIN" } },
    }).as("loginAdmin");

    cy.get('input[name="email"]').type("admin@kembara.com");
    cy.get('input[name="password"]').type("adminpass");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginAdmin");
    cy.url().should("include", "/admin/dashboard");
  });

  // ---------------------------------------------------------------------
  // 7. POSITIF - Login role PENGELOLA belum diverifikasi -> /pengelola/verifikasi
  // ---------------------------------------------------------------------
  it("TC-07: Login akun PENGELOLA belum terverifikasi diarahkan ke halaman verifikasi", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { user: { id: 3, role: "PENGELOLA", verificationStatus: "PENDING" } },
    }).as("loginPengelola");

    cy.get('input[name="email"]').type("pengelola@kembara.com");
    cy.get('input[name="password"]').type("pengelolapass");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginPengelola");
    cy.url().should("include", "/pengelola/verifikasi");
  });

  // ---------------------------------------------------------------------
  // 8. NEGATIF - Terjadi kegagalan jaringan saat login
  // ---------------------------------------------------------------------
  it("TC-08: Menampilkan pesan error umum saat terjadi kegagalan jaringan", () => {
    cy.intercept("POST", "/api/login", { forceNetworkError: true }).as(
      "loginNetworkError"
    );

    cy.get('input[name="email"]').type("reginawisatawan@gmail.com");
    cy.get('input[name="password"]').type("reginawisatawan");
    cy.get('button[type="submit"]').click();

    cy.contains("Terjadi error, coba lagi").should("be.visible");
  });

  // ---------------------------------------------------------------------
  // 9. POSITIF - Link menuju halaman Register tersedia
  // ---------------------------------------------------------------------
  it("TC-09: Link 'Daftar' mengarah ke halaman register", () => {
    cy.contains("a", "Daftar").should("have.attr", "href", "/register");
  });

  // ---------------------------------------------------------------------
  // 10. POSITIF - Tombol login menampilkan status loading saat submit
  // ---------------------------------------------------------------------
  it("TC-10: Tombol login menampilkan teks 'Memproses...' saat submit", () => {
    cy.intercept("POST", "/api/login", (req) => {
      req.reply({
        delay: 500,
        statusCode: 200,
        body: { user: { id: 1, role: "WISATAWAN" } },
      });
    }).as("loginSlow");

    cy.get('input[name="email"]').type("reginawisatawan@gmail.com");
    cy.get('input[name="password"]').type("reginawisatawan");
    cy.get('button[type="submit"]').click();

    cy.contains("button", "Memproses...").should("be.visible");
  });
});
