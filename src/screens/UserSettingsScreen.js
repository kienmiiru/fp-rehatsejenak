import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native'
import { auth, db } from "../configs/firebaseConfig"
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

let UserSettingsScreen = () => {
    let [email, setEmail] = useState('')
    let [oldPassword, setOldPassword] = useState('')
    let [password, setPassword] = useState('')
    let [fullName, setFullName] = useState('')
    let [phoneNumber, setPhoneNumber] = useState('')
    let [address, setAddress] = useState('')
    let [loading, setLoading] = useState(false)

    let userId = auth.currentUser?.uid

    let fetchUserData = async () => {
        try {
            let userDoc = await getDoc(doc(db, 'customers', userId))
            if (userDoc.exists()) {
                let { fullName, phoneNumber, address } = userDoc.data()
                setFullName(fullName || '')
                setPhoneNumber(phoneNumber || '')
                setAddress(address || '')
            }
            setEmail(auth.currentUser.email)
        } catch (err) {
            console.error(err)
            Alert.alert('Error', 'Gagal memuat data pengguna')
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    let handleUpdateEmail = async () => {
        if (!email) {
            Alert.alert('Error', 'Email tidak boleh kosong')
            return
        }

        try {
            await updateEmail(auth.currentUser, email)
            Alert.alert('Sukses', 'Email berhasil diperbarui')
        } catch (err) {
            console.error(err)
            Alert.alert('Error', 'Gagal memperbarui email')
        }
    }

    let handleUpdatePassword = async () => {
        if (!password) {
            Alert.alert('Error', 'Kata sandi tidak boleh kosong')
            return
        }
    
        try {
            let credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword)
    
            await reauthenticateWithCredential(auth.currentUser, credential)
    
            await updatePassword(auth.currentUser, password)
            Alert.alert('Sukses', 'Kata sandi berhasil diperbarui')
        } catch (err) {
            if (err.code === 'auth/wrong-password') {
                Alert.alert('Error', 'Kata sandi saat ini salah')
            } else {
                console.error(err)
                Alert.alert('Error', 'Gagal memperbarui kata sandi')
            }
        }
    }

    let handleUpdateUserData = async () => {
        if (!fullName || !phoneNumber || !address) {
            Alert.alert('Error', 'Semua bidang harus diisi')
            return
        }

        setLoading(true)
        try {
            await setDoc(doc(db, 'customers', userId), {
                fullName,
                phoneNumber,
                address,
            }, { merge: true })
            Alert.alert('Sukses', 'Data pengguna berhasil diperbarui')
        } catch (err) {
            console.error(err)
            Alert.alert('Error', 'Gagal memperbarui data pengguna')
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Pengaturan Akun</Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
                    <Text style={styles.buttonText}>Perbarui Email</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Kata Sandi Saat Ini</Text>
                <TextInput
                    style={styles.input}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry
                />
                <Text style={styles.label}>Kata Sandi Baru</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
                    <Text style={styles.buttonText}>Perbarui Kata Sandi</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Nama Lengkap</Text>
                <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                />

                <Text style={styles.label}>Nomor Telepon</Text>
                <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Alamat</Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                />

                <TouchableOpacity style={styles.button} onPress={handleUpdateUserData} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Menyimpan...' : 'Perbarui Data Pengguna'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

let styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    scrollContainer: { padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    label: { fontSize: 14, marginBottom: 8, color: '#555' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    button: {
        padding: 12,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
})

export default UserSettingsScreen
