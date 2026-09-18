import BrandLogo from '../../components/BrandLogo';
import React, { useState, useRef } from 'react';
import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const countryCodes = [
    { label: '🇺🇸 +1', value: '+1' },
    { label: '🇬🇧 +44', value: '+44' },
    { label: '🇮🇳 +91', value: '+91' },
    { label: '🇦🇺 +61', value: '+61' },
    { label: '🇨🇦 +1', value: '+1' },
    { label: '🇩🇪 +49', value: '+49' },
    { label: '🇫🇷 +33', value: '+33' },
    { label: '🇯🇵 +81', value: '+81' },
    { label: '🇧🇷 +55', value: '+55' },
    { label: '🇿🇦 +27', value: '+27' },
];

export default function SignupFlow() {
    const router = useRouter();
    const [step, setStep] = useState(0);

    // Form states
    const [emailOTP, setEmailOTP] = useState(['', '', '', '', '', '']);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneOTP, setPhoneOTP] = useState(['', '', '', '', '', '']);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [resumeFile, setResumeFile] = useState<{name: string, uri: string} | null>(null);

    // Refs for OTP inputs
    const emailOTPRefs = useRef<Array<TextInput | null>>([]);
    const phoneOTPRefs = useRef<Array<TextInput | null>>([]);

    const handleEmailOTPChange = (text: string, index: number) => {
        const newOTP = [...emailOTP];
        newOTP[index] = text;
        setEmailOTP(newOTP);
        if (text && index < 5) {
            emailOTPRefs.current[index + 1]?.focus();
        }
    };

    const handlePhoneOTPChange = (text: string, index: number) => {
        const newOTP = [...phoneOTP];
        newOTP[index] = text;
        setPhoneOTP(newOTP);
        if (text && index < 5) {
            phoneOTPRefs.current[index + 1]?.focus();
        }
    };

    const verifyOTP = async (otpArray: string[]) => {
        const otpString = otpArray.join('');
        if (otpString === '123456') {
            return true;
        }
        Alert.alert("Error", "Invalid OTP. Please use 123456.");
        return false;
    };

    const handleNext = async () => {
        if (step === 0) {
            const isValid = await verifyOTP(emailOTP);
            if (isValid) setStep(1);
        } else if (step === 1) {
            if (!firstName || !lastName) {
                Alert.alert("Error", "Please enter first and last name");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!zipCode) {
                Alert.alert("Error", "Please enter your ZIP code");
                return;
            }
            setStep(3);
        } else if (step === 3) {
            if (!phoneNumber) {
                Alert.alert("Error", "Please enter your phone number");
                return;
            }
            setStep(4);
        } else if (step === 4) {
            const isValid = await verifyOTP(phoneOTP);
            if (isValid) setStep(5);
        } else if (step === 5) {
            setStep(6);
        }
    };

    const handleSkip = () => {
        if (step === 5) setStep(6);
        else if (step === 6) {
            Alert.alert("Success", "Signup Complete!");
            router.replace('/auth/login');
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
        });
        if (result.canceled === false) {
            setResumeFile({ name: result.assets[0].name, uri: result.assets[0].uri });
        }
    };

    const renderProgressBar = () => {
        if (step === 0) return null;
        
        let activeStep = 1;
        if (step === 1) activeStep = 1;
        if (step === 2) activeStep = 2;
        if (step >= 3 && step <= 4) activeStep = 3;
        if (step === 5) activeStep = 4;
        if (step === 6) activeStep = 5;

        return (
            <View style={styles.progressBarContainer}>
                {[1, 2, 3, 4, 5].map((s) => (
                    <View 
                        key={s} 
                        style={[
                            styles.progressSegment, 
                            s <= activeStep ? styles.progressSegmentActive : styles.progressSegmentInactive
                        ]} 
                    />
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {step > 0 && (
                            <TouchableOpacity onPress={() => setStep(step - 1)}>
                                <Ionicons name="arrow-back" size={24} color="black" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <BrandLogo style={styles.logo} />
                    <View style={styles.headerRight}>
                        {(step === 5 || step === 6) && (
                            <TouchableOpacity onPress={handleSkip}>
                                <Text style={styles.skipText}>Skip</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {renderProgressBar()}

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    
                    {/* STEP 0: Email OTP */}
                    {step === 0 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.title}>Confirm your email</Text>
                            <Text style={styles.subtitle}>Please enter the code we've sent to youremail@hotmail.com</Text>
                            
                            <View style={styles.otpContainer}>
                                {emailOTP.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => (emailOTPRefs.current[index] = el)}
                                        style={styles.otpInput}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(text) => handleEmailOTPChange(text, index)}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity>
                                <Text style={styles.resendText}>Send code again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.bottomNextBtn} onPress={handleNext}>
                                <Text style={styles.signupButtonText}>Verify Email</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* STEP 1: Name */}
                    {step === 1 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.stepIndicator}>STEP 1/5</Text>
                            <Text style={styles.title}>Welcome to ShiftQuest! Let's take a few steps to complete your profile.</Text>
                            <Text style={styles.subtitle}>First, please enter your name</Text>
                            
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>First name</Text>
                                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Last name</Text>
                                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
                            </View>
                        </View>
                    )}

                    {/* STEP 2: Location */}
                    {step === 2 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.stepIndicator}>STEP 2/5</Text>
                            <Text style={styles.title}>Enter your location</Text>
                            <Text style={styles.subtitle}>We will display the most relevant jobs based on your location</Text>
                            
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>ZIP</Text>
                                <TextInput style={styles.input} value={zipCode} onChangeText={setZipCode} keyboardType="numeric" />
                            </View>
                        </View>
                    )}

                    {/* STEP 3: Phone Number */}
                    {step === 3 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.stepIndicator}>STEP 3/5</Text>
                            <Text style={styles.title}>Enter your phone number</Text>
                            <Text style={styles.subtitle}>Phone number will help protect your account as well as let employers contact you much easier</Text>
                            
                            <Text style={styles.label}>Phone number</Text>
                            <View style={styles.phoneInputContainer}>
                                <TouchableOpacity style={styles.countryCodeSelector} onPress={() => setShowCountryPicker(!showCountryPicker)}>
                                    <Text>{countryCodes.find(c => c.value === countryCode)?.label.split(' ')[0]} {countryCode}</Text>
                                    <Ionicons name="chevron-down" size={16} color="gray" />
                                </TouchableOpacity>
                                <TextInput 
                                    style={styles.phoneInput} 
                                    value={phoneNumber} 
                                    onChangeText={setPhoneNumber} 
                                    keyboardType="phone-pad" 
                                    placeholder="(902) 123 45 67" 
                                />
                            </View>
                            
                            {showCountryPicker && (
                                <View style={styles.countryPicker}>
                                    <ScrollView style={{maxHeight: 150}}>
                                        {countryCodes.map((item, index) => (
                                            <TouchableOpacity 
                                                key={index} 
                                                style={styles.countryPickerItem} 
                                                onPress={() => { setCountryCode(item.value); setShowCountryPicker(false); }}
                                            >
                                                <Text>{item.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    )}

                    {/* STEP 4: Phone OTP */}
                    {step === 4 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.stepIndicator}>STEP 3/5</Text>
                            <Text style={styles.title}>Confirm your phone number</Text>
                            <Text style={styles.subtitle}>Please enter the code we've sent to {countryCode} {phoneNumber}</Text>
                            
                            <View style={styles.otpContainer}>
                                {phoneOTP.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => (phoneOTPRefs.current[index] = el)}
                                        style={styles.otpInput}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(text) => handlePhoneOTPChange(text, index)}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity>
                                <Text style={styles.resendText}>Send code again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginTop: 20}}>
                                <Text style={[styles.resendText, {fontWeight: 'normal'}]}>Enter a different phone number</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* STEP 5: Profile Image */}
                    {step === 5 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.stepIndicator}>STEP 4/5</Text>
                            <Text style={styles.title}>Upload a profile picture</Text>
                            
                            <View style={styles.imageUploadContainer}>
                                <TouchableOpacity onPress={pickImage} style={styles.imageCircle}>
                                    {profileImage ? (
                                        <Image source={{uri: profileImage}} style={styles.profileImage} />
                                    ) : (
                                        <View style={styles.placeholderImage}>
                                            <Ionicons name="person-outline" size={60} color="white" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                                
                                <TouchableOpacity onPress={pickImage}>
                                    <Text style={styles.resendText}>{profileImage ? "Choose a different image" : "Upload image"}</Text>
                                </TouchableOpacity>
                                
                                <Text style={styles.hintText}>
                                    Recommended resolution is 300x300 px.{'\n'}
                                    Max size - 2 MB.{'\n'}
                                    Allowed formats: *jpg, *jpeg, *png, *gif
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* STEP 6: Resume */}
                    {step === 6 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.stepIndicator}>STEP 5/5</Text>
                            <Text style={styles.title}>Upload your resume</Text>
                            
                            <TouchableOpacity style={[styles.resumeUploadBox, resumeFile && styles.resumeUploadBoxActive]} onPress={pickDocument}>
                                {resumeFile ? (
                                    <View style={styles.resumeFileContainer}>
                                        <Feather name="file-text" size={24} color="#00A82D" />
                                        <View style={{marginLeft: 12, flex: 1}}>
                                            <Text style={styles.fileNameText}>{resumeFile.name}</Text>
                                            <Text style={styles.fileSizeText}>Uploaded</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => setResumeFile(null)}>
                                            <Feather name="trash-2" size={20} color="gray" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <>
                                        <Feather name="file-text" size={32} color="gray" />
                                        <Text style={styles.uploadMainText}>Click to upload your CV</Text>
                                        <Text style={styles.uploadSubText}>Max size 5 MB</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            {!resumeFile && (
                                <>
                                    <View style={styles.dividerContainer}>
                                        <View style={styles.dividerLine} />
                                        <Text style={styles.dividerText}>or</Text>
                                        <View style={styles.dividerLine} />
                                    </View>
                                    <TouchableOpacity style={styles.genericBtn}>
                                        <Text style={styles.genericBtnText}>Fill a generic application instead</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    )}

                </ScrollView>

                {/* Bottom Action Button */}
                {step > 0 && (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity 
                            style={[
                                styles.nextButton, 
                                (step === 6 && !resumeFile) ? styles.nextButtonDisabled : {}
                            ]} 
                            onPress={step === 6 ? handleSkip : handleNext}
                            disabled={step === 6 && !resumeFile}
                        >
                            <Text style={styles.signupButtonText}>
                                {step === 6 ? "Save & Finish" : "Next"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
    headerLeft: { width: 50 },
    logo: { width: 142, height: 40 },
    headerRight: { width: 50, alignItems: 'flex-end' },
    skipText: { color: 'black', fontSize: 16 },
    progressBarContainer: { flexDirection: 'row', paddingHorizontal: 40, justifyContent: 'center', marginBottom: 20 },
    progressSegment: { height: 4, width: 30, marginHorizontal: 4, borderRadius: 2 },
    progressSegmentActive: { backgroundColor: '#00A82D' },
    progressSegmentInactive: { backgroundColor: '#E5E7EB' },
    scrollContainer: { paddingHorizontal: 24, paddingBottom: 100 },
    stepContainer: { alignItems: 'center', marginTop: 10, width: '100%' },
    stepIndicator: { fontSize: 12, fontWeight: 'bold', color: 'gray', letterSpacing: 1, marginBottom: 12 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 30, paddingHorizontal: 10 },
    
    // Inputs
    inputContainer: { width: '100%', marginBottom: 16 },
    label: { fontSize: 14, color: '#4B5563', marginBottom: 6, alignSelf: 'flex-start' },
    input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, backgroundColor: '#FFFFFF', width: '100%' },
    
    // OTP
    otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 30 },
    otpInput: { width: 45, height: 50, borderWidth: 0, borderBottomWidth: 2, borderColor: '#D1D5DB', textAlign: 'center', fontSize: 24 },
    resendText: { color: '#00A82D', fontSize: 16, fontWeight: '600', marginTop: 10 },

    // Phone
    phoneInputContainer: { flexDirection: 'row', width: '100%', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, overflow: 'hidden' },
    countryCodeSelector: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRightWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#F9FAFB', gap: 4 },
    phoneInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
    countryPicker: { position: 'absolute', top: 80, left: 0, right: 0, backgroundColor: 'white', borderWidth: 1, borderColor: '#eee', zIndex: 10, elevation: 5, borderRadius: 8 },
    countryPickerItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },

    // Image Upload
    imageUploadContainer: { alignItems: 'center', marginTop: 20 },
    imageCircle: { width: 140, height: 140, borderRadius: 70, overflow: 'hidden', backgroundColor: '#00A82D', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    profileImage: { width: '100%', height: '100%' },
    placeholderImage: { justifyContent: 'center', alignItems: 'center' },
    hintText: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, lineHeight: 20, marginTop: 20 },

    // Resume Upload
    resumeUploadBox: { width: '100%', borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 12, padding: 30, alignItems: 'center', marginTop: 10 },
    resumeUploadBoxActive: { borderColor: '#00A82D', backgroundColor: '#F0FDF4', borderStyle: 'solid' },
    uploadMainText: { fontSize: 16, fontWeight: '600', color: '#374151', marginTop: 12 },
    uploadSubText: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
    resumeFileContainer: { flexDirection: 'row', alignItems: 'center', width: '100%' },
    fileNameText: { fontSize: 14, fontWeight: '600', color: '#111827' },
    fileSizeText: { fontSize: 12, color: '#6B7280' },
    
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, width: '100%' },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
    dividerText: { marginHorizontal: 16, color: '#9CA3AF', fontSize: 14 },
    genericBtn: { backgroundColor: '#ECFDF5', paddingVertical: 14, borderRadius: 8, width: '100%', alignItems: 'center' },
    genericBtnText: { color: '#00A82D', fontSize: 14, fontWeight: '600' },

    // Bottom Bar
    bottomBar: { paddingHorizontal: 24, paddingVertical: 20, backgroundColor: 'white' },
    nextButton: { backgroundColor: '#00A82D', borderRadius: 8, paddingVertical: 16, alignItems: 'center' },
    nextButtonDisabled: { backgroundColor: '#D1D5DB' },
    signupButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    bottomNextBtn: { backgroundColor: '#00A82D', borderRadius: 8, paddingVertical: 16, alignItems: 'center', width: '100%', marginTop: 20 }
});
