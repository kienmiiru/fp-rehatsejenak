import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { timestampToDate, timestampToDateTime } from "../utils/utils"

export default ({ rr, changeStatus }) => {
    console.log('from item', rr)
    return (
        <View style={styles.card}>
            <Text style={styles.bold}>Nama Pelanggan</Text>
            <Text>{rr.customerName}</Text>

            <Text style={styles.bold}>Tanggal dibuat</Text>
            <Text>{timestampToDateTime(rr.transactionDateCreated)}</Text>

            <Text style={styles.bold}>Tanggal awal sewa</Text>
            <Text>{timestampToDate(rr.rentalDate)}</Text>

            <Text style={styles.bold}>Tanggal akhir sewa</Text>
            <Text>{timestampToDate(rr.returnDate)}</Text>

            <Text style={styles.bold}>Biaya</Text>
            <Text>Rp. {rr.price}</Text>

            <Text style={styles.bold}>Konsol</Text>
            <Text>{rr.consoleName}</Text>

            <Text style={styles.bold}>Status transaksi</Text>
            <Text>{{
                'not paid': 'Belum dibayar',
                'not confirmed': 'Menunggu konfirmasi',
                'not taken': 'Belum diambil',
                'not returned': 'Belum dikembalikan',
                'finished': 'Selesai',
                'cancelled': 'Dibatalkan'
            }[rr.status]}</Text>

            {
                rr.adminName &&
                <>
                    <Text style={styles.bold}>Dikonfirmasi oleh</Text>
                    <Text>{rr.adminName}</Text>
                </>
            }
            {
                rr.transactionReferenceNumber &&
                <>
                    <Text style={styles.bold}>Kode referensi</Text>
                    <Text>{rr.transactionReferenceNumber}</Text>
                </>
            }

            <View style={styles.actionButtons}>
                {rr.status === 'not confirmed' && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => changeStatus(rr.id, 'not taken')}
                    >
                        <Text style={styles.buttonText}>Konfirmasi Transaksi</Text>
                    </TouchableOpacity>
                )}
                {rr.status === 'not taken' && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => changeStatus(rr.id, 'not returned')}
                    >
                        <Text style={styles.buttonText}>Konfirmasi Pengambilan</Text>
                    </TouchableOpacity>
                )}
                {rr.status === 'not returned' && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => changeStatus(rr.id, 'finished', rr.consoleId)}
                    >
                        <Text style={styles.buttonText}>Konfirmasi Pengembalian</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

let styles = StyleSheet.create({
    bold: { fontWeight: 'bold' },
    card: { padding: 16, marginBottom: 16, backgroundColor: '#fff', borderRadius: 8, width: 300 },
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
})