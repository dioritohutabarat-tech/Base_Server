import { getLayanan } from '../api/laundry'
import { useFetch } from '../hooks/useFetch'

const menu = [
  { href: '#layanan', label: 'Layanan' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
  { href: '#harga', label: 'Harga' },
  { href: '#lacak', label: 'Lacak Pesanan' },
]

const lokasi = ['Jl. Tani Asli  No. 10', 'Kecamatan Helvetia', 'Kota Medan', 'Provinsi Sumatera Utara']

export default function Footer() {
  const { data } = useFetch(getLayanan)

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <span className="brand">
              Laundry <em>Ceria</em>
            </span>
            <p className="footer-desc">
              Layanan laundry dengan proses cuci dan setrika yang rapi, bersih, dan wangi.
            </p>
          </div>

          <div>
            <h4>Layanan</h4>
            <ul>
              {data?.map((l) => (
                <li key={l.id}>
                  <a href="#layanan">{l.nama}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Menu</h4>
            <ul>
              {menu.map((m) => (
                <li key={m.href}>
                  <a href={m.href}>{m.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Lokasi</h4>
            <ul>
              {lokasi.map((baris) => (
                <li key={baris}>{baris}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bawah">
          <span>© {new Date().getFullYear()} Laundry Ceria. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  )
}