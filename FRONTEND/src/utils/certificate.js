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

export const divisionFromCode = (divisionCode, marks) => {
  const code = Number(divisionCode)

  if (code === 1) {
    return 'First'
  }

  if (code === 2) {
    return 'Second'
  }

  if (code === 3) {
    return 'Third'
  }

  return divisionFromMarks(marks)
}

export const getTrSubjects = (student) => [
  {
    fullMarks: 200,
    name: student?.DinType || 'Diniyat',
    obtained: Number(student?.DIN_TOT || 0),
  },
  { fullMarks: 100, name: 'Urdu', obtained: Number(student?.URDU || 0) },
  { fullMarks: 100, name: 'Persian', obtained: Number(student?.PER || 0) },
  { fullMarks: 100, name: 'Arabic', obtained: Number(student?.ARB || 0) },
  { fullMarks: 100, name: 'Social Studies', obtained: Number(student?.SST || 0) },
  { fullMarks: 100, name: 'Hindi', obtained: Number(student?.HIN || 0) },
  { fullMarks: 100, name: 'Mathematics', obtained: Number(student?.MAT || 0) },
  { fullMarks: 100, name: 'English', obtained: Number(student?.ENG || 0) },
  { fullMarks: 100, name: 'Science', obtained: Number(student?.SCTOT || 0) },
]

export const getTotalMarks = (student) => {
  const total = Number(student?.TotMs || student?.marks || 0)

  if (Number.isFinite(total) && total > 0) {
    return total
  }

  return getTrSubjects(student).reduce((sum, subject) => sum + subject.obtained, 0)
}

export const getFullMarks = (student) =>
  getTrSubjects(student).reduce((sum, subject) => sum + subject.fullMarks, 0)

export const makeCertificateNumber = (student) => {
  const year = String(student.year || new Date().getFullYear()).slice(-2)
  const roll = String(student.rollNo || '0000').padStart(4, '0')
  return `BSMEB/${student.className?.toUpperCase().slice(0, 3) || 'CRT'}/${year}/${roll}`
}

export const formatDate = (value) => {
  if (!value) {
    return ''
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split('-')
    return `${day} ${month} ${year}`
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
