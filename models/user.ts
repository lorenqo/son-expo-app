export type User = {
  id: number
  email: string
  name: string
  balance: number
  pic?: string | null
  isGuest: boolean
}

export function createUser(raw: any): User {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    balance: raw.balance,
    pic: raw.pic ?? undefined,
    isGuest: raw.isGuest ?? false,
  }
}
