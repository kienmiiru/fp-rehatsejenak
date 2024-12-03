import { collection, getDocs, addDoc, doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Text, TouchableOpacity, View, FlatList, RefreshControl, Alert, Modal } from "react-native"
import { StyleSheet } from "react-native"
import { auth, db } from "../configs/firebaseConfig"
import KonsolItem from "../components/KonsolItem"

let UserNewRentalScreen = ({ navigation }) => {
    let [consoles, setConsoles] = useState([])
    let [refreshing, setRefreshing] = useState(false)
    let [selectedConsole, setSelectedConsole] = useState(null)
    let [modalVisible, setModalVisible] = useState(false)
    let [rentalDays, setRentalDays] = useState(2)

    let fetchData = async () => {
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

    useEffect(() => { fetchData() }, [])

    let onRefresh = async () => {
        setRefreshing(true)
        await fetchData()
        setRefreshing(false)
    }

    let addRentalRecord = async (con, rentalDate, returnDate) => {
        try {
            let days = (returnDate - rentalDate) / (1000*60*60*24)
            let price = con.rentalPrice * days

            addDoc(collection(db, 'rentalRecords'), {
                consoleId: con.id,
                customerId: auth.currentUser.uid,
                price,
                rentalDate: Timestamp.fromDate(rentalDate),
                returnDate: Timestamp.fromDate(returnDate),
                status: 'not paid',
                transactionDateCreated: serverTimestamp(),
                transactionReferenceNumber: ''
            })

            let consoleRef = doc(db, 'consoles', con.id)
            await updateDoc(consoleRef, {
                available: false
            })

            Alert.alert('Berhasil', 'Penyewaan berhasil ditambahkan')
            navigation.goBack()
        } catch (err) {
            console.error(err)
            Alert.alert('Error', 'Terjadi kesalahan')
        }
    }

    let handleRentPress = (con) => {
        setSelectedConsole(con)
        setRentalDays(2) // Set default rental days
        setModalVisible(true)
    }

    let handleConfirmRental = async () => {
        Alert.alert(
            "Konfirmasi",
            "Apakah Anda yakin ingin melanjutkan penyewaan?",
            [
                { text: "Batal" },
                {
                    text: "Ya", onPress: async () => {
                        let rentalDate = new Date()
                        let returnDate = new Date(rentalDate.getTime() + rentalDays * 24 * 60 * 60 * 1000)
                        if (selectedConsole) {
                            await addRentalRecord(selectedConsole, rentalDate, returnDate)
                            setModalVisible(false)
                        }
                    }
                }
            ]
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={consoles}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <KonsolItem con={item} onRentPress={handleRentPress} />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<View style={styles.empty}><TouchableOpacity onPress={fetchData} style={styles.button}><Text>Reload</Text></TouchableOpacity></View>}
            />

            {/* Modal */}
            {selectedConsole && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Konfirmasi Penyewaan</Text>
                            <Text>Nama Konsol: {selectedConsole.name}</Text>
                            <Text>Harga per hari: Rp. {selectedConsole.rentalPrice}</Text>
                            <Text>Durasi penyewaan: {rentalDays} hari</Text>
                            <Text>
                                Total Harga: Rp. {selectedConsole.rentalPrice * rentalDays}
                            </Text>

                            <View style={styles.buttonGroup}>
                                {[2, 3, 4, 5, 6, 7].map((day) => (
                                    <TouchableOpacity
                                        key={day}
                                        style={[
                                            styles.dayButton,
                                            rentalDays === day && styles.selectedDayButton,
                                        ]}
                                        onPress={() => setRentalDays(day)}
                                    >
                                        <Text style={ { color: rentalDays === day ? 'white' : 'black' } }>{day} Hari</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text>Batal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmRental}>
                                    <Text>Konfirmasi</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    )
}

export default UserNewRentalScreen

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12
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
    },
    empty: { flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 8 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    buttonGroup: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginVertical: 16 },
    dayButton: { width: 75, padding: 10, borderWidth: 1, borderColor: '#007bff', borderRadius: 8, marginVertical: 8 },
    selectedDayButton: { backgroundColor: '#007bff', color: '#ffff00' },
    actionButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    cancelButton: { padding: 12, backgroundColor: '#ccc', borderRadius: 8 },
    confirmButton: { padding: 12, backgroundColor: '#28a745', borderRadius: 8 },
})