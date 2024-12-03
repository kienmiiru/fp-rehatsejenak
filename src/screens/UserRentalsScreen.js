import { collection, doc, getDocs, getDoc, query, where, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Text, TouchableOpacity, View, FlatList, RefreshControl, Alert } from "react-native"
import { StyleSheet } from "react-native"
import { db, auth } from "../configs/firebaseConfig"
import PenyewaanItem from "../components/PenyewaanItem"
import { fetchConsoleDetails } from "../utils/utils"

let UserRentalsScreen = ({ navigation }) => {
    let [rentalRecords, setRentalRecords] = useState([])
    let [refreshing, setRefreshing] = useState(false)

    let fetchData = async () => {
        try {
            let q = query(collection(db, 'rentalRecords'), where('customerId', '==', auth.currentUser.uid))
            let rentalRecordSnapshot = await getDocs(q)

            let rentalRecordDocuments = rentalRecordSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            let rentalRecordsWithConsoleDetail = await fetchConsoleDetails(rentalRecordDocuments, db)
            rentalRecordsWithConsoleDetail.sort((a, b) => {
                let statuses = ['not paid', 'not confirmed', 'not taken', 'not returned', 'finished', 'cancelled']
                return statuses.indexOf(a.status) - statuses.indexOf(b.status)
            })
            setRentalRecords(rentalRecordsWithConsoleDetail)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => { fetchData() }, [])

    useEffect(() => {
        let focusListener = navigation.addListener('focus', async () => {
            fetchData()
        })
      
        return focusListener
    }, [navigation])

    let onRefresh = async () => {
        setRefreshing(true)
        await fetchData()
        setRefreshing(false)
    }

    let onPressBayar = (rr) => {
        navigation.navigate('Membayar Penyewaan', { rr })
    }

    let onPressBatalkan = (rr) => {
        Alert.alert(
            "Konfirmasi",
            "Apakah Anda yakin ingin membatalkan penyewaan?",
            [
                { text: "Tidak" },
                {
                    text: "Ya", onPress: async () => {
                        try {
                            let rrRef = doc(db, 'rentalRecords', rr.id)
                            await updateDoc(rrRef, {
                                status: 'cancelled'
                            })

                            let consoleRef = doc(db, 'consoles', rr.consoleId)
                            await updateDoc(consoleRef, {
                                available: true
                            })
                
                            fetchData()
                            Alert.alert('Berhasil', 'Penyewaan berhasil dibatalkan')
                        } catch (err) {
                            console.error(err)
                        }
                    }
                }
            ]
          )
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Penyewaan Baru')}>
                <Text style={styles.buttonText}>Ajukan Penyewaan Baru</Text>
            </TouchableOpacity>
            <FlatList
                data={rentalRecords}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <PenyewaanItem
                        rr={item}
                        onPressBayar={() => onPressBayar(item)}
                        onPressBatalkan={() => onPressBatalkan(item)}
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<View style={styles.empty}><TouchableOpacity onPress={fetchData} style={styles.button}><Text style={styles.buttonText}>Reload</Text></TouchableOpacity></View>}
            />
        </View>
    )
}

export default UserRentalsScreen

let styles = StyleSheet.create({
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
        padding: 12,
        margin: 10,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    empty: { flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center', marginTop: 50 }
})