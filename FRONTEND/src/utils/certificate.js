export const classOptions = ['Moulvi', 'Fauquania', 'Wastania']

export const districtOptions = [
  'Araria',
  'Arwal',
  'Aurangabad',
  'Banka',
  'Begusarai',
  'Bhagalpur',
  'Bhojpur',
  'Buxar',
  'Darbhanga',
  'East Champaran',
  'Gaya',
  'Gopalganj',
  'Jamui',
  'Jehanabad',
  'Kaimur',
  'Katihar',
  'Khagaria',
  'Kishanganj',
  'Lakhisarai',
  'Madhepura',
  'Madhubani',
  'Munger',
  'Muzaffarpur',
  'Nalanda',
  'Nawada',
  'Patna',
  'Purnea',
  'Rohtas',
  'Saharsa',
  'Samastipur',
  'Saran',
  'Sheikhpura',
  'Sheohar',
  'Sitamarhi',
  'Siwan',
  'Supaul',
  'Vaishali',
  'West Champaran',
]

export const yearOptions = ['2026', '2025', '2024', '2023', '2022']

export const searchByOptions = [
  { label: 'Reg No', value: 'registrationNo' },
  { label: 'Roll No', value: 'rollNo' },
]

export const divisionFromMarks = (marks) => {
  const score = Number(marks)

  if (!Number.isFinite(score)) {
    return 'Pending'
  }

  if (score >= 300) {
    return 'First'
  }

  if (score >= 225) {
    return 'Second'
  }

  return 'Third'
}

export const makeCertificateNumber = (student) => {
  const year = String(student.year || new Date().getFullYear()).slice(-2)
  const roll = String(student.rollNo || '0000').padStart(4, '0')
  return `BSMEB/${student.className?.toUpperCase().slice(0, 3) || 'CRT'}/${year}/${roll}`
}

export const formatDate = (value) => {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
