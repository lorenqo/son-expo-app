export async function loginRequest(email: string, password: string) {
  const url = 'https://m.liveexpert.org/rest/v1/auth/process' + `?email=${encodeURIComponent(email)}` + `&password=${encodeURIComponent(password)}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  const data = await response.json()
  return data
}
