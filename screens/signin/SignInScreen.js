import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, TextInput, ToastAndroid } from "react-native"
import { StyleSheet } from "react-native";
import { auth } from '../../firebaseConfig'
import { signInWithEmailAndPassword } from "firebase/auth";

async function login(email, password) {
    if (!email || !password) {
        ToastAndroid.show('Mohon isi email dan kata sandi', 2)
        return
    }

    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password)
        let user = userCredential.user
        console.log(user)

        return true
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/invalid-credential') {
            ToastAndroid.show('Email atau kata sandi salah!', 4)
        } else {
            ToastAndroid.show('Error: (' + errorCode + ') ' + errorMessage, 6)
        }

        return false
    }
}

export default SignInScreen = ({ navigation }) => {
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

    useEffect(() => {
        if (auth.currentUser) {
            navigation.replace('Menu Utama')
        }
    }, [])

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 18,
                textAlign: 'center'
            }}>Silahkan masuk</Text>
            <Text>Alamat e-mail: </Text>
            <TextInput value={email} onChangeText={e => setEmail(e)} style={styles.input}></TextInput>

            <Text>Kata sandi: </Text>
            <TextInput value={password} onChangeText={e => setPassword(e)} style={styles.input} secureTextEntry={true}></TextInput>

            <TouchableOpacity onPress={async () => {
                if (await login(email, password)) {
                    navigation.replace('Menu Utama')
                }
            }} style={styles.button}>
                <Text>Masuk</Text>
            </TouchableOpacity>
            <Text onPress={() => navigation.navigate('Daftar')} style={{
                fontSize: 12,
                textAlign: 'center'
            }}>Tekan di sini untuk mendaftar</Text>
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