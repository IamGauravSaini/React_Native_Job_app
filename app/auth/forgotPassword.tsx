import BrandLogo from '../../components/BrandLogo';
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
    const router = useRouter();
    const [step, setStep] = useState(0);

    // Step 0: Email
    const [email, setEmail] = useState('');
    
    // Step 1: OTP
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef<(TextInput | null)[]>([]);
    
    // Step 2: New Password
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);

    const handleNext = () => {
        if (step === 0) {
            if (!email) return Alert.alert("Error", "Please enter your email");
            setStep(1);
        } else if (step === 1) {
            const otpString = otp.join('');
            if (otpString.length < 6) return Alert.alert("Error", "Please enter the full code");
            setStep(2);
        } else if (step === 2) {
            if (!newPassword || newPassword !== repeatPassword) {
                return Alert.alert("Error", "Passwords do not match or are empty");
            }
            setStep(3);
        }
    };

    const handleOtpChange = (text: string, index: number) => {
        const newOTP = [...otp];
        newOTP[index] = text;
        setOtp(newOTP);
        if (text && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.header}>
                    <BrandLogo style={styles.logo} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    
                    {/* STEP 0: Enter Email */}
                    {step === 0 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.title}>Reset your password</Text>
                            <Text style={styles.subtitle}>We will send you a confirmation code to reset your password</Text>
                            
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput 
                                    style={styles.input} 
                                    value={email} 
                                    onChangeText={setEmail} 
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                            
                            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                                <Text style={styles.primaryButtonText}>Submit</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => router.push('/auth/login')}>
                                <Text style={styles.linkText}>I remembered my password</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* STEP 1: Enter OTP */}
                    {step === 1 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.title}>Enter confirmation code</Text>
                            <Text style={styles.subtitle}>{"Please enter the code we've sent to "}{email || 'youremail@hotmail.com'}</Text>
                            
                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => { otpRefs.current[index] = el; }}
                                        style={[styles.otpInput, { borderColor: digit ? '#00A82D' : '#D1D5DB' }]}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(text) => handleOtpChange(text, index)}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity>
                                <Text style={styles.linkText}>Send code again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStep(0)}>
                                <Text style={styles.secondaryLinkText}>Enter a different email</Text>
                            </TouchableOpacity>

                            {/* Added Verify Button for better UX since it's a manual flow */}
                            <TouchableOpacity style={[styles.primaryButton, { marginTop: 40 }]} onPress={handleNext}>
                                <Text style={styles.primaryButtonText}>Verify Code</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* STEP 2: New Password */}
                    {step === 2 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.title}>Reset your password</Text>
                            <Text style={styles.subtitle}>Please enter your new password below.</Text>
                            
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>New password</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput 
                                        style={styles.passwordInput}
                                        secureTextEntry={!newPasswordVisible}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                    />
                                    <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)} style={styles.eyeIcon}>
                                        <Ionicons name={newPasswordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Repeat new password</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput 
                                        style={styles.passwordInput}
                                        secureTextEntry={!repeatPasswordVisible}
                                        value={repeatPassword}
                                        onChangeText={setRepeatPassword}
                                    />
                                    <TouchableOpacity onPress={() => setRepeatPasswordVisible(!repeatPasswordVisible)} style={styles.eyeIcon}>
                                        <Ionicons name={repeatPasswordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                                <Text style={styles.primaryButtonText}>Save new password</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* STEP 3: Success */}
                    {step === 3 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.title}>Perfect! Your password has been changed</Text>
                            <Text style={styles.subtitle}>You can now log in with your new password</Text>
                            
                            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/auth/login')}>
                                <Text style={styles.primaryButtonText}>Log in</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#FFFFFF' 
    },
    header: { 
        alignItems: 'center', 
        paddingTop: 20, 
        paddingBottom: 20 
    },
    logo: { 
        width: 142,
        height: 50,
    },
    scrollContainer: { 
        paddingHorizontal: 24, 
        paddingBottom: 40, 
        flexGrow: 1 
    },
    stepContainer: { 
        alignItems: 'center', 
        marginTop: 20, 
        width: '100%' 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#111827', 
        marginBottom: 12, 
        textAlign: 'center' 
    },
    subtitle: { 
        fontSize: 14, 
        color: '#6B7280', 
        textAlign: 'center', 
        marginBottom: 30, 
        paddingHorizontal: 10, 
        lineHeight: 20 
    },
    inputContainer: { 
        width: '100%', 
        marginBottom: 20 
    },
    label: { 
        fontSize: 14, 
        color: '#4B5563', 
        marginBottom: 6, 
        alignSelf: 'flex-start' 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#D1D5DB', 
        borderRadius: 8, 
        paddingHorizontal: 14, 
        paddingVertical: 12, 
        fontSize: 16, 
        backgroundColor: '#FFFFFF', 
        width: '100%' 
    },
    passwordInputContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#D1D5DB', 
        borderRadius: 8, 
        backgroundColor: '#FFFFFF' 
    },
    passwordInput: { 
        flex: 1, 
        paddingHorizontal: 14, 
        paddingVertical: 12, 
        fontSize: 16 
    },
    eyeIcon: { 
        padding: 12 
    },
    otpContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        gap: 10, 
        marginBottom: 40 
    },
    otpInput: { 
        width: 45, 
        height: 50, 
        borderWidth: 0, 
        borderBottomWidth: 2, 
        textAlign: 'center', 
        fontSize: 24, 
        color: '#111827' 
    },
    primaryButton: { 
        backgroundColor: '#00A82D', 
        borderRadius: 8, 
        paddingVertical: 14, 
        alignItems: 'center', 
        width: '100%', 
        marginTop: 10 
    },
    primaryButtonText: { 
        color: '#FFFFFF', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    linkText: { 
        color: '#00A82D', 
        fontSize: 14, 
        fontWeight: '600', 
        marginTop: 20 
    },
    secondaryLinkText: { 
        color: '#00A82D', 
        fontSize: 14, 
        fontWeight: '600', 
        marginTop: 15 
    },
});
