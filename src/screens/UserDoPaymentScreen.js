import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native"
import { StyleSheet } from "react-native"
import { db } from "../configs/firebaseConfig"

let UserDoPaymentScreen =  ({ route, navigation }) => {
    let { rr } = route.params
    let [transactionReferenceNumber, setTransactionReferenceNumber] = useState(rr.transactionReferenceNumber || '')
    let [bankDetail, setBankDetail] = useState({
        accountOwner: 'Loading',
        accoutNumber: 'Loading',
        bankName: 'Loading'
    })

    let fetchBankDetail = async () => {
        try {
            let bankDetailRef = doc(db, 'bankAccountDetail', 'bank')
            let bankDetailSnap = await getDoc(bankDetailRef)
            let bankDetailData = bankDetailSnap.data()

            setBankDetail(bankDetailData)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => { fetchBankDetail() }, [])

    let update = async () => {
        try {
            let rrRef = doc(db, 'rentalRecords', rr.id)
            
            await updateDoc(rrRef, {
                transactionReferenceNumber,
                status: 'not confirmed'
            })

            Alert.alert('Berhasil', 'Kode referensi berhasil dicatat. Silahkan tunggu konfirmasi')
            navigation.goBack()
        } catch (err) {
            console.error('Error adding data: ', err)
            Alert.alert('Error', 'Terjadi kesalahan')
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Membayar penyewaan:</Text>
            <Text>Tanggal awal sewa: {(new Date(rr.rentalDate.seconds*1000)).toDateString()}</Text>
            <Text>Tanggal akhir sewa: {(new Date(rr.returnDate.seconds*1000)).toDateString()}</Text>
            <Text>Biaya: Rp. {rr.price}</Text>
            <Text>Konsol: {rr.consoleName}</Text>
            <Text style={styles.desc}>{`
Langkah-langkah membayar:
1. Transfer ke nomor rekening ${bankDetail.accoutNumber} (${bankDetail.bankName}) atas nama ${bankDetail.accountOwner} sesuai dengan biaya di atas
2. Catat kode referensi dan isikan pada kotak di bawah
3. Tunggu hingga admin mengonfirmasi pembayaran
            `}</Text>
            <TextInput style={styles.input} autoCapitalize="none" value={transactionReferenceNumber} onChangeText={e => setTransactionReferenceNumber(e)} />
            <TouchableOpacity onPress={update} style={styles.button}><Text>Kirim</Text></TouchableOpacity>
        </View>
    )
}

export default UserDoPaymentScreen

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    desc: {
        fontSize: 16
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
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        padding: 10,
        margin: 10,
        borderRadius: 12,
    }
})