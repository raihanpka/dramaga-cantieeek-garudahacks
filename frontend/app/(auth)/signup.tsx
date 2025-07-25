import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Image, 
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  
  useWarmUpBrowser();

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok');
      return;
    }

    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' ') || '',
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      } else {
        console.log('Verification not complete');
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignUp = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Google sign-up failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/book-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          {/* Main Signup Card */}
          <View style={styles.signupCard}>
              {/* Back Button */}
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Image
                    source={require('@/assets/images/backarrow-icon.png')}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                />
                <Text style={styles.backButtonText}>← Kembali</Text>
              </TouchableOpacity>

              {/* Signup Title */}
              <Text style={styles.signupTitle}>
                {pendingVerification ? 'Verifikasi Email' : 'Daftar'}
              </Text>

              {!pendingVerification ? (
                <>
                  {/* Full Name Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Nama Lengkap</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Masukkan nama lengkap"
                      placeholderTextColor="#999"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>

                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="you@example.com"
                      placeholderTextColor="#999"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={true}
                    />
                  </View>

                  {/* Confirm Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Konfirmasi Password</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••"
                      placeholderTextColor="#999"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={true}
                    />
                  </View>

                  {/* Terms and Conditions */}
                  <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                      Dengan mendaftar, Anda menyetujui{' '}
                      <Text style={styles.termsLink}>Syarat & Ketentuan</Text> dan{' '}
                      <Text style={styles.termsLink}>Kebijakan Privasi</Text> kami.
                    </Text>
                  </View>

                  {/* Signup Button */}
                  <TouchableOpacity 
                    style={[styles.signupButton, loading && { opacity: 0.7 }]} 
                    onPress={onSignUpPress}
                    disabled={loading}
                  >
                    <Text style={styles.signupButtonText}>
                      {loading ? 'Mendaftar...' : 'Daftar'}
                    </Text>
                  </TouchableOpacity>

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or continue with</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Google Signup Button */}
                  <TouchableOpacity 
                    style={styles.googleButton}
                    onPress={onGoogleSignUp}
                  >
                    <Text style={styles.googleButtonText}>G Google</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.verificationText}>
                    Kami telah mengirim kode verifikasi ke {email}
                  </Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Kode Verifikasi</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Masukkan kode 6 digit"
                      placeholderTextColor="#999"
                      value={code}
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.signupButton, loading && { opacity: 0.7 }]} 
                    onPress={onPressVerify}
                    disabled={loading}
                  >
                    <Text style={styles.signupButtonText}>
                      {loading ? 'Memverifikasi...' : 'Verifikasi'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Sudah punya akun? </Text>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.loginLink}>Masuk</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#472800',
  },
  backgroundImage: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  header: {
    height: 100,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  booksContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  bookShelf: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  book: {
    width: 25,
    height: 40,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signupCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    padding: 8,
  },
  backButtonText: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
  },
  signupTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  termsContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
  termsLink: {
    color: '#8B4513',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signupButton: {
    backgroundColor: '#8B4513',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 24,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  verificationText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});
