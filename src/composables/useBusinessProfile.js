import { reactive } from 'vue'

const defaultProfile = {
  businessName: 'Royce Cafe',
  legalName: 'Royce Cafe Food Services',
  businessType: 'Coffee Shop',
  branchName: 'Main Branch',
  ownerName: '',
  phone: '',
  email: '',
  address: '',
  logo: ''
}

const savedProfile = JSON.parse(
  localStorage.getItem('businessProfile') || '{}'
)

export const businessProfile = reactive({
  ...defaultProfile,
  ...savedProfile
})

export const saveBusinessProfile = () => {
  localStorage.setItem(
    'businessProfile',
    JSON.stringify(businessProfile)
  )
}

export const resetBusinessProfile = () => {
  Object.assign(businessProfile, defaultProfile)

  localStorage.setItem(
    'businessProfile',
    JSON.stringify(defaultProfile)
  )
}