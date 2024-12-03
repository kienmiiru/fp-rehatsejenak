import { signOut } from "firebase/auth"
import { useState, useEffect } from "react"
import { Text, TouchableOpacity, View, ToastAndroid } from "react-native"
import { StyleSheet } from "react-native"
import { db, auth } from "../configs/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"
import { Alert } from "react-native"

function logOut(navigation) {
    Alert.alert(
        "Konfirmasi",
        "Apakah Anda yakin untuk keluar?",
        [
            { text: "Batal" },
            {
                text: "Ya", onPress: async () => {
                    try {
                        await signOut(auth)
                        ToastAndroid.show('Anda berhasil keluar', ToastAndroid.SHORT)
                        navigation.replace('Masuk')
                    } catch (error) {
                        ToastAndroid.show('Error: ' + error, ToastAndroid.SHORT)
                        return false
                    }
                }
            }
        ]
    )
}

let UserMainMenuScreen = ({ navigation, route }) => {
    let [fullName, setFullname] = useState('')

    useEffect(() => {
        setFullname(route.params.fullName)
    }, [])

    async function fetchData() {
        try {
            let docRef = doc(db, 'customers', auth.currentUser.uid)
            let customerSnapshot = await getDoc(docRef)
            let customer = customerSnapshot.data()

            setFullname(customer['fullName'])
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        let focusListener = navigation.addListener('focus', () => {
            fetchData()
        });

        return focusListener
    }, [navigation])

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>
                Selamat datang, {'\n' + fullName}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Penyewaan')} style={styles.button}>
                <Text style={styles.buttonText}>Lihat Penyewaan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Pengaturan')} style={styles.button}>
                <Text style={styles.buttonText}>Pengaturan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => logOut(navigation)} style={[styles.button, styles.logoutButton]}>
                <Text style={styles.buttonText}>Keluar</Text>
            </TouchableOpacity>
        </View>
    );
}

export default UserMainMenuScreen;

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 30,
    },
    button: {
        padding: 12,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
        maxWidth: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#f44336',
    }
})
