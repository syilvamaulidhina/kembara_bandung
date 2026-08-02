describe("Pengujian Halaman Ulasan", () => {

  beforeEach(() => {
    cy.loginAsWisatawan("/pengunjung/ulasan");

    // mock data halaman ulasan
    cy.intercept("GET", "/api/pengunjung/reviews?*", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          visitedPlaces: [
            {
              id: 1,
              destination: {
                id: 1,
                name: "Farm House Lembang",
                address: "Lembang",
                imageUrl: null,
                categories: []
              }
            }
          ],
          reviews: []
        }
      }
    }).as("getReviews");

    // mock upload image
    cy.intercept("POST", "/api/uploads", (req) => {
      req.reply({
        success: true,
        url: "/uploads/foto.jpg"
      });
    }).as("upload");

    // mock submit review
    cy.intercept("POST", "/api/pengunjung/reviews", {
      statusCode: 200,
      body: {
        success: true
      }
    }).as("submitReview");

    cy.visit("/pengunjung/ulasan");
    cy.wait("@getReviews");
  });

  it("Berhasil memberikan ulasan", () => {

    cy.contains("Farm House Lembang").should("exist");

    cy.contains("Berikan Ulasan").click();

    // pilih bintang 5
    cy.get("button")
      .find("svg")
      .eq(4)
      .click({ force: true });

    cy.get("textarea").type("Tempat wisata sangat menarik.");

    cy.get('input[type="file"][accept*="image"]')
      .selectFile("cypress/fixtures/foto.jpg", {
        force: true,
      });

    cy.wait("@upload");

    cy.get('input[type="file"][accept*="video"]')
      .selectFile("cypress/fixtures/video.mp4", {
        force: true,
      });

    cy.wait("@upload");

    cy.contains("Kirim Ulasan").click();

    cy.wait("@submitReview");

    cy.contains("Ulasan berhasil dikirim!").should("exist");
  });

  it("Gagal submit tanpa rating", () => {

    cy.contains("Berikan Ulasan").click();

    cy.get("textarea").type("Komentar");

    cy.contains("Kirim Ulasan").should("be.disabled");
  });

  it("Upload foto dengan format tidak didukung", () => {

    cy.intercept("POST", "/api/uploads", {
      statusCode: 400,
      body: {
        success: false,
        error: "Format file tidak didukung"
      }
    });

    cy.contains("Berikan Ulasan").click();

    cy.get('input[type="file"][accept*="image"]')
      .selectFile("cypress/fixtures/file.pdf", {
        force: true,
      });

    cy.on("window:alert", (text) => {
      expect(text).to.contains("Format file");
    });
  });

  it("Upload video dengan format tidak didukung", () => {

    cy.intercept("POST", "/api/uploads", {
      statusCode: 400,
      body: {
        success: false,
        error: "Format file tidak didukung"
      }
    });

    cy.contains("Berikan Ulasan").click();

    cy.get('input[type="file"][accept*="video"]')
      .selectFile("cypress/fixtures/file.txt", {
        force: true,
      });

    cy.on("window:alert", (text) => {
      expect(text).to.contains("Format file");
    });
  });

});