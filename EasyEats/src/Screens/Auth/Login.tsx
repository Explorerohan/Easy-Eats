import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    ImageBackground, 
    TouchableOpacity, 
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebaseConfiguration/firebaseConfig';
import { useAuth } from '../../../context/AuthContext';
import authAPI from '../../api/authAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
    Started: undefined;
    Login: undefined;
    Signup: undefined;
    Home: undefined;
    Profile: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginProps {
    navigation: LoginScreenNavigationProp;
}

export default function Login({ navigation }: LoginProps) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        // Trim the email to remove any whitespace
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            setIsLoading(true);
            
            // Trim the email before sending to Firebase
            const trimmedEmail = email.trim();
            
            // Authenticate with Firebase
            const firebaseUser = await signInWithEmailAndPassword(auth, trimmedEmail, password);
            
            // Try to get the user's profile from Django
            try {
                const profileResponse = await authAPI.getProfile(firebaseUser.user.uid);
                // Profile exists, proceed with login
                login();
            } catch (profileError: any) {
                // If profile doesn't exist (404), create it
                if (profileError.response?.status === 404) {
                    try {
                        await authAPI.createProfile({
                            firebase_uid: firebaseUser.user.uid,
                            email: firebaseUser.user.email || trimmedEmail,
                            first_name: firebaseUser.user.displayName?.split(' ')[0] || '',
                            last_name: firebaseUser.user.displayName?.split(' ')[1] || ''
                        });
                        login();
                    } catch (createError: any) {
                        console.error('Profile creation error:', createError);
                        let errorMessage = 'Could not create user profile. Please try again.';
                        
                        if (createError.response?.data?.error) {
                            errorMessage = createError.response.data.error;
                        } else if (createError.message === 'Network Error') {
                            errorMessage = 'Could not connect to the server. Please check your internet connection and try again.';
                        }
                        
                        await auth.signOut();
                        Alert.alert('Profile Creation Failed', errorMessage);
                        return;
                    }
                } else {
                    console.error('Profile retrieval error:', profileError);
                    let errorMessage = 'An error occurred while retrieving your profile. Please try again.';
                    
                    if (profileError.response?.data?.error) {
                        errorMessage = profileError.response.data.error;
                    } else if (profileError.message === 'Network Error') {
                        errorMessage = 'Could not connect to the server. Please check your internet connection and try again.';
                    }
                    
                    await auth.signOut();
                    Alert.alert('Profile Error', errorMessage);
                    return;
                }
            }
        } catch (error: any) {
            console.error('Login error:', error);
            let errorMessage = 'An error occurred during login. Please try again.';
            
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            }
            
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/fryrice.jpg')} style={styles.background}>
            <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']} style={styles.overlay} />
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Welcome Back!</Text>
                    <Text style={styles.subtitle}>Log in to continue exploring amazing recipes.</Text>

                    <TextInput
                        style={[styles.input, errors.email ? styles.inputError : null]}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={(text) => { setEmail(text); setErrors(prev => ({ ...prev, email: '' })); }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                    <View style={[styles.passwordContainer, errors.password ? styles.inputError : null]}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            secureTextEntry={!passwordVisible}
                            value={password}
                            onChangeText={(text) => { setPassword(text); setErrors(prev => ({ ...prev, password: '' })); }}
                        />
                        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="#999" />
                        </TouchableOpacity>
                    </View>
                    {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                    <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleLogin} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Login</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.registerText}>New here? <Text style={styles.registerLink}>Sign Up</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, justifyContent: 'center' },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    card: { width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 20, borderRadius: 12, alignItems: 'center' },
    title: { fontSize: 26, fontWeight: 'bold', color: '#FFF', marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#CCC', textAlign: 'center', marginBottom: 20 },
    input: { width: '100%', height: 50, backgroundColor: '#333', borderRadius: 8, padding: 12, color: '#FFF', marginBottom: 15 },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 12, height: 50, width: '100%' },
    passwordInput: { flex: 1, color: '#FFF' },
    button: { backgroundColor: '#28A745', paddingVertical: 12, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 10 },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    registerText: { color: '#CCC', fontSize: 14, marginTop: 15 },
    registerLink: { color: '#28A745', fontWeight: 'bold' },
    inputError: { borderColor: '#FF6B6B', borderWidth: 1 },
    errorText: { color: '#FF6B6B', fontSize: 12, marginTop: -10, marginBottom: 10, alignSelf: 'flex-start' }
});
