import { useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export const SignOutButton = () => {
  const { signOut } = useClerk();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to auth page
      Linking.openURL(Linking.createURL('/auth'));
    } catch (err) {
      console.error('Sign out error:', JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  signOutButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 16,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
