describe("Beranda Pengunjung", () => {

  beforeEach(() => {
    cy.visit("http://localhost:3000/pengunjung");
  });

  // =====================
  // POSITIVE TEST
  // =====================

  it("Menampilkan halaman beranda", () => {
    cy.url().should("include", "/pengunjung");
  });

  it("Menampilkan peta", () => {
    cy.get(".leaflet-container", { timeout: 10000 }).should("exist");
  });

  it("Menampilkan tombol Buat Rencana", () => {
    cy.contains("Buat Rencana").should("be.visible");
  });

  it("Menampilkan tombol Lihat Semua", () => {
    cy.contains("Lihat Semua").should("be.visible");
  });

  it("Berpindah ke halaman kategori", () => {
    cy.contains("Lihat Semua").click();

    cy.url().should("include", "/pengunjung/kategori");
  });

  it("Filter Populer dapat dipilih", () => {
    cy.contains("Populer").click();
    cy.contains("Populer").should("exist");
  });

  it("Menampilkan filter Terdekat", () => {
    cy.contains("Terdekat").should("exist");
  });

  it("Menampilkan daftar destinasi", () => {
    cy.get("body").then(($body) => {
      if (!$body.text().includes("Tidak ada destinasi ditemukan")) {
        cy.get("img").its("length").should("be.greaterThan", 0);
      }
    });
  });

  // =====================
  // NEGATIVE TEST
  // =====================

  it("Menampilkan pesan jika tidak ada destinasi", () => {
    cy.intercept(
      "GET",
      "**/api/pengunjung/destinations*",
      {
        success: true,
        data: []
      }
    );

    cy.reload();

    cy.contains("Tidak ada destinasi ditemukan").should("be.visible");
  });

  it("Pengguna yang belum login diarahkan ke login saat klik Buat Rencana", () => {

    cy.window().then((win) => {
      win.localStorage.removeItem("user");
    });

    cy.on("window:alert", (text) => {
      expect(text).to.contains("Silakan masuk");
    });

    cy.contains("Buat Rencana").click();
  });

});