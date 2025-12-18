import React, { useState } from 'react'
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { checkEmail, loginRequest, registerRequest } from '../services/auth'
import { login } from '../store/authStore'

type Props = {
  visible: boolean
  onClose: () => void
  autoLogin?: boolean
}

export default function LoginPopup({ visible, onClose }: Props) {
  type Mode = 'login' | 'register'

  const [emailError, setEmailError] = useState('')
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const passwordError = mode === 'register' ? validatePassword(password) : null
  const isSubmitDisabled = loading || checkingEmail || Boolean(emailError) || Boolean(passwordError)

  function validatePassword(password: string): string | null {
    if (!password) {
      return 'Введите пароль'
    }

    if (password.length < 6) {
      return 'Пароль должен быть не менее 6 символов'
    }

    if (!/[A-Za-z]/.test(password)) {
      return 'Пароль должен содержать латинские буквы'
    }

    if (!/\d/.test(password)) {
      return 'Пароль должен содержать цифры'
    }

    return null // пароль валиден
  }

  const handleEmailBlur = async () => {
    if (!email || !email.includes('@')) return

    try {
      setCheckingEmail(true)
      setEmailError('')

      const permission = await checkEmail(email)

      if (mode === 'register' && !permission) {
        setEmailError('Аккаунт с таким email уже существует')
      }

      if (mode === 'login' && permission) {
        setEmailError('Аккаунт с таким email не найден')
      }
    } catch {
      // тут можно молча игнорировать или показать общую ошибку
    } finally {
      setCheckingEmail(false)
    }
  }
  const loginUser = async () => {
    if (!email || !password) {
      setError('Введите email и пароль')
      return
    }
    try {
      setLoading(true)
      setError('')

      const response = await loginRequest(email, password)
      const user = response?.user

      if (!user) {
        setError('Неверный email или пароль')
        return
      }

      await login({
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance,
        pic: user.pic ?? null,
      })

      onClose()
    } catch {
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }
  const registerUser = async () => {
    if (!name || !email || !password) {
      setError('Заполните все поля')
      return
    }

    const passwordError = validatePassword(password)

    if (passwordError) {
      setError(passwordError)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await registerRequest(name, email, password)
      console.log(response)
      loginUser()
    } catch {
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (mode === 'login') {
      await loginUser()
    } else {
      await registerUser()
    }

    onClose()
  }

  const openRegister = () => {
    setError('')
    setMode('register')
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Pressable style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          <Text style={styles.title}>{mode === 'login' ? 'Вход' : 'Регистрация'}</Text>

          {mode === 'register' && <TextInput placeholder="Имя" placeholderTextColor="#8f8f8f" value={name} onChangeText={setName} style={styles.input} />}

          <TextInput
            placeholder="Email"
            placeholderTextColor="#8f8f8f"
            value={email}
            onChangeText={(text) => {
              setEmail(text)
              setEmailError('')
            }}
            onBlur={handleEmailBlur}
            autoCapitalize="none"
            style={styles.input}
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          <TextInput
            placeholder="Пароль"
            placeholderTextColor="#8f8f8f"
            value={password}
            secureTextEntry
            onChangeText={(text) => {
              setPassword(text)
              setError('')
            }}
            style={styles.input}
          />

          {mode === 'register' && password && <Text style={styles.hint}>Пароль должен быть не короче 6 символов и содержать цифры</Text>}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={[styles.button, isSubmitDisabled && styles.buttonDisabled]} onPress={handleSubmit} disabled={isSubmitDisabled}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</Text>}
          </Pressable>
          {mode === 'login' && (
            <Pressable onPress={openRegister} style={styles.registerBtn}>
              <Text style={styles.registerText}>Создать аккаунт</Text>
            </Pressable>
          )}

          {mode === 'register' && (
            <Pressable onPress={() => setMode('login')} style={styles.registerBtn}>
              <Text style={styles.registerText}>У меня уже есть аккаунт</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  close: {
    alignSelf: 'flex-end',
  },
  closeText: {
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#c8e6c9',
  },
  registerBtn: {
    marginTop: 16,
  },
  registerText: {
    textAlign: 'center',
    color: '#2e7d32',
    fontWeight: '600',
  },
  hint: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
    color: '#777',
  },
})
