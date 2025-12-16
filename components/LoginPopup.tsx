import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, Modal, ActivityIndicator, StyleSheet } from 'react-native'
import { loginRequest } from '../services/auth'
import { useAuth } from '../context/AuthContext'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function LoginPopup({ visible, onClose }: Props) {
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
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
        setError('Пользователь не найден')
        return
      }

      login({
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance,
        pic: user.pic ?? null,
      })

      onClose()
    } catch (e) {
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Pressable style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          <Text style={styles.title}>Вход</Text>

          <TextInput placeholder="Email" placeholderTextColor="#8f8f8fff" value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />

          <TextInput placeholder="Пароль" placeholderTextColor="#8f8f8fff" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Войти</Text>}
          </Pressable>
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
})
