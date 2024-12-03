import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../configs/firebaseConfig'

let AdminCustomersScreen = ({ navigation }) => {
    let [customers, setCustomers] = useState([])

    let fetchCustomers = async () => {
        try {
            let snapshot = await getDocs(collection(db, 'customers'))
            let customerList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setCustomers(customerList);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Gagal mengambil data customer.')
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={customers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('Detail Pelanggan', { customerId: item.id })}
                    >
                        <Text>Nama: {item.fullName}</Text>
                        <Text>Nomor Telepon: {item.phoneNumber}</Text>
                        <Text>Alamat: {item.address}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>Tidak ada customer.</Text>}
            />
        </View>
    );
};

let styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
    card: { padding: 16, marginBottom: 16, backgroundColor: '#fff', borderRadius: 8 },
})

export default AdminCustomersScreen;
