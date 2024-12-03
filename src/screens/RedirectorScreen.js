import { Text, View } from "react-native"
import { StyleSheet } from "react-native"
import { db, auth } from "../configs/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"
import { useEffect } from "react"

let RedirectorScreen = ({ navigation }) => {
    let fetchUserData = async () => {
        try {
            let userDoc = await getDoc(doc(db, 'customers', auth.currentUser.uid))
            if (userDoc.exists()) {
                navigation.replace('Menu Utama', { fullName: userDoc.data()['fullName'] })
                return
            }

            let adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid))
            if (adminDoc.exists()) {
                navigation.replace('Menu Admin', { fullName: adminDoc.data()['fullName'] })
                return
            }
        } catch (err) {
            console.error(err)
            Alert.alert('Error', 'Gagal memuat data pengguna')
        }
    };

    useEffect(() => {
        fetchUserData()
    }, []);

    return (
        <View>
            <Text style={{
                fontSize: 32
            }}>Loading...</Text>
        </View>
    )
}

export default RedirectorScreen