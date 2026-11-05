import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Phone,
  FileText,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { pelangganService, PROFIL_USAHA } from '../../services';
import type { PelangganWithDetails, StatusCucian } from '../../types';
import { formatRupiah, formatTanggal } from '../../utils/crypto';

export const CekStatusPage: React.FC = () => {
  const [noNota, setNoNota] = useState('');
  const [last4Phone, setLast4Phone] = useState('');
  const [result, setResult] = useState<PelangganWithDetails | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const statusSteps: { key: StatusCucian; label: string; desc: string }[] = [
    { key: 'diterima', label: 'Diterima', desc: 'Pakaian telah ditimbang dan dicatat kasir' },
    { key: 'dicuci', label: 'Dicuci', desc: 'Pakaian sedang dalam proses pencucian higienis' },
    { key: 'disetrika', label: 'Disetrika', desc: 'Pakaian sedang disetrika uap rapi' },
    { key: 'siap diambil', label: 'Siap Diambil', desc: 'Pakaian sudah rapi, wangi & dipacking' },
    { key: 'selesai', label: 'Selesai', desc: 'Cucian sudah diambil oleh pelanggan' },
  ];

  const getStepIndex = (status: StatusCucian): number => {
    return statusSteps.findIndex((s) => s.key === status);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setResult(null);
    setSearched(true);

    const cleanNota = noNota.trim();
    const cleanDigits = last4Phone.replace(/\D/g, '');

    if (!cleanNota) {
      setErrorMessage('Nomor nota wajib diisi (contoh: CL-0001)');
      return;
    }

    if (cleanDigits.length !== 4) {
      setErrorMessage('Masukkan tepat 4 digit terakhir nomor HP Anda');
      return;
    }

    const found = pelangganService.getByNotaAndPhone(cleanNota, cleanDigits);
    if (!found) {
      setErrorMessage(
        'Data cucian tidak ditemukan. Pastikan Nomor Nota dan 4 digit terakhir Nomor HP Anda sesuai dengan bukti tanda terima.'
      );
    } else {
      setResult(found);
    }
  };

  // Quick demo filler untuk mempermudah dosen/penilai
  const fillSample = (nota: string, hp4: string) => {
    setNoNota(nota);
    setLast4Phone(hp4);
    setErrorMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-3">
        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
          <Search className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Lacak Status Cucian Anda
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Masukkan <strong>Nomor Nota</strong> dan <strong>4 digit terakhir nomor WhatsApp/HP</strong> yang Anda daftarkan saat menitipkan pakaian di {PROFIL_USAHA.nama}.
        </p>
      </div>

      {/* FORM PENCARIAN STATUS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-blue-900/5 p-6 sm:p-8 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Input Nomor Nota */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor Nota / Transaksi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={noNota}
                  onChange={(e) => setNoNota(e.target.value)}
                  placeholder="Contoh: CL-0001"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Input 4 Digit Terakhir No HP */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                4 Digit Terakhir Nomor HP <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={last4Phone}
                  onChange={(e) => setLast4Phone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Contoh: 7890"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Cek Status Cucian Sekarang</span>
          </button>
        </form>

        {/* Demo Fast Buttons untuk Pengujian Dosen */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Uji Cepat Data Contoh (Dummy):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillSample('CL-0001', '7890')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs text-slate-700 hover:text-blue-700 font-medium transition-all"
            >
              Nota <strong>CL-0001</strong> &bull; HP: <strong>7890</strong> (Selesai/Lunas)
            </button>
            <button
              type="button"
              onClick={() => fillSample('CL-0002', '1234')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs text-slate-700 hover:text-blue-700 font-medium transition-all"
            >
              Nota <strong>CL-0002</strong> &bull; HP: <strong>1234</strong> (Siap Diambil)
            </button>
            <button
              type="button"
              onClick={() => fillSample('CL-0003', '7766')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs text-slate-700 hover:text-blue-700 font-medium transition-all"
            >
              Nota <strong>CL-0003</strong> &bull; HP: <strong>7766</strong> (Disetrika/Belum Bayar)
            </button>
          </div>
        </div>
      </div>

      {/* ALERT ERROR JIKA TIDAK DITEMUKAN */}
      {searched && errorMessage && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-3xl flex items-start space-x-3 text-rose-800 text-xs sm:text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Pencarian Tidak Berhasil</h4>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* HASIL PELACAKAN CUCIAN */}
      {result && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn space-y-6">
          {/* Header Hasil */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                Bukti Transaksi Resmi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                Nomor Nota: {result.id_pelanggan}
              </h2>
              <p className="text-xs text-blue-100 mt-1">
                Atas Nama: <strong className="text-white">{result.nama}</strong> &bull; Tanggal Masuk:{' '}
                {formatTanggal(result.tanggal_masuk)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-blue-200 block">Status Cucian Saat Ini:</span>
              <span className="inline-block mt-1 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white text-blue-800 shadow-md">
                {result.status_cucian}
              </span>
            </div>
          </div>

          {/* VISUAL TIMELINE PROGRESS TRACKER */}
          <div className="px-6 sm:px-8 py-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
              Progres Pengerjaan Cucian:
            </h3>

            {/* Stepper container */}
            <div className="relative">
              {/* Garis penghubung desktop */}
              <div className="hidden sm:block absolute top-1/2 left-6 right-6 h-1 bg-slate-100 -translate-y-1/2 -z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(result.status_cucian);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={step.key}
                      className={`flex sm:flex-col items-center sm:text-center p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-blue-50/80 border-blue-400 shadow-md ring-2 ring-blue-500/20'
                          : isCompleted
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      {/* Step Circle */}
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 sm:mb-2 mr-3 sm:mr-0 shadow-xs ${
                          isCurrent
                            ? 'bg-blue-600 text-white animate-pulse'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div className="text-left sm:text-center">
                        <span
                          className={`text-xs font-extrabold block capitalize ${
                            isCurrent
                              ? 'text-blue-900'
                              : isCompleted
                              ? 'text-emerald-900'
                              : 'text-slate-500'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DETAIL RINCIAN ORDER */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Layanan</span>
                <span className="font-extrabold text-slate-800 text-sm">
                  {result.layanan?.nama_layanan}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Est: {result.layanan?.estimasi_durasi}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  Berat / Jumlah
                </span>
                <span className="font-extrabold text-slate-800 text-sm">
                  {result.berat} {result.layanan?.satuan || 'kg'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Tarif: {formatRupiah(result.layanan?.harga || 0)}/{result.layanan?.satuan}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  Status Pembayaran
                </span>
                <span
                  className={`inline-block mt-0.5 px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                    result.status_bayar === 'lunas'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {result.status_bayar === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  Total Biaya
                </span>
                <span className="text-lg font-black text-blue-700 block">
                  {formatRupiah(result.total_harga)}
                </span>
              </div>
            </div>

            {/* PEMBERITAHUAN PENGAMBILAN */}
            <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-950">
                    {result.status_cucian === 'siap diambil'
                      ? 'Kabar Baik! Pakaian Anda sudah selesai dan siap diambil di outlet.'
                      : result.status_cucian === 'selesai'
                      ? 'Cucian ini sudah selesai diambil. Terima kasih telah mempercayai kami!'
                      : 'Cucian Anda sedang dalam proses pengerjaan dengan cermat.'}
                  </p>
                  <p className="text-blue-800 text-[11px]">
                    Outlet: {PROFIL_USAHA.alamat} ({PROFIL_USAHA.jamBuka})
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${PROFIL_USAHA.whatsapp}?text=Halo%20Ceria%20Laundry,%20saya%20ingin%20menanyakan%20cucian%20dengan%20nomor%20nota%20${result.id_pelanggan}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs inline-flex items-center shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Tanya Kasir via WA
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
