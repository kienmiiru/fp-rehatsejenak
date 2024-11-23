import { getAuth, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, TextInput, ToastAndroid } from "react-native"
import { StyleSheet, Alert } from "react-native";
import { db, auth } from '../../firebaseConfig'
import { doc, getDoc } from "firebase/firestore";

async function logOut() {
    try {
        const auth = getAuth();
        await signOut(auth);
        ToastAndroid.show('Anda berhasil keluar', 6)
        return true
    } catch (error) {
        ToastAndroid.show('Error: ' + error, 6)
        return false
    }
}

export default UserMainMenuScreen = ({ navigation }) => {
    let [fullName, setFullname] = useState('')
    useEffect(() => {
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

        fetchData()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 32
            }}>Selamat datang, {'\n' + fullName}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Penyewaan')} style={styles.button}><Text>Lihat penyewaan</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => ToastAndroid.show('Belum jadi', 2)} style={styles.button}><Text>Pengaturan</Text></TouchableOpacity>
            <TouchableOpacity onPress={async () => {
                if (await logOut()) {
                    navigation.replace('Masuk')
                }
            }} style={styles.button}><Text>Keluar</Text></TouchableOpacity>
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