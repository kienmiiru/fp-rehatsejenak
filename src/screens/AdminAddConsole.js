import { useState } from "react"
import { Text, TouchableOpacity, View, TextInput, ToastAndroid, Alert } from "react-native"
import { StyleSheet } from "react-native";
import { db } from "../configs/firebaseConfig"
import { addDoc, collection } from "firebase/firestore"

let AdminAddConsoleScreen = ({ navigation }) => {
    let [name, setName] = useState('')
    let [rentalPrice, setRentalPrice] = useState(0)

    let addConsole = async (name, rentalPrice) => {
        try {
            await addDoc(collection(db, 'consoles'), {
                name,
                rentalPrice,
                available: true,
                visible: true,
                rentedUntil: ''
            })
            
            return true
        } catch (err) {
            console.error(error)
            Alert.alert('Error', 'Gagal menambahkan.')
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 18,
                textAlign: 'center'
            }}>Isikan Detail Konsol</Text>
            <Text>Nama: </Text>
            <TextInput autoCapitalize="none" value={name} onChangeText={e => setName(e)} style={styles.input} />
            
            <Text>Harga sewa per hari: </Text>
            <TextInput autoCapitalize="none" value={rentalPrice} onChangeText={e => setRentalPrice(parseInt(e))} style={styles.input} />
            
            <TouchableOpacity style={styles.button} onPress={async () => {
                if (await addConsole(name, rentalPrice)) {
                    navigation.goBack()
                }
            }}><Text style={styles.buttonText}>Tambahkan</Text></TouchableOpacity>
        </View>
    )
}

export default AdminAddConsoleScreen

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