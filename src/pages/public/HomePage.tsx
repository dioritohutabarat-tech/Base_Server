import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  MessageCircle,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Shirt,
} from 'lucide-react';
import { layananService, PROFIL_USAHA } from '../../services';
import type { Layanan } from '../../types';
import { formatRupiah } from '../../utils/crypto';

export const HomePage: React.FC = () => {
  const [layananList, setLayananList] = useState<Layanan[]>([]);

  useEffect(() => {
    setLayananList(layananService.getAll());
  }, []);

  const waUrl = `https://wa.me/${PROFIL_USAHA.whatsapp}?text=Halo%20${encodeURIComponent(
    PROFIL_USAHA.nama
  )},%20saya%20ingin%20menggunakan%20jasa%20laundry.`;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-16 sm:pb-24 bg-gradient-to-b from-blue-50/70 via-white to-slate-50">
        {/* Decorative background blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-200/30 to-sky-200/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Badge Solusi */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold border border-blue-200/60 shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Sistem Pencatatan Digital & Pelacakan Cucian Online</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
              Pakaian Bersih, Rapi & <span className="text-blue-600">Wangi Ceria</span> Setiap Hari
            </h1>

            {/* Subtitle Deskripsi */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Tinggalkan nota kertas yang mudah hilang. Di <strong>{PROFIL_USAHA.nama}</strong>, setiap
              cucian dicatat transparan dan dapat Anda pantau status prosesnya secara <em>real-time</em> langsung dari ponsel Anda.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/cek-status"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-600/30 hover:scale-102 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 mr-2" />
                Cek Status Cucian Anda
              </Link>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-emerald-600/20 hover:scale-102 transition-all"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat WhatsApp ({PROFIL_USAHA.whatsappDisplay})
              </a>
            </div>

            {/* Keunggulan Singkat */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">1 Nota = 1 Mesin (Higienis)</span>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center space-x-2.5">
                <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Setrika Uap Bertekanan</span>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Garansi Pakaian Wangi</span>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center space-x-2.5">
                <Clock className="w-5 h-5 text-purple-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Tepat Waktu & Notifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATUS TRACKING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-blue-700/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-400/30">
              Cek Cucian Tanpa Telepon
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ingin Tahu Apakah Cucian Sudah Siap Diambil?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100">
              Cukup masukkan Nomor Nota (misal: <strong>CL-0001</strong>) dan 4 digit terakhir nomor HP Anda untuk melacak progres pencucian detik ini juga.
            </p>
          </div>

          <Link
            to="/cek-status"
            className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-black text-sm rounded-2xl shadow-lg transition-transform hover:scale-105 shrink-0 inline-flex items-center"
          >
            Lacak Cucian Sekarang <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* DAFTAR LAYANAN & HARGA */}
      <section id="layanan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Transparan & Terjangkau
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Pilihan Layanan & Tarif Ceria
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Daftar harga resmi Ceria Laundry tanpa biaya tersembunyi. Pakaian ditimbang akurat di depan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {layananList.map((layanan) => (
            <div
              key={layanan.id_layanan}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Shirt className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-400" />
                    {layanan.estimasi_durasi}
                  </span>
                </div>

                <h3 className="font-black text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                  {layanan.nama_layanan}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Perawatan standar higienis dengan deterjen premium ramah serat kain.
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl mb-4 text-center">
                  <span className="text-2xl font-black text-blue-700">
                    {formatRupiah(layanan.harga)}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold"> / {layanan.satuan}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${PROFIL_USAHA.whatsapp}?text=Halo%20Ceria%20Laundry,%20saya%20ingin%20memesan%20layanan%20${encodeURIComponent(
                  layanan.nama_layanan
                )}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center transition-colors"
              >
                Pesan via WhatsApp
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* LOKASI & JAM OPERASIONAL */}
      <section id="lokasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Info Lokasi & Jam */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Kunjungi Outlet Kami
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                  Lokasi Mudah Ditemukan & Strategis
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Outlet Ceria Laundry berada tepat di samping Klinik Helvetia, sangat mudah dijangkau dari kawasan Jl. Helvetia dan sekitarnya dengan area parkir yang nyaman.
                </p>
              </div>

              <div className="space-y-4">
                {/* Alamat */}
                <div className="p-4 bg-slate-50 rounded-2xl flex items-start space-x-3.5 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Alamat Lengkap
                    </h4>
                    <p className="text-xs text-slate-700 font-semibold mt-0.5">
                      {PROFIL_USAHA.alamat}
                    </p>
                    <span className="text-[11px] text-blue-600 font-medium">
                      Patokan: Tepat di samping Klinik Helvetia
                    </span>
                  </div>
                </div>

                {/* Jam Buka */}
                <div className="p-4 bg-slate-50 rounded-2xl flex items-start space-x-3.5 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Jam Buka / Operasional
                    </h4>
                    <p className="text-xs text-slate-700 font-semibold mt-0.5">
                      {PROFIL_USAHA.jamBuka}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Buka Setiap Hari (Senin - Minggu)
                    </span>
                  </div>
                </div>

                {/* WhatsApp Direct */}
                <div className="p-4 bg-emerald-50 rounded-2xl flex items-start space-x-3.5 border border-emerald-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <h4 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider">
                        Layanan Antar-Jemput / Tanya Admin
                      </h4>
                      <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                        {PROFIL_USAHA.whatsappDisplay}
                      </p>
                    </div>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center self-start sm:self-auto"
                    >
                      Hubungi WA
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Peta & Outlet Illustration */}
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[360px]">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                  Petunjuk Arah Outlet
                </span>
                <h3 className="text-2xl font-black">
                  Kunjungi Outlet Ceria Laundry
                </h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Jl. Pulau Nias No. 2A (samping Klinik Helvetia), Medan. Bawa pakaian kotor Anda sekarang dan nikmati hasil cucian yang bersih maksimal, higienis, dan wangi tahan lama.
                </p>
              </div>

              <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    PROFIL_USAHA.nama + ' ' + PROFIL_USAHA.alamat
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 font-extrabold text-xs rounded-xl shadow-md text-center transition-transform hover:scale-102 flex items-center justify-center"
                >
                  <MapPin className="w-4 h-4 mr-1.5 text-blue-600" />
                  Buka di Google Maps
                </a>

                <Link
                  to="/cek-status"
                  className="px-5 py-3 bg-blue-800/80 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl text-center transition-colors flex items-center justify-center"
                >
                  <Search className="w-4 h-4 mr-1.5" />
                  Cek Status Nota
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
