"use client";
// app/pengunjung/ulasan/page.tsx
// Halaman Ulasan – rating & review tempat yang pernah dikunjungi

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Camera, Loader2, CheckCircle2, MapPin, Send } from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { getImageUrl } from "@/lib/utils";

interface VisitedPlace {
  id: number;
  checkedIn: boolean;
  visitedAt: string;
  destination: {
    id: number;
    name: string;
    address: string;
    imageUrl: string | null;
    categories: { category: { name: string } }[];
  };
}

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  photoUrl: string | null;
  helpfulCount: number;
  createdAt: string;
  destination: {
    id: number;
    name: string;
    imageUrl: string | null;
    address: string;
  };
}

export default function UlasanPage() {
  const { user, loading: userLoading } = useLocalUser();
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedDest, setSelectedDest] = useState<VisitedPlace["destination"] | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/pengunjung/reviews?userId=${user.id}`);
      const json = await res.json();
      if (json.success) {
        setVisitedPlaces(json.data.visitedPlaces);
        setReviews(json.data.reviews);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    if (!userLoading && user) fetchData();
    else if (!userLoading && !user) setLoading(false);
  }, [user, userLoading, fetchData]);

  const handleSubmitReview = async () => {
    if (!user || !selectedDest || rating === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/pengunjung/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          destinationId: selectedDest.id,
          rating,
          comment: comment.trim() || null,
          photoUrl: photoUrl.trim() || null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        setSelectedDest(null);
        setRating(0);
        setComment("");
        setPhotoUrl("");
        await fetchData();
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  // Not logged in
  if (!userLoading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
          <Star size={28} className="text-yellow-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Bagikan Pengalamanmu</h2>
        <p className="text-gray-500 text-sm mb-6">Masuk untuk menulis ulasan dan melihat riwayat perjalananmu.</p>
        <Link href="/auth/login?redirect=/pengunjung/ulasan"
          className="inline-flex px-6 py-3 bg-[#1a6b3c] text-white rounded-xl font-semibold text-sm hover:bg-[#155c33] transition-colors">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  const reviewedIds = new Set(reviews.map((r) => r.destination.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/pengunjung" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div>
          <nav className="text-sm text-gray-500 mb-0.5">
            <Link href="/pengunjung" className="hover:text-[#1a6b3c]">Beranda</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Ulasan</span>
          </nav>
        </div>
      </div>

      {/* Success toast */}
      {submitted && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-in slide-in-from-right-5">
          <CheckCircle2 size={18} />
          Ulasan berhasil dikirim!
        </div>
      )}

      {/* SECTION 1: Tempat yang pernah dikunjungi */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Tempat yang Pernah Dikunjungi</h2>
          {visitedPlaces.length > 0 && (
            <span className="px-3 py-1 bg-[#f97316]/10 text-[#f97316] text-xs font-bold rounded-full">
              {visitedPlaces.filter(v => !reviewedIds.has(v.destination.id)).length} Baru
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : visitedPlaces.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
            <CheckCircle2 size={40} className="mx-auto mb-3 opacity-20" />
            <p>Belum ada tempat yang dikunjungi</p>
            <p className="text-xs mt-1">Mulai perjalanan dan check-in di destinasi untuk muncul di sini</p>
            <Link href="/pengunjung/rencana" className="mt-4 inline-flex items-center gap-2 text-sm text-[#1a6b3c] font-medium hover:underline">
              Buat Rencana Perjalanan →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visitedPlaces.map((visited) => {
              const alreadyReviewed = reviewedIds.has(visited.destination.id);
              return (
                <div key={visited.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={getImageUrl(visited.destination.imageUrl, visited.destination.name)}
                      alt={visited.destination.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(visited.destination.name)}&size=400&background=1a6b3c&color=fff`;
                      }}
                    />
                    {alreadyReviewed && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{visited.destination.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin size={11} />
                      {visited.destination.address}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedDest(visited.destination);
                        // Scroll to form
                        setTimeout(() => {
                          document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                      className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                        alreadyReviewed
                          ? "bg-gray-50 text-gray-400 border border-gray-100"
                          : "bg-[#f97316] text-white hover:bg-[#ea6a0a]"
                      }`}
                    >
                      {alreadyReviewed ? "✓ Sudah Diulas" : "Berikan Ulasan"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 2: Form ulasan baru */}
      <section id="review-form" className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#1a3a2a] to-[#1a6b3c] px-6 py-4">
            <h2 className="text-white font-bold text-lg">Tulis Ulasan Baru</h2>
            {selectedDest && (
              <p className="text-white/70 text-sm mt-0.5">untuk: {selectedDest.name}</p>
            )}
          </div>
          <div className="p-6">
            {/* Destination selector */}
            {!selectedDest ? (
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Pilih Destinasi</label>
                <select
                  onChange={(e) => {
                    const dest = visitedPlaces.find(v => String(v.destination.id) === e.target.value);
                    if (dest) setSelectedDest(dest.destination);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20"
                  defaultValue=""
                >
                  <option value="" disabled>Pilih tempat yang sudah dikunjungi...</option>
                  {visitedPlaces.map((v) => (
                    <option key={v.id} value={v.destination.id}>{v.destination.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
                <img
                  src={getImageUrl(selectedDest.imageUrl, selectedDest.name)}
                  alt={selectedDest.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{selectedDest.name}</p>
                  <p className="text-gray-400 text-xs">{selectedDest.address}</p>
                </div>
                <button onClick={() => setSelectedDest(null)} className="ml-auto text-gray-400 hover:text-gray-600 text-xs">Ganti</button>
              </div>
            )}

            {/* Rating stars */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 block mb-2">Berikan Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-500 self-center">
                    {["", "Sangat Buruk", "Buruk", "Cukup", "Bagus", "Luar Biasa!"][rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 block mb-2">Ceritakan Pengalamanmu</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bagaimana perjalanan Anda? Ceritakan pengalaman, tips, atau hal yang berkesan..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c]"
              />
            </div>

            {/* Photo URL */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 block mb-2">Tambah Foto (URL)</label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4">
                  <Camera size={16} className="text-gray-400 shrink-0" />
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://... (URL foto kamu)"
                    className="flex-1 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>
              {photoUrl && (
                <img src={photoUrl} alt="preview" className="mt-2 h-32 rounded-xl object-cover" onError={() => setPhotoUrl("")} />
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmitReview}
                disabled={!selectedDest || rating === 0 || submitting}
                className="flex items-center gap-2 px-8 py-3 bg-[#1a6b3c] text-white rounded-xl font-bold text-sm hover:bg-[#155c33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Mengirim...</>
                ) : (
                  <><Send size={16} /> Kirim Ulasan</>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Ulasan saya */}
      {reviews.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ulasan Saya</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex gap-4 p-5">
                  <img
                    src={getImageUrl(review.destination.imageUrl, review.destination.name)}
                    alt={review.destination.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.destination.name)}&size=160&background=1a6b3c&color=fff`;
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/pengunjung/destinasi/${review.destination.id}`}>
                        <h3 className="font-bold text-gray-900 hover:text-[#1a6b3c] transition-colors">
                          {review.destination.name}
                        </h3>
                      </Link>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(review.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </span>
                    </div>
                    <div className="flex gap-0.5 my-1.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    )}
                    {review.photoUrl && (
                      <img src={review.photoUrl} alt="review photo" className="mt-3 h-28 rounded-xl object-cover" />
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span>👍 {review.helpfulCount} membantu</span>
                      <button
                        onClick={() => setSelectedDest(review.destination as any)}
                        className="text-[#1a6b3c] font-medium hover:underline"
                      >
                        Edit Ulasan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
