// cypress/e2e/kategori-detail.cy.js
// Tes halaman "/pengunjung/kategori/[slug]" (app/pengunjung/kategori/[slug]/page.tsx)

describe("Halaman Detail Kategori - Kembara Bandung", () => {
  const mockDestinations = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `Destinasi ${i + 1}`,
    address: "Jl. Contoh No. 1, Bandung",
    latitude: -6.9 + i * 0.01,
    longitude: 107.6 + i * 0.01,
    imageUrl: null,
    ticketPrice: 20000,
    maxPrice: 50000,
    openTime: "08:00",
    closeTime: "17:00",
    averageRating: 4.2,
    reviewCount: 10,
    isSaved: false,
    visitCount: 100 - i,
    categories: [{ category: { name: "Wisata Alam" } }],
  }));

  beforeEach(() => {
    cy.intercept("GET", "**/api/pengunjung/categories", {
      statusCode: 200,
      body: {
        success: true,
        data: [{ id: 1, name: "Wisata Alam", _count: { destinations: 10 } }],
      },
    }).as("getCategories");

    cy.intercept("GET", "**/api/pengunjung/destinations*", {
      statusCode: 200,
      body: {
        success: true,
        data: mockDestinations.slice(0, 8),
        pagination: { total: 10 },
      },
    }).as("getDestinations");
  });

  it("1. halaman detail kategori muncul dengan data yang benar", () => {
    cy.visit("/pengunjung/kategori/wisata-alam");
    cy.wait(["@getCategories", "@getDestinations"]);

    cy.contains("h1", "Wisata Alam").should("be.visible");
    cy.contains("Menampilkan 8 dari 10 destinasi").should("be.visible");
    cy.contains("Destinasi 1").should("be.visible");
  });

  it("kategori yang tidak ada di DB menampilkan pesan 'Kategori tidak ditemukan'", () => {
    cy.visit("/pengunjung/kategori/kategori-ngasal");
    cy.wait("@getCategories");
    cy.contains("Kategori tidak ditemukan").should("be.visible");
    cy.contains("a", "Kembali ke Kategori")
      .should("have.attr", "href", "/pengunjung/kategori");
  });

  it("toggle panel Filter muncul dan hilang saat tombol Filter diklik", () => {
    cy.visit("/pengunjung/kategori/wisata-alam");
    cy.wait(["@getCategories", "@getDestinations"]);

    cy.contains("Rating Minimum").should("not.exist");
    cy.contains("button", "Filter").click();
    cy.contains("Rating Minimum").should("be.visible");
    cy.contains("Budget Tiket (Rp)").should("be.visible");

    // tutup panel via tombol X
    cy.get("button").find("svg").parent().contains("Filter"); // sanity
    cy.contains("button", "Filter").click();
    cy.contains("Rating Minimum").should("not.exist");
  });

  it("toggle tampilan List <-> Peta berfungsi", () => {
    cy.visit("/pengunjung/kategori/wisata-alam");
    cy.wait(["@getCategories", "@getDestinations"]);

    cy.contains("button", "Peta").click();
    cy.get(".leaflet-container", { timeout: 10000 }).should("be.visible");
    cy.contains("button", "Daftar").click();
    cy.contains("Destinasi 1").should("be.visible");
  });

  it("filter rating bisa diklik dan berubah aktif", () => {
    cy.visit("/pengunjung/kategori/wisata-alam");
    cy.wait(["@getCategories", "@getDestinations"]);

    cy.contains("button", "Filter").click();
    cy.contains("button", "4+")
      .click()
      .should("have.class", "bg-[#006837]");
  });

  it("tombol 'Reset filter' mengembalikan slider ke nilai default", () => {
    cy.visit("/pengunjung/kategori/wisata-alam");
    cy.wait(["@getCategories", "@getDestinations"]);

    cy.contains("button", "Filter").click();
    cy.get('input[type="range"]').eq(1) // slider budget
      .invoke("val", 100000)
      .trigger("change");

    cy.contains("button", "Reset filter").click();
    cy.contains("Semua").should("be.visible"); // budget kembali ke "Semua"
  });

  it("kalau tidak ada hasil, tampil pesan kosong + tombol reset filter", () => {
    cy.intercept("GET", "**/api/pengunjung/destinations*", {
      statusCode: 200,
      body: { success: true, data: [], pagination: { total: 0 } },
    }).as("getEmptyDestinations");

    cy.visit("/pengunjung/kategori/wisata-alam");
    cy.wait(["@getCategories", "@getEmptyDestinations"]);

    cy.contains("Tidak ada destinasi ditemukan").should("be.visible");
    cy.contains("button", "Reset filter").should("be.visible").click();
  });

  it("breadcrumb kembali ke /pengunjung/kategori berfungsi", () => {
    cy.visit("/pengunjung/kategori/wisata-alam");
    cy.wait(["@getCategories", "@getDestinations"]);

    cy.contains("a", "Kategori").click();
    cy.url().should("include", "/pengunjung/kategori");
    cy.url().should("not.include", "/wisata-alam");
  });
});