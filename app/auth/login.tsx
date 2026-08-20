import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Login() {
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image
                            source={require("../../assets/images/Frame.svg")}
                            style={styles.logo}
                        />
                        <TouchableOpacity>
                            <Text style={styles.businessLink}>Sign up your business</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Titles */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.mainTitle}>Sign up to find a job</Text>
                        <View style={styles.subtitleRow}>
                            <Text style={styles.subtitleText}>Already have an account? </Text>
                            <TouchableOpacity>
                                <Text style={styles.loginLink}>Log in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Google Button */}
                    <TouchableOpacity style={styles.googleButton}>
                        <AntDesign name="google" size={20} color="#DB4437" style={styles.googleIcon} />
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Inputs */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput 
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput 
                                style={styles.passwordInput}
                                secureTextEntry={!passwordVisible}
                            />
                            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                                <Ionicons name={passwordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Repeat password</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput 
                                style={styles.passwordInput}
                                secureTextEntry={!repeatPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setRepeatPasswordVisible(!repeatPasswordVisible)} style={styles.eyeIcon}>
                                <Ionicons name={repeatPasswordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Terms */}
                    <Text style={styles.termsText}>
                        By signing up, you confirm that you agree to{' '}
                        <Text style={styles.termsLink}>Terms & Conditions</Text>
                        {' '}and{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>

                    {/* Sign Up Button */}
                    <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/auth/signup')}>
                        <Text style={styles.signupButtonText}>Sign up</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 40,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 50,
        objectFit: 'contain',
    },
    businessLink: {
        color: '#00A82D',
        fontWeight: '600',
        fontSize: 16,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subtitleText: {
        color: '#6B7280',
        fontSize: 16,
    },
    loginLink: {
        color: '#00A82D',
        fontSize: 16,
        fontWeight: '500',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingVertical: 12,
        marginBottom: 24,
    },
    googleIcon: {
        marginRight: 12,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#9CA3AF',
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 12,
    },
    termsText: {
        color: '#6B7280',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 8,
        marginBottom: 24,
    },
    termsLink: {
        color: '#00A82D',
    },
    signupButton: {
        backgroundColor: '#00A82D',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});