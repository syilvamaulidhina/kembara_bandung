"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Plus,
  Save,
  Search,
  Tags,
  Trash2,
  X,
} from "lucide-react";

type Keyword = {
  id: number;
  keyword: string;
  categoryId: number;
  createdAt: string;
};

type Category = {
  id: number;
  name: string;
  createdAt: string;
  keywords: Keyword[];
};

export default function KelolaKategoriPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const [newKeywordByCategory, setNewKeywordByCategory] = useState<
    Record<number, string>
  >({});

  const [editingKeywordId, setEditingKeywordId] = useState<number | null>(null);
  const [editingKeywordValue, setEditingKeywordValue] = useState("");

  const filteredCategories = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return categories;

    return categories.filter((category) => {
      const matchCategory = category.name.toLowerCase().includes(keyword);
      const matchKeyword = category.keywords.some((item) =>
        item.keyword.toLowerCase().includes(keyword)
      );

      return matchCategory || matchKeyword;
    });
  }, [categories, search]);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/categories");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data kategori.");
      }

      setCategories(data);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil kategori."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function showSuccess(message: string) {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 2500);
  }

  function startEditCategory(category: Category) {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  }

  function cancelEditCategory() {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  }

  async function updateCategory(categoryId: number) {
    if (!editingCategoryName.trim()) {
      setError("Nama kategori wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingCategoryName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah kategori.");
      }

      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? { ...category, name: data.name }
            : category
        )
      );

      cancelEditCategory();
      showSuccess("Kategori berhasil diperbarui.");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengubah kategori."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(category: Category) {
    const confirmed = window.confirm(
      `Hapus kategori "${category.name}"?\n\nKategori yang sudah digunakan oleh destinasi tidak dapat dihapus.`
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus kategori.");
      }

      setCategories((prev) =>
        prev.filter((item) => item.id !== category.id)
      );

      showSuccess("Kategori berhasil dihapus.");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus kategori."
      );
    } finally {
      setSaving(false);
    }
  }

  async function addKeyword(categoryId: number) {
    const value = newKeywordByCategory[categoryId]?.trim().toLowerCase();

    if (!value) {
      setError("Keyword wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/admin/categories/${categoryId}/keywords`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keyword: value,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menambahkan keyword.");
      }

      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                keywords: [data, ...category.keywords],
              }
            : category
        )
      );

      setNewKeywordByCategory((prev) => ({
        ...prev,
        [categoryId]: "",
      }));

      showSuccess("Keyword berhasil ditambahkan.");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menambahkan keyword."
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditKeyword(keyword: Keyword) {
    setEditingKeywordId(keyword.id);
    setEditingKeywordValue(keyword.keyword);
  }

  function cancelEditKeyword() {
    setEditingKeywordId(null);
    setEditingKeywordValue("");
  }

  async function updateKeyword(categoryId: number, keywordId: number) {
    const value = editingKeywordValue.trim().toLowerCase();

    if (!value) {
      setError("Keyword wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/admin/categories/${categoryId}/keywords/${keywordId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keyword: value,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah keyword.");
      }

      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                keywords: category.keywords.map((keyword) =>
                  keyword.id === keywordId
                    ? { ...keyword, keyword: data.keyword }
                    : keyword
                ),
              }
            : category
        )
      );

      cancelEditKeyword();
      showSuccess("Keyword berhasil diperbarui.");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengubah keyword."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteKeyword(categoryId: number, keyword: Keyword) {
    const confirmed = window.confirm(
      `Hapus keyword "${keyword.keyword}"?\n\nSetiap kategori minimal harus memiliki 10 keyword.`
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/admin/categories/${categoryId}/keywords/${keyword.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus keyword.");
      }

      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                keywords: category.keywords.filter(
                  (item) => item.id !== keyword.id
                ),
              }
            : category
        )
      );

      showSuccess("Keyword berhasil dihapus.");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus keyword."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <Tags size={22} className="text-blue-600" />
            Kelola Kategori
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola kategori dan keyword untuk sistem AI semantic checker.
          </p>
        </div>

        <a
          href="/admin/kategori/tambah"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={16} />
          Tambah Kategori
        </a>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          {success}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-gray-800">Daftar Kategori</h2>
              <p className="mt-1 text-sm text-gray-500">
                Total {categories.length} kategori.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari kategori atau keyword..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
                />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center">
              <p className="font-semibold text-gray-700">
                Tidak ada kategori ditemukan.
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Coba ubah kata kunci pencarian atau tambahkan kategori baru.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-gray-100 p-4 transition hover:shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {editingCategoryId === category.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(event) =>
                              setEditingCategoryName(event.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => updateCategory(category.id)}
                            className="rounded-xl bg-green-600 px-3 text-white disabled:opacity-50"
                            title="Simpan"
                          >
                            <Save size={16} />
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={cancelEditCategory}
                            className="rounded-xl bg-gray-100 px-3 text-gray-600 disabled:opacity-50"
                            title="Batal"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="truncate font-bold text-gray-800">
                            {category.name}
                          </h3>
                          <p className="mt-1 text-xs text-gray-400">
                            {category.keywords.length} keyword
                          </p>
                        </>
                      )}
                    </div>

                    {editingCategoryId !== category.id && (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => startEditCategory(category)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                          title="Edit kategori"
                        >
                          <Edit size={15} />
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => deleteCategory(category)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                          title="Hapus kategori"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Tambah keyword..."
                      value={newKeywordByCategory[category.id] || ""}
                      onChange={(event) =>
                        setNewKeywordByCategory((prev) => ({
                          ...prev,
                          [category.id]: event.target.value,
                        }))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addKeyword(category.id);
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => addKeyword(category.id)}
                      className="rounded-xl bg-blue-600 px-3 text-white hover:bg-blue-700 disabled:opacity-50"
                      title="Tambah keyword"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
                    {category.keywords.length === 0 ? (
                      <span className="text-xs text-gray-400">
                        Belum ada keyword
                      </span>
                    ) : (
                      category.keywords.map((keyword) => (
                        <div
                          key={keyword.id}
                          className="flex items-center justify-between gap-2 rounded-xl bg-blue-50 px-3 py-2"
                        >
                          {editingKeywordId === keyword.id ? (
                            <>
                              <input
                                type="text"
                                value={editingKeywordValue}
                                onChange={(event) =>
                                  setEditingKeywordValue(event.target.value)
                                }
                                className="min-w-0 flex-1 rounded-lg border border-blue-100 px-2 py-1 text-xs focus:outline-none"
                              />

                              <button
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                  updateKeyword(category.id, keyword.id)
                                }
                                className="text-green-600 disabled:opacity-50"
                                title="Simpan keyword"
                              >
                                <Save size={14} />
                              </button>

                              <button
                                type="button"
                                disabled={saving}
                                onClick={cancelEditKeyword}
                                className="text-gray-500 disabled:opacity-50"
                                title="Batal"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="min-w-0 flex-1 truncate text-xs font-medium text-blue-700">
                                {keyword.keyword}
                              </span>

                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => startEditKeyword(keyword)}
                                className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                                title="Edit keyword"
                              >
                                <Edit size={13} />
                              </button>

                              <button
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                  deleteKeyword(category.id, keyword)
                                }
                                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                title="Hapus keyword"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}