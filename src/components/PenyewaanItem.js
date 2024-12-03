import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

export default ({ rr, onPressBayar, onPressBatalkan }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.bold}>Tanggal awal sewa</Text>
            <Text>{(new Date(rr.rentalDate.seconds*1000)).toDateString()}</Text>
            <Text style={styles.bold}>Tanggal akhir sewa</Text>
            <Text>{(new Date(rr.returnDate.seconds*1000)).toDateString()}</Text>
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
            <Text style={styles.bold}>Kode referensi</Text>
            <Text>{rr.transactionReferenceNumber || 'Belum dibayar'}</Text>
            { rr.status == 'not paid' &&
                    <TouchableOpacity onPress={onPressBayar} style={styles.button}>
                        <Text style={styles.buttonText}>Bayar</Text>
                    </TouchableOpacity>
            }
            { rr.status == 'not paid' &&
                <TouchableOpacity onPress={onPressBatalkan} style={styles.button}>
                    <Text style={styles.buttonText}>Batalkan</Text>
                </TouchableOpacity>
            }
            { rr.status == 'not confirmed' &&
                <TouchableOpacity onPress={onPressBayar} style={styles.button}>
                    <Text style={styles.buttonText}>Edit Pembayaran</Text>
                </TouchableOpacity>
            }
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