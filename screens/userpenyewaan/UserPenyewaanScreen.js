import { collection, doc, getDocs, getDoc, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, TextInput, ScrollView } from "react-native"
import { StyleSheet } from "react-native";
import { db, auth } from "../../firebaseConfig";

const fetchConsoleDetails = async (rentalRecords) => {
    try {
        const consoleDetails = await Promise.all(
            rentalRecords.map(async (rr) => {
                const consoleRef = doc(db, "consoles", rr.consoleId);
                const consoleDocument = await getDoc(consoleRef);

                if (consoleDocument.exists()) {
                    return {
                        ...rr,
                        consoleName: consoleDocument.data().name,
                    };
                } else {
                    console.error(`Console with ID ${record.bookId} not found`);
                    return {
                        ...rr,
                        consoleName: "Konsol tidak ditemukan",
                    };
                }
            })
        )

        return consoleDetails;
    } catch (error) {
        console.error("Error saat fetch konsol:", error)
    }
}

export default UserPenyewaanScreen = ({ navigation }) => {
    let [rentalRecords, setRentalRecords] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                let q = query(collection(db, 'rentalRecords'), where('customerId', '==', auth.currentUser.uid))
                let rentalRecordSnapshot = await getDocs(q)

                let rentalRecordDocuments = rentalRecordSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))

                let rentalRecordsWithConsoleDetail = await fetchConsoleDetails(rentalRecordDocuments)
                setRentalRecords(rentalRecordsWithConsoleDetail)
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [])

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Penyewaan Baru')}>
                <Text>Ajukan Penyewaan Baru</Text>
            </TouchableOpacity>
            <ScrollView>
                {rentalRecords.map((rr, index) =>
                    <View style={styles.card} key={index}>
                        <Text>Tanggal awal sewa: {(new Date(rr.rentalDate.seconds*1000)).toDateString()}</Text>
                        <Text>Tanggal akhir sewa: {(new Date(rr.returnDate.seconds*1000)).toDateString()}</Text>
                        <Text>Biaya: Rp. {rr.price}</Text>
                        <Text>Konsol: {rr.consoleName}</Text>
                        <Text>Status transaksi: {{
                            'not paid': 'Belum dibayar',
                            'not taken': 'Belum diambil',
                            'not returned': 'Belum dikembalikan',
                            'finished': 'Selesai',
                            'cancelled': 'Dibatalkan'
                        }[rr.status]}</Text>
                        <Text>Kode referensi: {rr.transactionReferenceNumber || 'Belum dibayar'}</Text>
                        {
                            rr.status === 'not paid' &&
                            <TouchableOpacity style={styles.button}><Text>Bayar</Text></TouchableOpacity>
                        }
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        borderWidth: 1,
        padding: 8,
        margin: 2,
        borderRadius: 8,
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