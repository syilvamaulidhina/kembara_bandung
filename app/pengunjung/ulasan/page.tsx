"use client";
// app/pengunjung/ulasan/page.tsx — UPDATED: upload foto & video file

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Star, Camera, Video, Loader2, CheckCircle2,
  MapPin, Send, X, Upload, Play
} from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { getImageUrl } from "@/lib/utils";

interface VisitedPlace {
  id: number;
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
  videoUrl?: string | null;
  helpfulCount: number;
  createdAt: string;
  destination: { id: number; name: string; imageUrl: string | null; address: string };
}

interface UploadedMedia {
  url: string;
  type: "image" | "video";
  name: string;
  previewUrl?: string;
}

export default function UlasanPage() {
  const { user, loading: userLoading } = useLocalUser();
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState<VisitedPlace["destination"] | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [medias, setMedias] = useState<UploadedMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  // Upload file ke server
  const handleFileUpload = async (file: File, type: "image" | "video") => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const json = await res.json();

      if (json.success) {
        const previewUrl = type === "image" ? URL.createObjectURL(file) : undefined;
        setMedias(prev => [...prev, { url: json.url, type, name: file.name, previewUrl }]);
      } else {
        alert(json.error || "Gagal mengupload file");
      }
    } catch (e) {
      alert("Gagal mengupload file, coba lagi");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files.slice(0, 3 - medias.filter(m => m.type === "image").length)) {
      await handleFileUpload(file, "image");
    }
    e.target.value = "";
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFileUpload(file, "video");
    e.target.value = "";
  };

  const removeMedia = (idx: number) => {
    setMedias(prev => {
      const m = prev[idx];
      if (m.previewUrl) URL.revokeObjectURL(m.previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async () => {
    if (!user || !selectedDest || rating === 0) return;
    setSubmitting(true);
    try {
      const photoUrl = medias.find(m => m.type === "image")?.url || null;
      const videoUrl = medias.find(m => m.type === "video")?.url || null;
      const res = await fetch("/api/pengunjung/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          destinationId: selectedDest.id,
          rating,
          comment: comment.trim() || null,
          photoUrl,
          videoUrl,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        setSelectedDest(null);
        setRating(0);
        setComment("");
        setMedias([]);
        await fetchData();
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const reviewedIds = new Set(reviews.map(r => r.destination.id));

  if (!userLoading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Star size={40} className="mx-auto mb-4 text-yellow-400 opacity-50" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Bagikan Pengalamanmu</h2>
        <p className="text-gray-500 text-sm mb-6">Masuk untuk menulis ulasan perjalananmu.</p>
        <Link href="/auth/login?redirect=/pengunjung/ulasan"
          className="inline-flex px-6 py-3 bg-[#006837] text-white rounded-xl font-semibold text-sm hover:bg-[#005229] transition-colors">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/pengunjung" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <nav className="text-sm text-gray-500">
          <Link href="/pengunjung" className="hover:text-[#006837]">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Ulasan</span>
        </nav>
      </div>

      {/* Toast */}
      {submitted && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-in slide-in-from-right-5">
          <CheckCircle2 size={18} />
          Ulasan berhasil dikirim!
        </div>
      )}

      {/* VISITED PLACES */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Tempat yang Pernah Dikunjungi</h2>
          {visitedPlaces.length > 0 && (
            <span className="px-3 py-1 bg-[#f97316]/10 text-[#f97316] text-xs font-bold rounded-full">
              {visitedPlaces.filter(v => !reviewedIds.has(v.destination.id)).length} Belum Diulas
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />)}
          </div>
        ) : visitedPlaces.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
            <CheckCircle2 size={40} className="mx-auto mb-3 opacity-20" />
            <p>Belum ada tempat yang dikunjungi</p>
            <Link href="/pengunjung/rencana" className="mt-3 inline-flex text-sm text-[#006837] font-medium hover:underline">
              Mulai Perjalanan →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visitedPlaces.map(visited => {
              const reviewed = reviewedIds.has(visited.destination.id);
              return (
                <div key={visited.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={getImageUrl(visited.destination.imageUrl, visited.destination.name)}
                      alt={visited.destination.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(visited.destination.name)}&size=400&background=006837&color=fff`; }}
                    />
                    {reviewed && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{visited.destination.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 line-clamp-1">
                      <MapPin size={10} />{visited.destination.address}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedDest(visited.destination);
                        document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                        reviewed
                          ? "bg-gray-50 text-gray-400 border border-gray-100"
                          : "bg-[#f97316] text-white hover:bg-[#ea6a0a]"
                      }`}
                    >
                      {reviewed ? "✓ Sudah Diulas" : "Berikan Ulasan"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* REVIEW FORM */}
      <section id="review-form" className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#1a3a2a] to-[#006837] px-6 py-4">
            <h2 className="text-white font-bold text-lg">Tulis Ulasan Baru</h2>
            {selectedDest && <p className="text-white/70 text-sm mt-0.5">untuk: {selectedDest.name}</p>}
          </div>

          <div className="p-6">
            {/* Destination select */}
            {!selectedDest ? (
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Pilih Destinasi</label>
                <select
                  onChange={(e) => {
                    const dest = visitedPlaces.find(v => String(v.destination.id) === e.target.value);
                    if (dest) setSelectedDest(dest.destination);
                  }}
                  defaultValue=""
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]/20"
                >
                  <option value="" disabled>Pilih tempat yang sudah dikunjungi...</option>
                  {visitedPlaces.map(v => (
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
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{selectedDest.name}</p>
                  <p className="text-gray-400 text-xs">{selectedDest.address}</p>
                </div>
                <button onClick={() => setSelectedDest(null)} className="text-gray-400 hover:text-gray-600 text-xs">Ganti</button>
              </div>
            )}

            {/* Stars */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 block mb-2">Berikan Rating</label>
              <div className="flex gap-2 items-center">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star size={32} className={`transition-colors ${
                      star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    }`} />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-500 font-medium">
                    {["","Sangat Buruk","Buruk","Cukup","Bagus","Luar Biasa! 🎉"][rating]}
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
                placeholder="Bagaimana perjalanan Anda? Ceritakan pengalaman, tips, atau hal berkesan..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
            </div>

            {/* Media Upload */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 block mb-3">Tambah Foto & Video</label>

              {/* Preview grid */}
              {medias.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {medias.map((media, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                      {media.type === "image" ? (
                        <img
                          src={media.previewUrl || media.url}
                          alt={media.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 gap-1">
                          <Play size={24} className="text-white" />
                          <span className="text-white text-xs text-center px-1 line-clamp-2">{media.name}</span>
                        </div>
                      )}
                      <button
                        onClick={() => removeMedia(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute bottom-1.5 left-1.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          media.type === "image" ? "bg-blue-500 text-white" : "bg-purple-500 text-white"
                        }`}>
                          {media.type === "image" ? "📷" : "🎥"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Photo upload */}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploading || medias.filter(m => m.type === "image").length >= 3}
                  className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#006837] hover:bg-[#006837]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <Loader2 size={22} className="text-gray-400 animate-spin" />
                  ) : (
                    <Camera size={22} className="text-gray-400" />
                  )}
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-600">Tambah Foto</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP · Max 50MB</p>
                    <p className="text-xs text-gray-300">{medias.filter(m=>m.type==="image").length}/3</p>
                  </div>
                </button>

                {/* Video upload */}
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={uploading || medias.filter(m => m.type === "video").length >= 1}
                  className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <Loader2 size={22} className="text-gray-400 animate-spin" />
                  ) : (
                    <Video size={22} className="text-gray-400" />
                  )}
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-600">Tambah Video</p>
                    <p className="text-xs text-gray-400">MP4, WebM · Max 50MB</p>
                    <p className="text-xs text-gray-300">{medias.filter(m=>m.type==="video").length}/1</p>
                  </div>
                </button>
              </div>

              {/* Hidden inputs */}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handlePhotoChange}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={handleVideoChange}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!selectedDest || rating === 0 || submitting}
                className="flex items-center gap-2 px-8 py-3 bg-[#006837] text-white rounded-xl font-bold text-sm hover:bg-[#005229] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <><Loader2 size={16} className="animate-spin" /> Mengirim...</>
                  : <><Send size={16} /> Kirim Ulasan</>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MY REVIEWS */}
      {reviews.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ulasan Saya</h2>
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex gap-4 p-5">
                  <img
                    src={getImageUrl(review.destination.imageUrl, review.destination.name)}
                    alt={review.destination.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.destination.name)}&size=160&background=006837&color=fff`; }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/pengunjung/destinasi/${review.destination.id}`}>
                        <h3 className="font-bold text-gray-900 hover:text-[#006837] transition-colors">{review.destination.name}</h3>
                      </Link>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(review.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex gap-0.5 my-1.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={13} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                    {review.comment && <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>}
                    {review.photoUrl && (
                      <img src={review.photoUrl} alt="review" className="mt-3 h-28 rounded-xl object-cover" />
                    )}
                    {review.videoUrl && (
                      <video src={review.videoUrl} controls className="mt-3 h-28 rounded-xl object-cover" />
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span>👍 {review.helpfulCount} membantu</span>
                      <button onClick={() => setSelectedDest(review.destination as any)}
                        className="text-[#006837] font-medium hover:underline">Edit Ulasan</button>
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
