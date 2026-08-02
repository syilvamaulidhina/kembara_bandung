describe("Detail Rencana Perjalanan", () => {

    beforeEach(() => {
        cy.loginAsWisatawan("/pengunjung/rencana");

        cy.contains("Lihat Detail").first().click();
        cy.url().should("include", "/pengunjung/rencana/");
    });

    it("Menampilkan halaman detail itinerary", () => {
        cy.get("h1").should("be.visible");
    });

    it("Kembali ke halaman daftar rencana", () => {
        cy.get('a[href="/pengunjung/rencana"]').first().click();
        cy.url().should("include", "/pengunjung/rencana");
    });

    it("Membuka modal Tambah Destinasi", () => {
        cy.contains("Tambah Destinasi").click();
        cy.get("body").should("contain.text", "Tambah Destinasi");
    });

    it("Membuka halaman peta penuh", () => {
        cy.contains("Buka Peta Penuh").click();
        cy.url().should("include", "/pengunjung/peta-rute");
    });

    it("Membuka halaman detail destinasi", () => {
        cy.get('a[href*="/pengunjung/destinasi/"]').first().click();
        cy.url().should("include", "/pengunjung/destinasi/");
    });

    it("Mengaktifkan mode edit judul itinerary", () => {
        cy.get("button").find("svg").first().click({ force: true });
    });

    it("Menekan tombol Mulai Navigasi", () => {
        cy.contains("Mulai Navigasi").click();
    });

});