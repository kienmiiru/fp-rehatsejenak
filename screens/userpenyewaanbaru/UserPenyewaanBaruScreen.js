import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, TextInput, ScrollView } from "react-native"
import { StyleSheet } from "react-native";
import { db } from "../../firebaseConfig";

const UserPenyewaanBaruScreen = () => {
    let [consoles, setConsoles] = useState([
        {
            name: 'PlayStation 5',
            rentalPrice: 60000,
            available: false,
            rentedUntil: {seconds: 1731517200}
        }
    ])

    useEffect(() => {
        async function fetchData() {
            try {
                let consoleSnapshot = await getDocs(collection(db, 'consoles'))

                let consoleDocuments = consoleSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))

                setConsoles(consoleDocuments)
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [])

    return (
        <View style={styles.container}>
            {
                consoles.map((con, index) => 
                    <View style={styles.card} key={index}>
                        <Text>Nama: {con.name}</Text>
                        <Text>Harga sewa per hari: Rp. {con.rentalPrice}</Text>
                        <Text>Tersedia: {con.available ? 'Ya' : `Tidak (sampai ${new Date(con.rentedUntil.seconds*1000).toDateString()})`}</Text>
                        {
                            con.available &&
                            <TouchableOpacity style={styles.button}>
                                <Text>Sewa</Text>
                            </TouchableOpacity>
                        }
                    </View>
                )
            }
        </View>
    )
}

export default UserPenyewaanBaruScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12
    },
    card: {
        borderWidth: 1,
        padding: 8,
        margin: 2,
        borderRadius: 8,
        width: '100%'
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