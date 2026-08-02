// cypress/support/commands.js

const WISATAWAN_EMAIL = "reginawisatawan@gmail.com";
const WISATAWAN_PASSWORD = "reginawisatawan";

/**
 * Login sebagai user WISATAWAN lewat halaman /login (sesuai LoginPage asli).
 *
 * PENTING - perilaku LoginPage asli:
 *  - Field email   : <input name="email" type="email">
 *  - Field password: <input name="password" type="password">
 *  - Tombol submit : <button type="submit">
 *  - Setelah login sukses, LoginPage TIDAK memakai query param "?redirect=",
 *    melainkan redirect otomatis berdasarkan role user:
 *      ADMIN      -> /admin/dashboard
 *      PENGELOLA  -> /pengelola/dashboard (approved) atau /pengelola/verifikasi
 *      WISATAWAN  -> /pengunjung
 *  - User disimpan ke localStorage key "user"
 *
 * Karena akun reginawisatawan@gmail.com berrole WISATAWAN, setelah login
 * akan otomatis diarahkan ke "/pengunjung". Command ini menunggu redirect
 * itu selesai, baru pindah ke halaman tujuan (targetPath).
 *
 * Cara pakai di test:
 *   cy.loginAsWisatawan("/pengunjung/tersimpan");
 */
Cypress.Commands.add("loginAsWisatawan", (targetPath = "/pengunjung") => {
  cy.session(
    "wisatawan-session",
    () => {
      cy.visit("/login");

      cy.get('input[name="email"]').clear().type(WISATAWAN_EMAIL);
      cy.get('input[name="password"]').clear().type(WISATAWAN_PASSWORD);
      cy.get('button[type="submit"]').click();

      // WISATAWAN diarahkan ke /pengunjung setelah login sukses
      cy.url({ timeout: 10000 }).should("include", "/pengunjung");
      cy.window().its("localStorage.user").should("exist");
    },
    {
      validate() {
        cy.window().its("localStorage.user").should("exist");
      },
    }
  );

  cy.visit(targetPath);
});
