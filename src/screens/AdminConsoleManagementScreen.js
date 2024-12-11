import { collection, getDocs, addDoc, doc, updateDoc, serverTimestamp, Timestamp, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Text, TouchableOpacity, View, FlatList, RefreshControl, Alert, Modal } from "react-native"
import { StyleSheet } from "react-native"
import { db } from "../configs/firebaseConfig"
import KonsolAdminItem from "../components/KonsolAdminItem"

let AdminConsoleManagementScreen = ({ navigation }) => {
    let [consoles, setConsoles] = useState([])
    let [refreshing, setRefreshing] = useState(false)

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

    let handleToggleConsole = (con) => {
        Alert.alert(
            "Konfirmasi",
            "Apakah Anda yakin ingin mengubah visibilitas konsol? Konsol yang dimatikan tidak akan bisa disewa pelanggan.",
            [
                { text: "Batal" },
                {
                    text: "Ya", onPress: async () => {
                        try {
                            let visible = !con.visible
                            let consoleRef = doc(db, 'consoles', con.id)
                            await updateDoc(consoleRef, {
                                visible
                            })
                            fetchData()
                        } catch (err) {
                            console.error(error)
                            Alert.alert('Error', 'Gagal mengubah status.')
                        }
                    }
                }
            ]
        )
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('Tambahkan Konsol')}}><Text>Tambah Konsol</Text></TouchableOpacity>
            <FlatList
                data={consoles}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <KonsolAdminItem con={item} onTogglePress={handleToggleConsole} />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<View style={styles.empty}><TouchableOpacity onPress={fetchData} style={styles.button}><Text>Reload</Text></TouchableOpacity></View>}
            />
        </View>
    )
}

export default AdminConsoleManagementScreen

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
})