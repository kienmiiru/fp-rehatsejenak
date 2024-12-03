import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { signOut } from 'firebase/auth'
import { auth } from '../configs/firebaseConfig'

let AdminMainMenuScreen = ({ navigation, route }) => {
    let handleLogout = () => {
        signOut(auth)
            .then(() => {
                Alert.alert('Logout', 'Berhasil keluar.')
                navigation.replace('Masuk')
            })
            .catch(error => {
                console.error(error)
                Alert.alert('Error', 'Gagal logout.')
            })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selamat datang, {route.params.fullName}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Penyewaan Admin')}
            >
                <Text style={styles.buttonText}>Lihat Penyewaan</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Semua Pelanggan')}
            >
                <Text style={styles.buttonText}>Lihat Semua Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

let styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
    button: {
        padding: 12,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
        maxWidth: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#f44336',
    }
})

export default AdminMainMenuScreen
