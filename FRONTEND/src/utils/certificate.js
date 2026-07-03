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

export const numberToWords = (num) => {
  const ones = [
    '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
    'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN',
    'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
  ]
  const tens = [
    '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'
  ]

  const score = Number(num)
  if (!score || !Number.isFinite(score) || score <= 0) return 'ZERO ONLY'
  if (score === 1000) return 'ONE THOUSAND ONLY'

  let temp = score
  let words = ''

  if (temp >= 100) {
    words += ones[Math.floor(temp / 100)] + ' HUNDRED '
    temp %= 100
  }

  if (temp >= 20) {
    words += tens[Math.floor(temp / 10)] + ' '
    temp %= 10
  }

  if (temp > 0) {
    words += ones[temp] + ' '
  }

  return (words.trim() + ' ONLY').toUpperCase()
}

export const getYearFromRecord = (student) => {
  if (student?.year) {
    return student.year
  }
  const msNo = String(student?.MsNo || student?.SlNo || '')
  if (msNo && msNo.length >= 2) {
    const prefix = msNo.substring(0, 2)
    if (/^\d{2}$/.test(prefix)) {
      return `20${prefix}`
    }
  }
  return new Date().getFullYear().toString()
}

export const getClassStandardDisplayName = (className) => {
  const name = String(className || '').toLowerCase()
  if (name.includes('fauquania')) {
    return { name: 'FAUQUANIA', suffixNumber: '10', suffixText: 'th' }
  }
  if (name.includes('moulvi')) {
    return { name: 'MOULVI', suffixNumber: '12', suffixText: 'th' }
  }
  if (name.includes('wastania')) {
    return { name: 'WASTANIA', suffixNumber: '8', suffixText: 'th' }
  }
  return { name: String(className || '').toUpperCase(), suffixNumber: '', suffixText: '' }
}



