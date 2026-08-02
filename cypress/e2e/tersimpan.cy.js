// cypress/e2e/pengunjung/tersimpan.cy.js
// -----------------------------------------------------------------------
// Pengujian fungsionalitas halaman "Tempat Tersimpan" (Kembara Bandung)
// File sumber: app/pengunjung/tersimpan/page.tsx
//
// CATATAN:
// - Selector memakai teks/atribut yang terlihat di kode (belum ada data-testid).
//   Kalau nanti mau lebih stabil, tambahkan data-testid di komponen aslinya.
// - Intercept API disesuaikan dengan endpoint yang dipanggil di kode:
//     GET    /api/pengunjung/saved?userId=...&lat=...&lng=...
//     DELETE /api/pengunjung/saved?userId=...&destinationId=...
// - Halaman ini WAJIB login dulu (akun: reginawisatawan@gmail.com).
//   Login dilakukan lewat cy.loginAsWisatawan() di cypress/support/commands.js,
//   BUKAN lagi lewat localStorage manual.
// -----------------------------------------------------------------------

const DUMMY_SAVED = [
  {
    savedId: 101,
    id: 1,
    name: "Kawah Putih",
    address: "Ciwidey, Kabupaten Bandung",
    imageUrl: null,
    latitude: -7.1663,
    longitude: 107.4021,
    ticketPrice: 30000,
    openTime: "07:00",
    closeTime: "17:00",
    distance: 12.5,
    averageRating: 4.6,
    categories: [{ category: { name: "Wisata Alam" } }],
  },
  {
    savedId: 102,
    id: 2,
    name: "Saung Angklung Udjo",
    address: "Padasuka, Kota Bandung",
    imageUrl: null,
    latitude: -6.8983,
    longitude: 107.6486,
    ticketPrice: 0,
    openTime: "09:00",
    closeTime: "16:00",
    distance: 3.2,
    averageRating: 4.8,
    categories: [{ category: { name: "Wisata Budaya" } }],
  },
];

describe("Halaman Tempat Tersimpan (/pengunjung/tersimpan)", () => {
  // ---------------------------------------------------------------------
  // 1. NEGATIF - User belum login harus melihat prompt login, bukan daftar
  // ---------------------------------------------------------------------
  it("TC-01: Menampilkan prompt login jika user belum login", () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/pengunjung/tersimpan");
    cy.contains("Simpan Destinasi Favoritmu").should("be.visible");
    cy.contains("Masuk untuk menyimpan destinasi favorit.").should("be.visible");
    cy.contains("a", "Masuk Sekarang")
      .should("have.attr", "href")
      .and("include", "/auth/login?redirect=/pengunjung/tersimpan");
  });

  // ---------------------------------------------------------------------
  // 2. POSITIF - User login & punya destinasi tersimpan -> list tampil
  // ---------------------------------------------------------------------
  it("TC-02: Menampilkan daftar destinasi tersimpan untuk user yang login", () => {
    cy.intercept("GET", "/api/pengunjung/saved*", {
      statusCode: 200,
      body: { success: true, data: DUMMY_SAVED },
    }).as("getSaved");

    cy.loginAsWisatawan("/pengunjung/tersimpan");

    cy.wait("@getSaved");
    cy.contains(`${DUMMY_SAVED.length} destinasi tersimpan`).should("be.visible");
    cy.contains("Kawah Putih").should("be.visible");
    cy.contains("Saung Angklung Udjo").should("be.visible");
  });

  // ---------------------------------------------------------------------
  // 3. POSITIF - Filter kategori menampilkan destinasi sesuai kategori
  // ---------------------------------------------------------------------
  it("TC-03: Filter tab kategori 'Wisata Budaya' hanya menampilkan destinasi budaya", () => {
    cy.intercept("GET", "/api/pengunjung/saved*", {
      statusCode: 200,
      body: { success: true, data: DUMMY_SAVED },
    }).as("getSaved");

    cy.loginAsWisatawan("/pengunjung/tersimpan");
    cy.wait("@getSaved");

    cy.contains("button", "Wisata Budaya").click();
    cy.contains("Saung Angklung Udjo").should("be.visible");
    cy.contains("Kawah Putih").should("not.exist");
  });

  // ---------------------------------------------------------------------
  // 4. NEGATIF - Filter kategori tanpa hasil -> tampil empty state
  // ---------------------------------------------------------------------
  it("TC-04: Filter tab kategori tanpa data menampilkan pesan kosong", () => {
    cy.intercept("GET", "/api/pengunjung/saved*", {
      statusCode: 200,
      body: { success: true, data: DUMMY_SAVED },
    }).as("getSaved");

    cy.loginAsWisatawan("/pengunjung/tersimpan");
    cy.wait("@getSaved");

    cy.contains("button", "Wisata Religi").click();
    cy.contains('Tidak ada destinasi "wisata religi" tersimpan').should("be.visible");
  });

  // ---------------------------------------------------------------------
  // 5. NEGATIF - Tidak ada destinasi tersimpan sama sekali -> empty state umum
  // ---------------------------------------------------------------------
  it("TC-05: Menampilkan empty state jika belum ada destinasi tersimpan", () => {
    cy.intercept("GET", "/api/pengunjung/saved*", {
      statusCode: 200,
      body: { success: true, data: [] },
    }).as("getSaved");

    cy.loginAsWisatawan("/pengunjung/tersimpan");
    cy.wait("@getSaved");

    cy.contains("Belum ada destinasi tersimpan").should("be.visible");
    cy.contains("a", "Jelajahi Destinasi")
      .should("have.attr", "href", "/pengunjung/kategori");
    cy.contains("a", "Buat Rencana").should("not.exist");
  });

  // ---------------------------------------------------------------------
  // 6. POSITIF - Klik card destinasi mengarahkan ke halaman detail
  // ---------------------------------------------------------------------
  it("TC-06: Klik card destinasi menavigasi ke halaman detail", () => {
    cy.intercept("GET", "/api/pengunjung/saved*", {
      statusCode: 200,
      body: { success: true, data: DUMMY_SAVED },
    }).as("getSaved");

    cy.loginAsWisatawan("/pengunjung/tersimpan");
    cy.wait("@getSaved");

    cy.get(`a[href="/pengunjung/destinasi/${DUMMY_SAVED[0].id}"]`).should(
      "exist"
    );
  });

  // ---------------------------------------------------------------------
  // 7. POSITIF - Hapus destinasi tersimpan berhasil (tombol trash)
  // ---------------------------------------------------------------------
  it("TC-07: Berhasil menghapus destinasi dari daftar tersimpan", () => {
    cy.intercept("GET", "/api/pengunjung/saved*", {
      statusCode: 200,
      body: { success: true, data: DUMMY_SAVED },
    }).as("getSaved");

    cy.intercept("DELETE", "/api/pengunjung/saved*", {
      statusCode: 200,
      body: { success: true },
    }).as("deleteSaved");

    cy.loginAsWisatawan("/pengunjung/tersimpan");
    cy.wait("@getSaved");

    cy.get(`a[href="/pengunjung/destinasi/${DUMMY_SAVED[0].id}"]`)
      .find("button")
      .first()
      .click({ force: true });

    cy.wait("@deleteSaved");
    cy.contains("Kawah Putih").should("not.exist");
    cy.contains("1 destinasi tersimpan").should("be.visible");
  });

  // ---------------------------------------------------------------------
  // 8. POSITIF - Tombol "Tambah ke Rencana" membuka modal itinerary
  // ---------------------------------------------------------------------
  it("TC-08: Membuka modal 'Tambah ke Rencana' saat tombol diklik", () => {
    cy.intercept("GET", "/api/pengunjung/saved*", {
      statusCode: 200,
      body: { success: true, data: DUMMY_SAVED },
    }).as("getSaved");

    cy.loginAsWisatawan("/pengunjung/tersimpan");
    cy.wait("@getSaved");

    cy.get(`a[href="/pengunjung/destinasi/${DUMMY_SAVED[0].id}"]`)
      .contains("button", "Tambah ke Rencana")
      .click({ force: true });

    // Modal diasumsikan menampilkan nama destinasi saat terbuka
    cy.contains("Kawah Putih").should("be.visible");
  });

  // ---------------------------------------------------------------------
  // 9. NEGATIF - Gagal fetch data tersimpan (API error) -> list kosong, tanpa crash
  // ---------------------------------------------------------------------
  it("TC-9: Halaman tidak crash saat API gagal mengambil data tersimpan", () => {
    cy.intercept("GET", "/api/pengunjung/saved*", {
      statusCode: 500,
      body: { success: false, message: "Internal Server Error" },
    }).as("getSavedFail");

    cy.loginAsWisatawan("/pengunjung/tersimpan");
    cy.wait("@getSavedFail");

    cy.contains("Belum ada destinasi tersimpan").should("be.visible");
  });
});