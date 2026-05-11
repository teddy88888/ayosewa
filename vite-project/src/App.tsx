import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import {
  Search,
  Package,
  ShieldCheck,
  Clock,
  BookOpen,
  ChevronRight,
  Loader2,
} from "lucide-react";
import heroVideo from "./assets/kebebasan-berinovasi.mp4";

// Interface untuk TypeScript agar data memiliki tipe yang jelas
interface Item {
  id: string;
  title: string;
  description?: string | null;
  price_daily: number;
  deposit_amount: number;
  image_url: string;
  category: string;
  is_available: boolean;
  created_at?: string | null;
}

import "./App.css";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? items.filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(normalizedQuery);
        const categoryMatch = item.category
          ?.toLowerCase()
          .includes(normalizedQuery);
        return titleMatch || categoryMatch;
      })
    : items;

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    price_daily: 0,
    deposit_amount: 0,
    category: "Buku",
    image_url: "",
  });

  // Jalankan fungsi fetch data saat pertama kali aplikasi dibuka
  useEffect(() => {
    fetchItems();
  }, []);
  async function addItem(e: React.FormEvent) {
    e.preventDefault();

    // Supaya sesuai dengan schema tabel `items`
    // (description, is_available, owner_id tidak ada di form, jadi beri default)
    const payload = {
      title: newItem.title,
      description: newItem.description || null,
      price_daily: newItem.price_daily,
      deposit_amount: newItem.deposit_amount,
      image_url: newItem.image_url,
      category: newItem.category,
      is_available: true,
    };

    const { data, error } = await supabase
      .from("items")
      .insert([payload])
      .select("id");

    if (error) {
      console.error("Insert error:", error);
      alert(error.message);
      return;
    }

    console.log("Inserted:", data);
    setIsModalOpen(false);
    setNewItem({
      title: "",
      description: "",
      price_daily: 0,
      deposit_amount: 0,
      category: "Buku",
      image_url: "",
    });

    fetchItems(); // Refresh list otomatis
  }

  async function fetchItems() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select(
          "id,title,description,price_daily,deposit_amount,image_url,category,is_available,created_at",
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching data:", message);
      alert("Gagal mengambil data. Lihat console untuk detail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BookOpen className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
              AyoSewa
            </h1>
          </div>
          <div className="hidden md:flex gap-8 font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition">
              Beranda
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              Katalog
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              Cara Kerja
            </a>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
            Masuk
          </button>
          {/* Ganti tombol Masuk atau tambah di sampingnya */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
          >
            Tambah Barang
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-bg max-w-7xl mx-auto px-4 py-20 min-h-[520px] text-center flex flex-col">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          controls={false}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        <h2 className="text-5xl md:text-6xl text-purple-900 font-extrabold mt-0 leading-tight">
          Sewa Apapun Jadi Lebih
          <br />
          <span className="text-blue-600 italic"> Mudah & Aman</span>
        </h2>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Platform penyewaan terpercaya di Bekasi. Mulai dari buku, gadget,
          hingga alat hobi.
        </p>

        <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl border flex flex-col md:flex-row gap-2 mt-100 ">
          <div className="flex-1 flex items-center px-4 gap-3">
            <Search className="text-slate-400" size={22} />

            <input
              type="text"
              aria-label="Cari barang"
              placeholder="Cari buku atau barang lainnya..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full outline-none py-4 text-lg"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              // tombol “Cari Sekarang” hanya memicu filter
              // (filter otomatis mengikuti state `query`)
              setQuery((q) => q.trim());
            }}
            className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Cari Sekarang
          </button>
        </div>
      </header>

      {/* Trust Badges */}
      <section className="bg-white py-12 border-y">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 px-6">
            <ShieldCheck className="text-blue-600" size={40} />
            <div>
              <h4 className="font-bold">Deposit Terproteksi</h4>
              <p className="text-sm text-slate-500">
                Dana aman di sistem kami.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 border-x">
            <Package className="text-green-600" size={40} />
            <div>
              <h4 className="font-bold">Verifikasi Barang</h4>
              <p className="text-sm text-slate-500">
                Kondisi barang dicek berkala.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6">
            <Clock className="text-purple-600" size={40} />
            <div>
              <h4 className="font-bold">Sewa Fleksibel</h4>
              <p className="text-sm text-slate-500">Harian atau Mingguan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Katalog Barang */}
      <section id="katalog" className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-3xl font-bold mb-2">Katalog Terbaru</h3>
            <p className="text-slate-500">
              Barang-barang yang baru saja ditambahkan oleh pemilik.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              // Reset pencarian agar katalog terlihat penuh
              setQuery("");
              // scroll ke section katalog
              document
                .getElementById("katalog")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center text-blue-600 font-bold hover:gap-2 transition-all"
          >
            Lihat Semua <ChevronRight size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-slate-500 font-medium">
              Mengambil data dari database...
            </p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition duration-300 group"
              >
                <div className="aspect-[4/5] overflow-hidden bg-slate-100 relative">
                  <img
                    src={
                      item.image_url ||
                      "https://images.unsplash.com/photo-1543004629-ff569f872783?q=80&w=400"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {item.category || "Umum"}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-xl mb-2 line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-blue-600 font-extrabold text-2xl">
                      Rp {item.price_daily.toLocaleString()}
                    </span>
                    <span className="text-slate-400 text-sm">/hari</span>
                  </div>
                  <div className="pt-4 border-t flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                        Jaminan
                      </p>
                      <p className="text-sm font-bold text-slate-700 text-nowrap">
                        Rp {item.deposit_amount.toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition shadow-lg shadow-slate-200"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <Package className="mx-auto text-slate-300 mb-4" size={64} />
            <h4 className="text-xl font-bold text-slate-800">
              Belum ada barang
            </h4>
            <p className="text-slate-500">
              Coba tambahkan data di dashboard Supabase Anda.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-bold text-white mb-2">AyoSewa Indonesia</p>
          <p>© 2026 - Dikembangkan oleh Teddy </p>
        </div>
      </footer>
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold">{selectedItem.title}</h3>
                <p className="text-sm font-bold text-slate-500 mt-1">
                  {selectedItem.category || "Umum"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedItem(null);
                }}
                className="text-slate-500 hover:text-slate-800 font-bold"
                aria-label="Tutup detail"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={
                  selectedItem.image_url ||
                  "https://images.unsplash.com/photo-1543004629-ff569f872783?q=80&w=800"
                }
                alt={selectedItem.title}
                className="w-full h-60 object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Harga Sewa
                </p>
                <p className="text-lg font-bold text-slate-800">
                  Rp {selectedItem.price_daily.toLocaleString()}/hari
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Deposit
                </p>
                <p className="text-lg font-bold text-slate-800">
                  Rp {selectedItem.deposit_amount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Status Ketersediaan
              </p>
              <p className="text-sm font-bold">
                {selectedItem.is_available ? (
                  <span className="text-green-700">Tersedia</span>
                ) : (
                  <span className="text-red-700">Sedang tidak tersedia</span>
                )}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                Spek Barang
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 text-sm whitespace-pre-wrap">
                {selectedItem.description
                  ? selectedItem.description
                  : "Belum ada spek."}
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition"
                onClick={() => alert(`Mulai sewa: ${selectedItem.title}`)}
              >
                Sewa
              </button>
            </div>

            <div className="mt-6">
              {selectedItem.created_at ? (
                <p className="text-xs text-slate-400">
                  Diposting pada: {selectedItem.created_at}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Sewakan Barangmu</h3>
            <form onSubmit={addItem} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-600">
                  Nama Barang
                </label>
                <input
                  required
                  type="text"
                  className="w-full border p-3 rounded-xl outline-blue-600"
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Harga Sewa/Hari
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full border p-3 rounded-xl outline-blue-600"
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        price_daily: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-600">
                    Nilai Deposit
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full border p-3 rounded-xl outline-blue-600"
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        deposit_amount: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600">
                  URL Gambar (Unsplash/Link)
                </label>
                <input
                  type="text"
                  aria-label="URL Gambar (Unsplash/Link)"
                  className="w-full border p-3 rounded-xl outline-blue-600"
                  onChange={(e) =>
                    setNewItem({ ...newItem, image_url: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">
                  Spek Barang (description)
                </label>
                <textarea
                  aria-label="Spek Barang (description)"
                  rows={4}
                  className="w-full border p-3 rounded-xl outline-blue-600 resize-none"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  placeholder="Tulis spesifikasi barang..."
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 font-bold text-slate-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
