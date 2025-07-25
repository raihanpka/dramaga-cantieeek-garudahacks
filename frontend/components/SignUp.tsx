import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';

export default function SignUp({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    if (!fullName.trim()) {
      Alert.alert('Nama lengkap wajib diisi');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign Up Gagal', error.message);
    } else {
      // Insert profile ke tabel profiles
      const user = data.user;
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: fullName,
        });
      }
      Alert.alert('Berhasil daftar', 'Silakan cek email untuk verifikasi!');
      if (onSuccess) onSuccess();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Akun Baru</Text>
      <Text style={styles.subtitle}>Isi data di bawah untuk membuat akun</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nama Lengkap"
          autoCapitalize="words"
          placeholderTextColor="#999"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@address.com"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          disabled={loading}
          onPress={signUpWithEmail}
        >
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF8E7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.tint,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
