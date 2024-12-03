import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

export default ({ con, onRentPress }) => {
    return (
        <View style={styles.card}>
            <Text>Nama: {con.name}</Text>
            <Text>Harga sewa per hari: Rp. {con.rentalPrice}</Text>
            <Text>
                Tersedia: {con.available ? 'Ya' : `Tidak (sampai ${new Date(con.rentedUntil.seconds * 1000).toDateString()})`}
            </Text>
            {con.available && (
                <TouchableOpacity style={styles.button} onPress={() => onRentPress(con)}>
                    <Text>Sewa</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

let styles = StyleSheet.create({
    card: { padding: 16, marginBottom: 16, backgroundColor: '#fff', borderRadius: 8 },
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
    }
})