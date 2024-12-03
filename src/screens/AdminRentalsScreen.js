import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../configs/firebaseConfig'
import PenyewaanBerlangsungItem from '../components/PenyewaanAdminItem'

import { fetchConsoleDetails, fetchCustomerDetails, fetchAdminDetails } from '../utils/utils'

let AdminRentalsScreen = () => {
    let [rentals, setRentals] = useState([])
    let [filter, setFilter] = useState('ongoing')

    // Fungsi untuk mengambil data penyewaan
    let fetchRentals = async () => {
        try {
            let statusFilter = filter == 'ongoing' ? ['not confirmed', 'not taken', 'not returned'] : ['finished', 'cancelled']
            let snapshot = await getDocs(collection(db, 'rentalRecords'))
            let ongoingRentals = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })).filter(rental => statusFilter.includes(rental.status))

            let withConsoleDetail = await fetchConsoleDetails(ongoingRentals, db)
            let withCustomerDetail = await fetchCustomerDetails(withConsoleDetail, db)
            let withAdminDetail = await fetchAdminDetails(withCustomerDetail, db)

            withAdminDetail.sort((a, b) => b.transactionDateCreated - a.transactionDateCreated)
            setRentals(withAdminDetail)
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Gagal mengambil data penyewaan.')
        }
    };

    // Fungsi untuk mengubah status penyewaan
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
                            fetchRentals()
                        } catch (error) {
                            console.error(error)
                            Alert.alert('Error', 'Gagal mengubah status.')
                        }
                    }
                }
            ]
        )
    }

    useEffect(() => {
        fetchRentals()
    }, [filter])

    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity style={[styles.button, filter == 'ongoing' && styles.boldBorder]} onPress={() => { setFilter('ongoing') }}>
                    <Text style={styles.buttonText}>Berlangsung</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, filter == 'finished' && styles.boldBorder]} onPress={() => { setFilter('finished') }}>
                    <Text style={styles.buttonText}>Selesai</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={rentals}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <PenyewaanBerlangsungItem rr={item} changeStatus={changeStatus} />
                )}
                ListEmptyComponent={<Text>Belum ada penyewaan yang sedang berlangsung.</Text>}
            />
        </View>
    );
};

let styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
    card: { padding: 16, marginBottom: 16, backgroundColor: '#fff', borderRadius: 8 },
    button: { padding: 12, backgroundColor: '#28a745', borderRadius: 8, marginVertical: 4 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    boldBorder: { borderWidth: 2 }
})

export default AdminRentalsScreen;
