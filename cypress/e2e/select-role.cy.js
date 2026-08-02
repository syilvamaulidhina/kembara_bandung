// cypress/e2e/auth/select-role.cy.js
// -----------------------------------------------------------------------
// Pengujian fungsionalitas halaman Select Role (Kembara Bandung)
// File sumber: app/select-role/page.tsx
// Endpoint: PATCH /api/user/role
// -----------------------------------------------------------------------

function setLocalUser(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

describe("Halaman Select Role (/select-role)", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  // ---------------------------------------------------------------------
  // 1. NEGATIF - Tidak ada user di localStorage -> redirect ke /login
  // ---------------------------------------------------------------------
  it("TC-01: Redirect ke /login jika belum ada user tersimpan", () => {
    cy.visit("/select-role");
    cy.url().should("include", "/login");
  });

  // ---------------------------------------------------------------------
  // 2. POSITIF - User dengan role ADMIN otomatis redirect ke /admin
  // ---------------------------------------------------------------------
  it("TC-02: User berrole ADMIN otomatis diarahkan ke /admin", () => {
    cy.visit("/select-role", {
      onBeforeLoad() {
        setLocalUser({ id: 1, role: "ADMIN" });
      },
    });
    cy.url().should("include", "/admin");
  });

  // ---------------------------------------------------------------------
  // 3. POSITIF - User PENGELOLA sudah APPROVED redirect ke /pengelola
  // ---------------------------------------------------------------------
  it("TC-03: User PENGELOLA terverifikasi diarahkan ke /pengelola", () => {
    cy.visit("/select-role", {
      onBeforeLoad() {
        setLocalUser({ id: 2, role: "PENGELOLA", verificationStatus: "APPROVED" });
      },
    });
    cy.url().should("include", "/pengelola");
    cy.url().should("not.include", "/verifikasi");
  });

  // ---------------------------------------------------------------------
  // 4. POSITIF - User PENGELOLA belum APPROVED redirect ke /pengelola/verifikasi
  // ---------------------------------------------------------------------
  it("TC-04: User PENGELOLA belum terverifikasi diarahkan ke /pengelola/verifikasi", () => {
    cy.visit("/select-role", {
      onBeforeLoad() {
        setLocalUser({ id: 3, role: "PENGELOLA", verificationStatus: "PENDING" });
      },
    });
    cy.url().should("include", "/pengelola/verifikasi");
  });

  // ---------------------------------------------------------------------
  // 5. POSITIF - User WISATAWAN otomatis redirect ke /pengunjung
  // ---------------------------------------------------------------------
  it("TC-05: User berrole WISATAWAN otomatis diarahkan ke /pengunjung", () => {
    cy.visit("/select-role", {
      onBeforeLoad() {
        setLocalUser({ id: 4, role: "WISATAWAN" });
      },
    });
    cy.url().should("include", "/pengunjung");
  });

  // ---------------------------------------------------------------------
  // 6. POSITIF - User baru tanpa role memilih "Wisatawan" lalu konfirmasi
  // ---------------------------------------------------------------------
  it("TC-06: User baru berhasil memilih peran Wisatawan dan diarahkan ke /pengunjung", () => {
    cy.intercept("PATCH", "/api/user/role", {
      statusCode: 200,
      body: { user: { role: "WISATAWAN", verificationStatus: null } },
    }).as("setRole");

    cy.visit("/select-role", {
      onBeforeLoad() {
        setLocalUser({ id: 5, role: null });
      },
    });

    cy.contains("button", "Wisatawan").click();
    cy.contains("button", "Pilih Peran Ini").click();

    cy.wait("@setRole");
    cy.url().should("include", "/pengunjung");
  });

  // ---------------------------------------------------------------------
  // 7. POSITIF - User baru memilih "Pengelola Wisata" (belum approved)
  // ---------------------------------------------------------------------
  it("TC-07: User baru memilih peran Pengelola diarahkan ke halaman verifikasi", () => {
    cy.intercept("PATCH", "/api/user/role", {
      statusCode: 200,
      body: { user: { role: "PENGELOLA", verificationStatus: "PENDING" } },
    }).as("setRolePengelola");

    cy.visit("/select-role", {
      onBeforeLoad() {
        setLocalUser({ id: 6, role: null });
      },
    });

    cy.contains("button", "Pengelola Wisata").click();
    cy.contains("button", "Pilih Peran Ini").click();

    cy.wait("@setRolePengelola");
    cy.url().should("include", "/pengelola/verifikasi");
  });

  // ---------------------------------------------------------------------
  // 8. NEGATIF - Klik "Pilih Peran Ini" tanpa memilih role dulu
  // ---------------------------------------------------------------------
  it("TC-08: Tombol 'Pilih Peran Ini' nonaktif tanpa memilih role", () => {
    cy.visit("/select-role", {
      onBeforeLoad() {
        setLocalUser({ id: 7, role: null });
      },
    });

    cy.contains("button", "Pilih Peran Ini").should("be.disabled");
  });

  // ---------------------------------------------------------------------
  // 9. NEGATIF - PATCH gagal saat konfirmasi role -> alert error
  // ---------------------------------------------------------------------
  it("TC-09: Menampilkan alert saat gagal menyimpan role ke server", () => {
    cy.intercept("PATCH", "/api/user/role", {
      statusCode: 500,
      body: { message: "Gagal menyimpan role" },
    }).as("setRoleFail");

    cy.on("window:alert", (msg) => {
      expect(msg).to.contains("Gagal menyimpan role");
    });

    cy.visit("/select-role", {
      onBeforeLoad() {
        setLocalUser({ id: 8, role: null });
      },
    });

    cy.contains("button", "Wisatawan").click();
    cy.contains("button", "Pilih Peran Ini").click();

    cy.wait("@setRoleFail");
  });

  // ---------------------------------------------------------------------
  // 10. NEGATIF - Session hilang saat klik konfirmasi (localStorage dihapus manual)
  // ---------------------------------------------------------------------
  it("TC-10: Menampilkan alert dan redirect ke /login jika session hilang saat konfirmasi", () => {
    cy.on("window:alert", (msg) => {
      expect(msg).to.contains("Session tidak ditemukan");
    });

    cy.visit("/select-role", {
      onBeforeLoad() {
        setLocalUser({ id: 9, role: null });
      },
    });

    cy.contains("button", "Wisatawan").click();
    cy.window().then((win) => win.localStorage.removeItem("user"));
    cy.contains("button", "Pilih Peran Ini").click();

    cy.url().should("include", "/login");
  });
});
