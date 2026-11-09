interface Props {
  label: string
  judul: string
  deskripsi: string
}

export default function SectionHeader({ label, judul, deskripsi }: Props) {
  return (
    <div className="section-header">
      <span className="section-label">{label}</span>
      <h2>{judul}</h2>
      <p>{deskripsi}</p>
    </div>
  )
}