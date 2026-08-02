// cypress/e2e/kategori.cy.js
// Tes halaman "/pengunjung/kategori" (app/pengunjung/kategori/page.tsx)

describe("Halaman Kategori - Kembara Bandung", () => {
  beforeEach(() => {
    // Mock API kategori supaya test tidak bergantung data DB asli
    cy.intercept("GET", "**/api/pengunjung/categories", {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { id: 1, name: "Wisata Alam", _count: { destinations: 12 } },
          { id: 2, name: "Kuliner", _count: { destinations: 8 } },
          { id: 3, name: "Sejarah", _count: { destinations: 5 } },
        ],
      },
    }).as("getCategories");

    cy.visit("/pengunjung/kategori", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake((cb) => {
          cb({ coords: { latitude: -6.9147, longitude: 107.6098 } });
        });
      },
    });

    cy.wait("@getCategories");
  });

  it("1. halaman kategori muncul dengan benar", () => {
    cy.contains("h1", "Jelajahi Kategori Wisata").should("be.visible");
    cy.contains("Destinasi Populer").should("be.visible");
    cy.contains("Terdekat dari Lokasimu").should("be.visible");

    // Kategori dari DB (mock) ikut muncul, skeleton loading sudah hilang
    cy.get(".animate-pulse").should("not.exist");
    cy.contains("Wisata Alam").should("be.visible");
    cy.contains("Kuliner").should("be.visible");
    cy.contains("Sejarah").should("be.visible");
  });

  it("2. klik kategori 'Wisata Alam' mengarahkan ke /pengunjung/kategori/wisata-alam", () => {
    cy.contains("a", "Wisata Alam")
      .should("have.attr", "href", "/pengunjung/kategori/wisata-alam")
      .click();

    cy.url().should("include", "/pengunjung/kategori/wisata-alam");
  });

  it("klik card 'Destinasi Populer' mengarahkan ke /pengunjung/kategori/populer", () => {
    cy.contains("a", "🔥 Destinasi Populer")
      .should("have.attr", "href", "/pengunjung/kategori/populer")
      .click();
    cy.url().should("include", "/pengunjung/kategori/populer");
  });

  it("klik card 'Terdekat' mengarahkan ke /pengunjung/kategori/terdekat (kalau GPS aktif)", () => {
    cy.contains("a", "Terdekat dari Lokasimu")
      .should("have.attr", "href", "/pengunjung/kategori/terdekat")
      .click();
    cy.url().should("include", "/pengunjung/kategori/terdekat");
  });

  it("3. klik 'Buat Itinerary AI' mengarahkan ke /pengunjung/rencana", () => {
    cy.contains("a", "Buat Itinerary AI")
      .should("have.attr", "href", "/pengunjung/rencana")
      .click();
    cy.url().should("include", "/pengunjung/rencana");
  });

  it("breadcrumb 'Beranda' bisa diklik dan kembali ke halaman utama", () => {
    cy.contains("a", "Beranda").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/pengunjung");
  });

  it("kalau kategori DB kosong, tampil pesan 'Belum ada kategori'", () => {
    cy.intercept("GET", "**/api/pengunjung/categories", {
      statusCode: 200,
      body: { success: true, data: [] },
    }).as("getEmptyCategories");

    cy.visit("/pengunjung/kategori");
    cy.wait("@getEmptyCategories");
    cy.contains("Belum ada kategori yang dibuat admin.").should("be.visible");
  });

  it("kalau GPS belum aktif, tampil ajakan 'Aktifkan GPS' bukan card Terdekat", () => {
    // Visit tanpa stub geolocation (browser test-runner biasanya deny by default)
    cy.visit("/pengunjung/kategori");
    cy.wait("@getCategories");
    cy.contains("Aktifkan GPS untuk melihat destinasi").should("be.visible");
  });
});