export async function loginRequest(email: string, password: string) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL

  const loginUrl = `${apiUrl}/rest/v1/auth/process` + `?email=${encodeURIComponent(email)}` + `&password=${encodeURIComponent(password)}`

  const response = await fetch(loginUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  const data = await response.json()
  return data
}

export async function registerRequest(name: string, email: string, password: string) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL

  if (!apiUrl) {
    throw new Error('API URL not defined')
  }

  const formData = new FormData()
  formData.append('name', name)
  formData.append('email', email)
  formData.append('passwd', password)

  const response = await fetch(`${apiUrl}/rest/v1/users`, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.content || 'Ошибка регистрации')
  }

  return data
}

export async function checkEmail(email: string) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL

  const checkEmailUrl = `${apiUrl}/rest/v1/users?filter=check_exist_user` + `&email=${encodeURIComponent(email)}`

  const response = await fetch(checkEmailUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Ошибка проверки email')
  }

  const data = await response.json()
  return Boolean(data)
}
