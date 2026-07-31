describe("Rencana Perjalanan", () => {

    beforeEach(() => {
        cy.loginAsWisatawan("/pengunjung/rencana");
    });

    it("Membuka halaman Rencana Perjalanan", () => {
        cy.contains("Rencana Perjalanan").should("be.visible");
    });

    it("Membuka modal Buat Rencana Baru", () => {
        cy.contains("Buat Rencana Baru").click();
        cy.get("body").should("contain.text", "Buat Rencana");
    });

    it("Membuka detail itinerary", () => {
        cy.contains("Lihat Detail").first().click();
        cy.url().should("include", "/pengunjung/rencana/");
    });

    it("Kembali ke halaman Beranda melalui breadcrumb", () => {
        cy.contains("Beranda").click();
        cy.url().should("include", "/pengunjung");
    });

});