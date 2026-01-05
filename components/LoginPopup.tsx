import { createUser } from '@/models/user'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

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
      return t('auth.errorEmptyFields')
    }

    if (password.length < 6 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return t('auth.passwordHint')
    }

    return null
  }

  const handleEmailBlur = async () => {
    if (!email || !email.includes('@')) return

    try {
      setCheckingEmail(true)
      setEmailError('')

      const permission = await checkEmail(email)

      if (mode === 'register' && !permission) {
        setEmailError(t('auth.emailExists'))
      }

      if (mode === 'login' && permission) {
        setEmailError(t('auth.emailNotFound'))
      }
    } catch {
    } finally {
      setCheckingEmail(false)
    }
  }

  const loginUser = async () => {
    if (!email || !password) {
      setError(t('auth.errorEmptyFields'))
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await loginRequest(email, password)
      const user = response?.user

      if (!user) {
        setError(t('auth.errorWrongLoginData'))
        return
      }

      await login(createUser(user))

      console.log(response)

      onClose()
    } catch {
      setError(t('auth.errorServer'))
    } finally {
      setLoading(false)
    }
  }

  const registerUser = async () => {
    if (!name || !email || !password) {
      setError(t('auth.errorEmptyFields'))
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

      await registerRequest(name, email, password)
      loginUser()
      onClose()
    } catch {
      setError(t('auth.errorServer'))
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

          <Text style={styles.title}>{mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}</Text>

          {mode === 'register' && <TextInput placeholder={t('auth.namePlaceholder')} placeholderTextColor="#8f8f8f" value={name} onChangeText={setName} style={styles.input} />}

          <TextInput
            placeholder={t('auth.emailPlaceholder')}
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
            placeholder={t('auth.passwordPlaceholder')}
            placeholderTextColor="#8f8f8f"
            value={password}
            secureTextEntry
            onChangeText={(text) => {
              setPassword(text)
              setError('')
            }}
            style={styles.input}
          />

          {mode === 'register' && password && <Text style={styles.hint}>{t('auth.passwordHint')}</Text>}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={[styles.button, isSubmitDisabled && styles.buttonDisabled]} onPress={handleSubmit} disabled={isSubmitDisabled}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{mode === 'login' ? t('auth.loginButton') : t('auth.registerButton')}</Text>}
          </Pressable>

          {mode === 'login' && (
            <Pressable onPress={openRegister} style={styles.registerBtn}>
              <Text style={styles.registerText}>{t('auth.createAccount')}</Text>
            </Pressable>
          )}

          {mode === 'register' && (
            <Pressable onPress={() => setMode('login')} style={styles.registerBtn}>
              <Text style={styles.registerText}>{t('auth.haveAccount')}</Text>
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
