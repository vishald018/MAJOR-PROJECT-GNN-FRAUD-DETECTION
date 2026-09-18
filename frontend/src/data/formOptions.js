export const SEX_OPTIONS = [
  { value: '1', label: 'Male (1)' },
  { value: '2', label: 'Female (2)' },
]

export const RACE_OPTIONS = [
  { value: '1', label: 'Race 1' },
  { value: '2', label: 'Race 2' },
  { value: '3', label: 'Race 3' },
  { value: '5', label: 'Race 5' },
]

export const ESRD_OPTIONS = [
  { value: 'Y', label: 'Yes (Y)' },
  { value: 'N', label: 'No (0)' },
]

export const STATE_OPTIONS = Array.from({ length: 54 }, (_, index) => {
  const code = index + 1
  return { value: String(code), label: `State code ${String(code).padStart(2, '0')}` }
})

export const MEDICAL_CONDITIONS = [
  { id: 'alzheimer', label: 'Alzheimer / Dementia' },
  { id: 'heart_failure', label: 'Heart Failure' },
  { id: 'kidney_disease', label: 'Chronic Kidney Disease' },
  { id: 'cancer', label: 'Cancer' },
  { id: 'pulmonary', label: 'Pulmonary Disease' },
  { id: 'depression', label: 'Depression' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'ischemic_heart', label: 'Ischemic Heart Disease' },
  { id: 'osteoporosis', label: 'Osteoporosis' },
  { id: 'rheumatoid', label: 'Rheumatoid / Osteoarthritis' },
  { id: 'stroke', label: 'Stroke / TIA' },
]
