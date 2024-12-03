import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native'
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore'
import { db } from '../configs/firebaseConfig'

import { fetchConsoleDetails, fetchAdminDetails } from '../utils/utils'
import PenyewaanAdminItem from '../components/PenyewaanAdminItem'

let AdminCustomerDetailsScreen = ({ route }) => {
    let { customerId } = route.params
    let [customer, setCustomer] = useState(null)
    let [rentals, setRentals] = useState([])

    let changeStatus = async (rentalId, newStatus, consoleId) => {
        Alert.alert(
            "Konfirmasi",
            "Apakah Anda yakin ingin mengubah status penyewaan ini?",
            [
                { text: "Batal" },
                {
                    text: "Ya", onPress: async () => {
                        try {
                            await updateDoc(doc(db, 'rentalRecords', rentalId), {
                                status: newStatus,
                                confirmedBy: auth.currentUser.uid,
                            })

                            if (newStatus == 'finished') {
                                let consoleRef = doc(db, 'consoles', consoleId)
                                await updateDoc(consoleRef, {
                                    available: true
                                })
                            }

                            Alert.alert('Sukses', `Status berhasil diubah ke "${newStatus}".`)
                            fetchCustomerDetails()
                        } catch (error) {
                            console.error(error)
                            Alert.alert('Error', 'Gagal mengubah status.')
                        }
                    }
                }
            ]
        )
    }

    let fetchCustomerDetails = async () => {
        try {
            let customerDoc = await getDoc(doc(db, 'customers', customerId))
            setCustomer({ id: customerDoc.id, ...customerDoc.data() })

            let rentalQuery = query(
                collection(db, 'rentalRecords'),
                where('customerId', '==', customerId)
            );
            let rentalSnapshot = await getDocs(rentalQuery)
            let rentalList = rentalSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                customerName: customerDoc.data().fullName
            }))

            let withAdminDetail = await fetchAdminDetails(rentalList, db)
            let withConsoleDetail = await fetchConsoleDetails(withAdminDetail, db)
            withConsoleDetail.sort((a, b) => b.transactionDateCreated - a.transactionDateCreated)
            console.log('lee', withConsoleDetail)
            setRentals(withConsoleDetail)
        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'Gagal mengambil detail customer.')
        }
    };

    useEffect(() => {
        fetchCustomerDetails()
    }, [])

    return (
        <View style={styles.container}>
            {customer && (
                <View style={styles.card}>
                    <Text>Nama: {customer.fullName}</Text>
                    <Text>Email: {customer.email}</Text>
                </View>
            )}
            <Text style={styles.title}>Riwayat Penyewaan:</Text>
            <FlatList
                data={rentals}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <PenyewaanAdminItem rr={item} changeStatus={changeStatus} />
                )}
                ListEmptyComponent={<Text>Belum ada riwayat penyewaan.</Text>}
            />
        </View>
    )
}

let styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
    card: { padding: 16, marginBottom: 16, backgroundColor: '#fff', borderRadius: 8 },
    title: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
})

export default AdminCustomerDetailsScreen
