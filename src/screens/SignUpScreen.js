import { useState } from "react"
import { Text, TouchableOpacity, View, TextInput, ToastAndroid, Alert } from "react-native"
import { StyleSheet } from "react-native";
import { auth, db } from "../configs/firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

async function register(email, password, passwordConfirm, fullName, phoneNumber, address) {
    if (!email || !password || !passwordConfirm || !fullName || !phoneNumber || !address) {
        ToastAndroid.show('Semua harus diisi', 2)
        return
    }
    if (password !== passwordConfirm) {
        ToastAndroid.show('Password tidak cocok', 2)
    }

    try {
        let userCredential = await createUserWithEmailAndPassword(auth, email, password)
        let user = userCredential.user

        await setDoc(doc(db, 'customers', user.uid), {
            address, fullName, phoneNumber
        })

        ToastAndroid.show('Akun berhasil dibuat!', 6)

        return true
    } catch (err) {
        console.error(err)
        let errorCode = err.code;
        let errorMessage = err.message;
        if (errorCode == 'auth/email-already-in-use') {
            Alert.alert('Kesalahan', 'Email ini sudah digunakan! Silahkan masuk atau mendaftar menggunakan email lain')
        } else {
            Alert.alert('Kesalahan', 'Error: (' + errorCode + ') ' + errorMessage)
        }

        return false
    }
}

let SignUpScreen = ({ navigation }) => {
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [passwordConfirm, setPasswordConfirm] = useState('')
    let [fullName, setFullname] = useState('')
    let [phoneNumber, setPhoneNumber] = useState('')
    let [address, setAddress] = useState('')

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 18,
                textAlign: 'center'
            }}>Silahkan mendaftar</Text>
            <Text>Alamat e-mail: </Text>
            <TextInput autoCapitalize="none" value={email} onChangeText={e => setEmail(e)} inputMode="email" style={styles.input} />
            
            <Text>Kata sandi: </Text>
            <TextInput autoCapitalize="none" value={password} onChangeText={e => setPassword(e)} style={styles.input} secureTextEntry={true} />
            
            <Text>Konfirmasi kata sandi: </Text>
            <TextInput autoCapitalize="none" value={passwordConfirm} onChangeText={e => setPasswordConfirm(e)} style={styles.input} secureTextEntry={true} />
            
            <Text>Nama lengkap: </Text>
            <TextInput value={fullName} onChangeText={e => setFullname(e)} style={styles.input} />
            
            <Text>Nomor telepon: </Text>
            <TextInput autoCapitalize="none" value={phoneNumber} onChangeText={e => setPhoneNumber(e)} inputMode="tel" style={styles.input} />
            
            <Text>Alamat: </Text>
            <TextInput value={address} onChangeText={e => setAddress(e)} style={styles.input} />
            
            <TouchableOpacity style={styles.button} onPress={async () => {
                if (await register(email, password, passwordConfirm, fullName, phoneNumber, address)) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Masuk' }]
                   })
                }
            }}><Text style={styles.buttonText}>Daftar</Text></TouchableOpacity>
        </View>
    )
}

export default SignUpScreen

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        padding: 12
    },
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