import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, TextInput, ToastAndroid } from "react-native"
import { StyleSheet } from "react-native";
import { auth, db } from '../../firebaseConfig'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";


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

        ToastAndroid.show('Akun berhasil dibuat! Silahkan masuk', 6)

        return true
    } catch (err) {
        console.error(error)
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == 'auth/email-already-in-use') {
            ToastAndroid.show('Email ini sudah digunakan! Silahkan masuk atau mendaftar menggunakan email lain.', 6)
        } else {
            ToastAndroid.show('Error: (' + errorCode + ') ' + errorMessage, 6)
        }

        return false
    }
}

export default SignUpScreen = ({ navigation }) => {
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
            <TextInput value={email} onChangeText={e => setEmail(e)} inputMode="email" style={styles.input}></TextInput>
            
            <Text>Kata sandi: </Text>
            <TextInput value={password} onChangeText={e => setPassword(e)} style={styles.input} secureTextEntry={true}></TextInput>
            
            <Text>Konfirmasi kata sandi: </Text>
            <TextInput value={passwordConfirm} onChangeText={e => setPasswordConfirm(e)} style={styles.input} secureTextEntry={true}></TextInput>
            
            <Text>Nama lengkap: </Text>
            <TextInput value={fullName} onChangeText={e => setFullname(e)} style={styles.input}></TextInput>
            
            <Text>Nomor telepon: </Text>
            <TextInput value={phoneNumber} onChangeText={e => setPhoneNumber(e)} inputMode="tel" style={styles.input}></TextInput>
            
            <Text>Alamat: </Text>
            <TextInput value={address} onChangeText={e => setAddress(e)} style={styles.input}></TextInput>
            
            <TouchableOpacity style={styles.button} onPress={async () => {
                if (await register(email, password, passwordConfirm, fullName, phoneNumber, address)) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Masuk' }]
                   })
                }
            }}><Text>Daftar</Text></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
      backgroundColor: '#fff',
      borderWidth: 2,
      height: 40,
      width: 200,
      padding: 10,
      borderRadius: 12
    },
    button: {
        borderWidth: 1,
        borderRadius: 12,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        padding: 10,
        margin: 10,
        borderRadius: 12,
    }
})