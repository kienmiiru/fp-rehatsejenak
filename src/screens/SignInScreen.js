import { useEffect, useState } from "react"
import { Text, TouchableOpacity, View, TextInput, Alert } from "react-native"
import { StyleSheet } from "react-native"
import { auth } from "../configs/firebaseConfig"
import { signInWithEmailAndPassword } from "firebase/auth"

async function login(email, password) {
    if (!email || !password) {
        ToastAndroid.show('Mohon isi email dan kata sandi', 2)
        return
    }

    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password)
        let user = userCredential.user
        // console.log(user)

        return true
    } catch (error) {
        let errorCode = error.code
        let errorMessage = error.message

        if (errorCode === 'auth/invalid-credential') {
            Alert.alert('Kesalahan', 'Email atau kata sandi salah!')
        } else {
            Alert.alert('Kesalahan', 'Error: (' + errorCode + ') ' + errorMessage)
        }

        return false
    }
}

let SignInScreen = ({ navigation }) => {
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

    useEffect(() => {
        if (auth.currentUser) {
            navigation.replace('Redirecting')
        }
    }, [])

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 18,
                textAlign: 'center'
            }}>Silahkan masuk</Text>
            <Text>Alamat e-mail: </Text>
            <TextInput autoCapitalize="none" value={email} onChangeText={e => setEmail(e)} style={styles.input} />

            <Text>Kata sandi: </Text>
            <TextInput autoCapitalize="none" value={password} onChangeText={e => setPassword(e)} style={styles.input} secureTextEntry={true} />

            <TouchableOpacity onPress={async () => {
                if (await login(email, password)) {
                    navigation.replace('Redirecting')
                }
            }} style={styles.button}>
                <Text style={styles.buttonText}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Daftar')}>
                <Text style={{
                    fontSize: 12,
                    textAlign: 'center'
                }}>Tekan di sini untuk mendaftar</Text>
            </TouchableOpacity>
        </View>
    )
}
export default SignInScreen

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