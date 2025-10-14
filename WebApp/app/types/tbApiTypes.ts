export interface RegistrationFormData {
  email: string
  firstName: string
  lastName: string
}

export interface ActivationInfo {
  activateToken: string
  password: string
}
