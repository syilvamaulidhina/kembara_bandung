--
-- PostgreSQL database dump
--

\restrict R57dJXeb8G2PdcaAJzhajPukcApFDZEBsYyd4qPZKWFOrAXl4Mfizctt8ypgiVa

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public."User" DISABLE TRIGGER ALL;

INSERT INTO public."User" VALUES (2, 'Syilva Maulidhina Riadi', 'syilvamaulidhinariadi@gmail.com', '$2b$10$HXdQYdyaYreIn3wKZsvWB.UXBumLrz8GUzuiaRp1aFj8SOrA4E8U.', 'WISATAWAN', NULL, NULL, NULL, '2026-04-22 15:28:59.617', '2026-04-22 15:29:05.277', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (3, 'kelola', 'kelola@kembara.com', '$2b$10$2tCQE1naC3Sg5NpWhaZxF.tSp128WSYwU6qVCIGbSU/NAiAArmXxO', 'PENGELOLA', NULL, NULL, NULL, '2026-04-22 15:30:46.075', '2026-04-22 15:39:12.037', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (18, 'test', 'TEST@kembara.com', '$2b$10$v88w6nfZmz1u0aIiBtTrIuCPhm9rSwfDZo2wU.PWZdXA7SdQxETOK', 'PENGELOLA', NULL, NULL, NULL, '2026-06-11 08:42:09.724', '2026-06-11 08:43:29.116', NULL, '/uploads/verifikasi-pengelola/verifikasi-18-1781167368207.png', 'APPROVED');
INSERT INTO public."User" VALUES (4, 'kembara test', 'kembaratest@kembara.com', '$2b$10$CeSBseHV1tYh4KtG4WGgMeMsbcxKwKhiJsprFC2wDP8EQmc/PT.Xq', 'PENGELOLA', NULL, NULL, NULL, '2026-04-26 23:52:39.469', '2026-04-26 23:52:49.731', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (1, 'Admin', 'admin@kembara.com', '$2b$10$XIHAnwaJJwCGBabgnmQHZ.aclQUymenlwsZTvF671QLvklALqYBae', 'ADMIN', NULL, NULL, NULL, '2026-04-22 15:22:40.781', '2026-04-27 00:02:22.014', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (5, 'cobadulu', 'cobadulu@kembara.com', '$2b$10$avAZkddNAdOhibcz0/qF7OQqKcZVL2zZP5jA9lZeffKPTTNRZdCm2', 'PENGELOLA', NULL, NULL, NULL, '2026-04-27 00:07:08.536', '2026-04-27 00:07:15.989', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (6, 'Syilva Maulidhina Riadi', 'syelvimaulidinariadi@gmail.com', '$2b$10$MdzSMuTgdbbhLFpEn32DoeL7wMWbxTKh.b5xJDYhXjnsI9Y/ynSye', 'PENGELOLA', NULL, NULL, NULL, '2026-05-25 13:25:23.23', '2026-05-25 13:25:32.071', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (7, 'Syilva Maulidhina Riadi', 'akunapaaja1405@gmail.com', '$2b$10$7vZVsXHoXBfG200uKpvwj.WtvaQumYZI.i11RMZ/uqikw5gWGZJa6', 'WISATAWAN', NULL, NULL, NULL, '2026-06-01 03:40:16.052', '2026-06-01 03:40:22.09', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (8, 'test aja', 'asyillariadi@gmail.com', '$2b$10$6f0hB1LqBQ78.9ODlR2FD.hZQajfrpDVDXlhMTYGuHCYpEiDOtqjq', 'PENGELOLA', NULL, NULL, NULL, '2026-06-01 03:44:11.263', '2026-06-01 03:44:15.87', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (9, 'Syilva Maulidhina Riadi', 'akunapa@gmail.com', '$2b$10$5wVfcVCNtNTlwzg25VCUaeUzqSQlJr/3dYjQdxkuSEH0W66GTjOy6', 'WISATAWAN', NULL, NULL, NULL, '2026-06-01 06:43:36.124', '2026-06-01 06:43:43.967', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (10, 'test pengelola', 'testpengelola@gmail.com', '$2b$10$mifIuSsTjA0HtSFWFzkf9OKVBTTK9080Gjy9z/ZouyQW.6rwKmSuG', 'PENGELOLA', NULL, NULL, NULL, '2026-06-01 13:29:27.085', '2026-06-01 13:29:30.062', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (11, 'test pengguna', 'pengguna@kembara.com', '$2b$10$UXC/8Sc4GMxndANpfZnDzeB7mPjdQa9wI8spivDvhRIMJDVBnM3/q', 'WISATAWAN', NULL, NULL, NULL, '2026-06-02 10:47:12.188', '2026-06-02 10:48:36.334', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (12, 'Syilva Maulidhina Riadi', 'CIPA@gmail.com', '$2b$10$KIKIro51dRdtt4xfRi45beW0ec3MYVC0gXXMOCitifthZr6Vt.hJq', 'PENGELOLA', NULL, NULL, NULL, '2026-06-05 22:37:46.806', '2026-06-05 22:37:52.367', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (19, 'kelola', 'danang@kembara.com', '$2b$10$t0gmt0LncjSYGQAc1npx..fLbutyM.hB0Ovod3AhOw15DLp/ga4du', 'PENGELOLA', NULL, NULL, NULL, '2026-06-17 14:58:40.643', '2026-06-17 14:59:21.703', NULL, '/uploads/verifikasi-pengelola/verifikasi-19-1781708336590.png', 'APPROVED');
INSERT INTO public."User" VALUES (13, 'Syilva Maulidhina Riadi', 'cipaa66@gmail.com', '$2b$10$9f.RvYAv4Xp/1PdtiZVUmOwDlboYboIzG1zV8b7qeR00Iw3157rPe', 'PENGELOLA', NULL, NULL, NULL, '2026-06-06 04:08:55.323', '2026-06-06 05:15:17.17', NULL, '/uploads/verifikasi-pengelola/verifikasi-13-1780718978353.jpg', 'APPROVED');
INSERT INTO public."User" VALUES (14, 'test ', 'test@gmail.com', '$2b$10$FFPCk06VTjNjMtWS3vja0eIfiI5HRpD7ZnPerzSm0vWJKqQJWtDOO', 'WISATAWAN', NULL, NULL, NULL, '2026-06-07 02:36:11.217', '2026-06-07 02:36:15.44', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (15, 'test wisatawan ', 'wisatawan@kembara.com', '$2b$10$5pPxUtVfSiMMKdVU52ZoRODBSIy8hG7oXIochwNDqieP/PxGxo89S', 'WISATAWAN', NULL, NULL, NULL, '2026-06-08 12:49:06.302', '2026-06-08 12:49:10.863', NULL, NULL, NULL);
INSERT INTO public."User" VALUES (16, 'Jaja Suharja', 'jaja@gmail.com', '$2b$10$I/hlTxBAEGrRWlMl5zMBfunmvke9NMhkj9Ll63ybnnAEHdBseyKa6', 'PENGELOLA', NULL, NULL, NULL, '2026-06-11 01:43:04.26', '2026-06-11 01:45:31.654', NULL, '/uploads/verifikasi-pengelola/verifikasi-16-1781142282718.png', 'APPROVED');
INSERT INTO public."User" VALUES (17, 'Cipa Riadi', 'cipaa@gmail.com', '$2b$10$NoLcVKXpcRMY0sYJjTO7N.Q8B9uCEOioP81G.cwUMf9JhX21OfIOm', 'WISATAWAN', NULL, NULL, NULL, '2026-06-11 01:50:24.467', '2026-06-11 01:50:27.611', NULL, NULL, NULL);


ALTER TABLE public."User" ENABLE TRIGGER ALL;

--
-- Data for Name: Destination; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Destination" DISABLE TRIGGER ALL;

INSERT INTO public."Destination" VALUES (2, 'Kawah Putih ', 'Kawah Putih adalah danau kawah vulkanik yang terletak di kaki Gunung Patuha, Ciwidey, Kabupaten Bandung Selatan, pada ketinggian sekitar 2.194 meter di atas permukaan laut. Danau ini terbentuk akibat letusan Gunung Patuha pada abad ke-10 dan memancarkan keindahan alam yang memukau dengan air danau berwarna putih kehijauan yang berubah-ubah tergantung kadar belerang dan cuaca.

Tempat ini sangat cocok untuk wisata alam, fotografi, dan menikmati kesegaran udara pegunungan. Suhu di kawasan Kawah Putih berkisar antara 8–22°C, sehingga pengunjung disarankan membawa jaket tebal. Karena kandungan gas belerang yang cukup tinggi, waktu kunjungan di area kawah sebaiknya tidak terlalu lama.', 'Kawah Putih, Brusel, Rancabali, Kabupaten Bandung, West Java, Indonesia', '089827272893', -7.1661181, 107.4022669, 'aktif', true, '2026-06-17 14:52:34.71', '2026-06-11 01:48:28.399', '2026-06-17 14:52:34.723', '/uploads/1781142508266-kawah.jpg', '17:00', 50000, '06:00', 15000, 3, NULL, 16);
INSERT INTO public."Destination" VALUES (3, 'Kawah Putih ', 'Kawah Putih merupakan salah satu destinasi wisata alam terkenal di Kabupaten Bandung yang terletak di kawasan Ciwidey. Tempat wisata ini menawarkan pemandangan kawah vulkanik dengan air berwarna putih kehijauan yang dapat berubah sesuai kondisi cuaca dan kandungan belerang. Dikelilingi oleh perbukitan dan pepohonan yang sejuk, Kawah Putih menjadi destinasi favorit wisatawan untuk menikmati keindahan alam serta berfoto.
', 'Kawah Putih, Brusel, Rancabali, Kabupaten Bandung, Jawa Barat, Indonesia', '089620283893', -7.1661181, 107.4022669, 'aktif', false, NULL, '2026-06-17 14:52:10.042', '2026-06-17 14:52:44.747', '/uploads/1781707929850-Kawah_Putih_Lake.jpg', '17:00', 50000, '05:00', 14998, 0, NULL, 13);
INSERT INTO public."Destination" VALUES (1, 'Kawah Putih ', 'Kawah Putih adalah danau vulkanik eksotis yang terbentuk dari letusan Gunung Patuha, terletak di Rancabali, Ciwidey, Kabupaten Bandung, Jawa Barat. Berada di ketinggian sekitar \(2.400\) meter di atas permukaan laut, tempat ini memiliki suhu yang sejuk berkisar antara 8 hingga 22 derajat Celcius', 'Dinas Penataan Ruang Kota Bandung, Jalan Cianjur, Kacapiring, Batununggal, Kota Bandung, Jawa Barat, Jawa, 40271, Indonesia', '080808080808', -6.9164365, 107.6333946, 'aktif', true, '2026-06-17 14:52:58.111', '2026-06-03 01:38:03.547', '2026-06-17 14:52:58.113', '/uploads/1780450683398-kawah-putih.jpg', '17:37', 40, '07:00', 15, 0, NULL, NULL);
INSERT INTO public."Destination" VALUES (4, 'Tahura Ir. H. Djuanda', 'Taman Hutan Raya (Tahura) Ir. H. Djuanda merupakan kawasan konservasi alam yang terletak di Bandung dan membentang hingga Kabupaten Bandung Barat. Destinasi wisata ini menawarkan berbagai objek wisata alam dan sejarah, seperti Goa Belanda, Goa Jepang, air terjun, serta jalur trekking yang dikelilingi hutan pinus dan vegetasi alami. Dengan udara yang sejuk dan lingkungan yang asri, Tahura menjadi salah satu tujuan wisata favorit untuk rekreasi, edukasi, dan kegiatan alam.
', 'Taman Hutan Raya Juanda, Kota Bandung, Kabupaten Bandung, Jawa Barat, 40198, Indonesia', '098765432123', -6.8411563, 107.6477749, 'aktif', false, NULL, '2026-06-17 15:04:16.719', '2026-06-18 10:08:02.381', '/uploads/1781708656600-Kawah_Putih_Lake.jpg', '16:00', 0, '08:00', 0, 11, NULL, 19);


ALTER TABLE public."Destination" ENABLE TRIGGER ALL;

--
-- Data for Name: AiAnalysis; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."AiAnalysis" DISABLE TRIGGER ALL;

INSERT INTO public."AiAnalysis" VALUES (1, 1, 100, 'konsisten', 'Nama dan deskripsi cukup selaras dengan kategori wisata yang dipilih.', '{"score": 100, "status": "konsisten", "message": "Nama dan deskripsi cukup selaras dengan kategori wisata yang dipilih.", "scoringDetail": {"formula": "score = (coverageScore * 0.5) + (dominanceScore * 0.3) + (strongestAlignmentScore * 0.2)", "coverageScore": 100, "dominanceScore": 100, "strongestAlignmentScore": 100}, "strongestCategory": {"categoryId": 1, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "matchedKeywords": ["gunung", "laut", "danau", "kawah"]}, "selectedCategories": [{"categoryId": 1, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "matchedKeywords": ["gunung", "laut", "danau", "kawah"]}], "allCategoryAnalysis": [{"categoryId": 1, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "matchedKeywords": ["gunung", "laut", "danau", "kawah"]}], "selectedWithMatches": [{"categoryId": 1, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "matchedKeywords": ["gunung", "laut", "danau", "kawah"]}], "selectedWithoutMatches": [], "unselectedStrongMatches": []}', '2026-06-03 01:38:03.604');
INSERT INTO public."AiAnalysis" VALUES (2, 2, 100, 'konsisten', 'Nama dan deskripsi cukup selaras dengan kategori wisata yang dipilih.', '{"score": 100, "status": "konsisten", "message": "Nama dan deskripsi cukup selaras dengan kategori wisata yang dipilih.", "scoringDetail": {"formula": "score = (coverageScore * 0.5) + (dominanceScore * 0.3) + (strongestAlignmentScore * 0.2)", "breakdown": {"nameAlignmentScore": 100, "nameDominanceScore": 100, "selectedWithAnyEvidence": 1, "totalSelectedCategories": 1, "descriptionAlignmentScore": 100, "descriptionDominanceScore": 100}, "fieldFormula": "Kategori dianggap tercakup jika memiliki bukti pada nama atau deskripsi. Nama dan deskripsi tetap digunakan setara pada dominance dan alignment.", "coverageScore": 100, "dominanceScore": 100, "strongestAlignmentScore": 100}, "strongestCategory": {"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah", "gunung", "laut", "danau"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 4, "descriptionMatchedKeywords": ["gunung", "laut", "danau", "kawah"]}, "selectedCategories": [{"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah", "gunung", "laut", "danau"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 4, "descriptionMatchedKeywords": ["gunung", "laut", "danau", "kawah"]}], "allCategoryAnalysis": [{"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah", "gunung", "laut", "danau"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 4, "descriptionMatchedKeywords": ["gunung", "laut", "danau", "kawah"]}], "selectedWithMatches": [{"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah", "gunung", "laut", "danau"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 4, "descriptionMatchedKeywords": ["gunung", "laut", "danau", "kawah"]}], "strongestNameCategory": {"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah", "gunung", "laut", "danau"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 4, "descriptionMatchedKeywords": ["gunung", "laut", "danau", "kawah"]}, "selectedWithoutMatches": [], "unselectedStrongMatches": [], "strongestDescriptionCategory": {"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah", "gunung", "laut", "danau"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 4, "descriptionMatchedKeywords": ["gunung", "laut", "danau", "kawah"]}}', '2026-06-11 01:48:28.444');
INSERT INTO public."AiAnalysis" VALUES (3, 3, 100, 'konsisten', 'Nama dan deskripsi cukup selaras dengan kategori wisata yang dipilih.', '{"score": 100, "status": "konsisten", "message": "Nama dan deskripsi cukup selaras dengan kategori wisata yang dipilih.", "scoringDetail": {"formula": "score = (coverageScore * 0.5) + (dominanceScore * 0.3) + (strongestAlignmentScore * 0.2)", "breakdown": {"nameAlignmentScore": 100, "nameDominanceScore": 100, "selectedWithAnyEvidence": 1, "totalSelectedCategories": 1, "descriptionAlignmentScore": 100, "descriptionDominanceScore": 100}, "fieldFormula": "Kategori dianggap tercakup jika memiliki bukti pada nama atau deskripsi. Nama dan deskripsi tetap digunakan setara pada dominance dan alignment.", "coverageScore": 100, "dominanceScore": 100, "strongestAlignmentScore": 100}, "strongestCategory": {"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 1, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 1, "descriptionMatchedKeywords": ["kawah"]}, "selectedCategories": [{"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 1, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 1, "descriptionMatchedKeywords": ["kawah"]}], "allCategoryAnalysis": [{"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 1, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 1, "descriptionMatchedKeywords": ["kawah"]}], "selectedWithMatches": [{"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 1, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 1, "descriptionMatchedKeywords": ["kawah"]}], "strongestNameCategory": {"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 1, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 1, "descriptionMatchedKeywords": ["kawah"]}, "selectedWithoutMatches": [], "unselectedStrongMatches": [], "strongestDescriptionCategory": {"categoryId": 1, "fieldScore": 100, "isSelected": true, "matchCount": 1, "categoryName": "Wisata Alam", "nameMatchCount": 1, "matchedKeywords": ["kawah"], "nameMatchedKeywords": ["kawah"], "descriptionMatchCount": 1, "descriptionMatchedKeywords": ["kawah"]}}', '2026-06-17 14:52:10.094');
INSERT INTO public."AiAnalysis" VALUES (4, 4, 75, 'konsisten', 'Nama dan deskripsi cukup selaras dengan kategori wisata yang dipilih.', '{"score": 75, "status": "konsisten", "message": "Nama dan deskripsi cukup selaras dengan kategori wisata yang dipilih.", "scoringDetail": {"formula": "score = (coverageScore * 0.5) + (dominanceScore * 0.3) + (strongestAlignmentScore * 0.2)", "breakdown": {"nameAlignmentScore": 0, "nameDominanceScore": 0, "selectedWithAnyEvidence": 1, "totalSelectedCategories": 1, "descriptionAlignmentScore": 100, "descriptionDominanceScore": 100}, "fieldFormula": "Kategori dianggap tercakup jika memiliki bukti pada nama atau deskripsi. Nama dan deskripsi tetap digunakan setara pada dominance dan alignment.", "coverageScore": 100, "dominanceScore": 50, "strongestAlignmentScore": 50}, "strongestCategory": {"categoryId": 1, "fieldScore": 50, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "nameMatchCount": 0, "matchedKeywords": ["air terjun", "hutan", "hutan pinus", "trekking"], "nameMatchedKeywords": [], "descriptionMatchCount": 4, "descriptionMatchedKeywords": ["air terjun", "hutan", "hutan pinus", "trekking"]}, "selectedCategories": [{"categoryId": 1, "fieldScore": 50, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "nameMatchCount": 0, "matchedKeywords": ["air terjun", "hutan", "hutan pinus", "trekking"], "nameMatchedKeywords": [], "descriptionMatchCount": 4, "descriptionMatchedKeywords": ["air terjun", "hutan", "hutan pinus", "trekking"]}], "allCategoryAnalysis": [{"categoryId": 1, "fieldScore": 50, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "nameMatchCount": 0, "matchedKeywords": ["air terjun", "hutan", "hutan pinus", "trekking"], "nameMatchedKeywords": [], "descriptionMatchCount": 4, "descriptionMatchedKeywords": ["air terjun", "hutan", "hutan pinus", "trekking"]}], "selectedWithMatches": [{"categoryId": 1, "fieldScore": 50, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "nameMatchCount": 0, "matchedKeywords": ["air terjun", "hutan", "hutan pinus", "trekking"], "nameMatchedKeywords": [], "descriptionMatchCount": 4, "descriptionMatchedKeywords": ["air terjun", "hutan", "hutan pinus", "trekking"]}], "strongestNameCategory": null, "selectedWithoutMatches": [], "unselectedStrongMatches": [], "strongestDescriptionCategory": {"categoryId": 1, "fieldScore": 50, "isSelected": true, "matchCount": 4, "categoryName": "Wisata Alam", "nameMatchCount": 0, "matchedKeywords": ["air terjun", "hutan", "hutan pinus", "trekking"], "nameMatchedKeywords": [], "descriptionMatchCount": 4, "descriptionMatchedKeywords": ["air terjun", "hutan", "hutan pinus", "trekking"]}}', '2026-06-17 15:04:16.767');


ALTER TABLE public."AiAnalysis" ENABLE TRIGGER ALL;

--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Category" DISABLE TRIGGER ALL;

INSERT INTO public."Category" VALUES (1, 'Wisata Alam', '2026-06-01 04:43:24.006');


ALTER TABLE public."Category" ENABLE TRIGGER ALL;

--
-- Data for Name: CategoryKeyword; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."CategoryKeyword" DISABLE TRIGGER ALL;

INSERT INTO public."CategoryKeyword" VALUES (1, 'gunung', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (2, 'bukit', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (3, 'pantai', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (4, 'pulau', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (5, 'laut', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (6, 'danau', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (7, 'sungai', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (8, 'air terjun', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (9, 'hutan', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (10, 'gua', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (11, 'kawah', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (12, 'savana', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (13, 'lembah', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (14, 'tebing', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (15, 'mangrove', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (16, 'taman nasional', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (17, 'cagar alam', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (18, 'mata air', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (19, 'pemandian air panas', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (20, 'hutan pinus', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (21, 'perkebunan teh', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (22, 'padang rumput', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (23, 'camping', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (24, 'glamping', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (25, 'hiking', 1, '2026-06-01 04:43:24.006');
INSERT INTO public."CategoryKeyword" VALUES (26, 'trekking', 1, '2026-06-01 04:43:24.006');


ALTER TABLE public."CategoryKeyword" ENABLE TRIGGER ALL;

--
-- Data for Name: DestinationCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."DestinationCategory" DISABLE TRIGGER ALL;

INSERT INTO public."DestinationCategory" VALUES (1, 1, 1);
INSERT INTO public."DestinationCategory" VALUES (2, 2, 1);
INSERT INTO public."DestinationCategory" VALUES (3, 3, 1);
INSERT INTO public."DestinationCategory" VALUES (4, 4, 1);


ALTER TABLE public."DestinationCategory" ENABLE TRIGGER ALL;

--
-- Data for Name: DestinationView; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."DestinationView" DISABLE TRIGGER ALL;



ALTER TABLE public."DestinationView" ENABLE TRIGGER ALL;

--
-- Data for Name: Itinerary; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Itinerary" DISABLE TRIGGER ALL;



ALTER TABLE public."Itinerary" ENABLE TRIGGER ALL;

--
-- Data for Name: ItineraryItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ItineraryItem" DISABLE TRIGGER ALL;



ALTER TABLE public."ItineraryItem" ENABLE TRIGGER ALL;

--
-- Data for Name: ItineraryQueue; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ItineraryQueue" DISABLE TRIGGER ALL;



ALTER TABLE public."ItineraryQueue" ENABLE TRIGGER ALL;

--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Review" DISABLE TRIGGER ALL;



ALTER TABLE public."Review" ENABLE TRIGGER ALL;

--
-- Data for Name: SavedDestination; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."SavedDestination" DISABLE TRIGGER ALL;

INSERT INTO public."SavedDestination" VALUES (1, 17, 2, '2026-06-11 01:50:51.439');


ALTER TABLE public."SavedDestination" ENABLE TRIGGER ALL;

--
-- Data for Name: VisitedPlace; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."VisitedPlace" DISABLE TRIGGER ALL;



ALTER TABLE public."VisitedPlace" ENABLE TRIGGER ALL;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public._prisma_migrations DISABLE TRIGGER ALL;

INSERT INTO public._prisma_migrations VALUES ('e0b0669a-7198-48dc-82ff-f9bc49c92f4a', '81c663370735fc5b8ee074a28564546fdb04e224423e912bb70c61b2d991ecfb', '2026-04-22 22:20:01.416021+07', '20260420122739_init', NULL, NULL, '2026-04-22 22:20:01.400367+07', 1);
INSERT INTO public._prisma_migrations VALUES ('ae64de33-0a96-4ca4-8eeb-d6c199a7c68d', '1d008fb18b02809618842029916967eae46e758456cf083fc7a5dc685ee2153c', '2026-04-22 22:20:01.41904+07', '20260420190642_make_role_nullable', NULL, NULL, '2026-04-22 22:20:01.416617+07', 1);
INSERT INTO public._prisma_migrations VALUES ('155c7845-0015-4e48-b7dc-e70599fc9472', '0f8626b67d74a23af0f167e17bb0f0f3699a07437a98efbcf8418cb88209ed21', '2026-06-01 10:36:40.675137+07', '20260501001021_init_destination_database', NULL, NULL, '2026-06-01 10:36:40.636378+07', 1);
INSERT INTO public._prisma_migrations VALUES ('c6f3c399-96d4-48ac-9b76-9acae690ac61', 'c2021335d066fcfa899b9856e2616594b0184412e63ac7adb5dcde507ac956a2', '2026-06-01 10:36:40.677444+07', '20260502132427_add_image_url', NULL, NULL, '2026-06-01 10:36:40.675623+07', 1);
INSERT INTO public._prisma_migrations VALUES ('46652008-238b-4e5c-8c44-c2acc8019443', '385a2d6f0db908b66916b05c5e47237115d013b61873a7e2aef5ab9901f67830', '2026-06-01 10:37:58.644151+07', '20260601033758_integration_update', NULL, NULL, '2026-06-01 10:37:58.550706+07', 1);
INSERT INTO public._prisma_migrations VALUES ('3d8fe343-7ac1-49b3-bf8c-c6386e266289', '03f6d690000a7002de5ca36a9c3a11eedc03a1a258c6f7476ace096da04f2961', '2026-06-06 11:08:17.630365+07', '20260606040817_add_verification_fields', NULL, NULL, '2026-06-06 11:08:17.602043+07', 1);


ALTER TABLE public._prisma_migrations ENABLE TRIGGER ALL;

--
-- Name: AiAnalysis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AiAnalysis_id_seq"', 4, true);


--
-- Name: CategoryKeyword_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CategoryKeyword_id_seq"', 26, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 1, true);


--
-- Name: DestinationCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DestinationCategory_id_seq"', 4, true);


--
-- Name: DestinationView_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DestinationView_id_seq"', 1, false);


--
-- Name: Destination_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Destination_id_seq"', 4, true);


--
-- Name: ItineraryItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ItineraryItem_id_seq"', 1, false);


--
-- Name: ItineraryQueue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ItineraryQueue_id_seq"', 1, false);


--
-- Name: Itinerary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Itinerary_id_seq"', 1, false);


--
-- Name: Review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Review_id_seq"', 1, false);


--
-- Name: SavedDestination_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SavedDestination_id_seq"', 1, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 19, true);


--
-- Name: VisitedPlace_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VisitedPlace_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict R57dJXeb8G2PdcaAJzhajPukcApFDZEBsYyd4qPZKWFOrAXl4Mfizctt8ypgiVa

