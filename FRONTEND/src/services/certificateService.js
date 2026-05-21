const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

const parseApiResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed')
  }

  return payload
}

export const loginUser = async ({ loginId, password }) => {
  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: loginId,
      username: loginId,
      password,
    }),
  })
  const payload = await parseApiResponse(response)

  return payload.data || payload.user || payload
}

export const searchCertificateRecord = async (filters) => {
  const response = await fetch(`${API_BASE_URL}/certificate/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  })
  const payload = await parseApiResponse(response)

  return payload.data || payload.record || payload.student || payload
}

export const demoStudents = [
  {
    id: 'std-001',
    studentName: 'Rakesh Kumar',
    fatherName: 'Mulesh Kumar',
    motherName: 'Sabeta Devi',
    madrasaName: 'Madarsa Islamia, Patna',
    district: 'Patna',
    className: 'Fauquania',
    standard: 'Fauquania',
    rollNo: '1428',
    registrationNo: 'REG-2026-0084',
    year: '2026',
    marks: '384',
    subjects: [
      { name: 'Arabic', fullMarks: 100, obtained: 82 },
      { name: 'Persian', fullMarks: 100, obtained: 78 },
      { name: 'Urdu', fullMarks: 100, obtained: 88 },
      { name: 'Hindi', fullMarks: 100, obtained: 70 },
      { name: 'English', fullMarks: 100, obtained: 66 },
    ],
    issueDate: '2026-05-21',
  },
  {
    id: 'std-002',
    studentName: 'Saba Parween',
    fatherName: 'Abdul Karim',
    motherName: 'Rukhsana Bano',
    madrasaName: 'Madrasa Noorul Uloom, Purnea',
    district: 'Purnea',
    className: 'Moulvi',
    standard: 'Moulvi',
    rollNo: '2195',
    registrationNo: 'REG-2026-0412',
    year: '2026',
    marks: '421',
    subjects: [
      { name: 'Arabic', fullMarks: 100, obtained: 91 },
      { name: 'Persian', fullMarks: 100, obtained: 84 },
      { name: 'Urdu', fullMarks: 100, obtained: 86 },
      { name: 'Hindi', fullMarks: 100, obtained: 79 },
      { name: 'English', fullMarks: 100, obtained: 81 },
    ],
    issueDate: '2026-05-21',
  },
  {
    id: 'std-003',
    studentName: 'Nazia Firdaus',
    fatherName: 'Imran Alam',
    motherName: 'Shaheen Ara',
    madrasaName: 'Madrasa Rahmania, Gaya',
    district: 'Gaya',
    className: 'Wastania',
    standard: 'Wastania',
    rollNo: '0876',
    registrationNo: 'REG-2026-0197',
    year: '2026',
    marks: '312',
    subjects: [
      { name: 'Arabic', fullMarks: 100, obtained: 68 },
      { name: 'Persian', fullMarks: 100, obtained: 62 },
      { name: 'Urdu', fullMarks: 100, obtained: 74 },
      { name: 'Hindi', fullMarks: 100, obtained: 58 },
      { name: 'English', fullMarks: 100, obtained: 50 },
    ],
    issueDate: '2026-05-21',
  },
  {
    id: 'std-004',
    studentName: 'Imran Alam',
    fatherName: 'Naseem Alam',
    motherName: 'Parveen Khatoon',
    madrasaName: 'Madrasa Rahmatia, Araria',
    district: 'Araria',
    className: 'Moulvi',
    standard: 'Moulvi',
    rollNo: '3310',
    registrationNo: 'REG-2026-0551',
    year: '2026',
    marks: '398',
    subjects: [
      { name: 'Arabic', fullMarks: 100, obtained: 80 },
      { name: 'Persian', fullMarks: 100, obtained: 76 },
      { name: 'Urdu', fullMarks: 100, obtained: 85 },
      { name: 'Hindi', fullMarks: 100, obtained: 74 },
      { name: 'English', fullMarks: 100, obtained: 83 },
    ],
    issueDate: '2026-05-21',
  },
]

export const printQueue = demoStudents.map((student, index) => ({
  ...student,
  status: index === 0 ? 'Ready' : 'Draft',
}))
