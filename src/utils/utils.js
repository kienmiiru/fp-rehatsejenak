import { doc, getDoc } from "firebase/firestore"

export let timestampToDate = (timestamp) => {
    let date = new Date(timestamp.seconds*1000)
    return date.toDateString()
}

export let timestampToDateTime = (timestamp) => {
    let date = new Date(timestamp.seconds*1000)
    return `${date.toDateString().substring(4)} ${date.toTimeString().split(' ')[0]}`
}

// Menambahkan consoleName ke rentalRecords
export let fetchConsoleDetails = async (rentalRecords, db) => {
    try {
        let consoleDetails = await Promise.all(
            rentalRecords.map(async (rr) => {
                let consoleRef = doc(db, "consoles", rr.consoleId)
                let consoleDocument = await getDoc(consoleRef)

                if (consoleDocument.exists()) {
                    return {
                        ...rr,
                        consoleName: consoleDocument.data().name,
                    };
                } else {
                    console.error(`Console with ID ${record.bookId} not found`)
                    return {
                        ...rr,
                        consoleName: "Konsol tidak ditemukan",
                    }
                }
            })
        )

        return consoleDetails
    } catch (error) {
        console.error("Error saat fetch konsol:", error)
    }
}

// Menambahkan customerName ke rentalRecords
export let fetchCustomerDetails = async (rentalRecords, db) => {
    try {
        let customerDetails = await Promise.all(
            rentalRecords.map(async (rr) => {
                let customerRef = doc(db, "customers", rr.customerId)
                let customerDocument = await getDoc(customerRef)

                if (customerDocument.exists()) {
                    return {
                        ...rr,
                        customerName: customerDocument.data().fullName,
                    }
                } else {
                    console.error(`Customer with ID ${rr.customerId} not found`)
                    return {
                        ...rr,
                        customerName: "Pelanggan tidak ditemukan",
                    }
                }
            })
        )

        return customerDetails
    } catch (error) {
        console.error("Error saat fetch customer:", error)
    }
}

// Menambahkan adminName (admin yang mengonfirmasi) ke rentalRecords
export let fetchAdminDetails = async (rentalRecords, db) => {
    try {
        let adminDetails = await Promise.all(
            rentalRecords.map(async (rr) => {
                if (!rr.confirmedBy) {
                    return {
                        ...rr
                    }
                }

                let adminRef = doc(db, "admins", rr.confirmedBy)
                let adminDocument = await getDoc(adminRef)

                if (adminDocument.exists()) {
                    return {
                        ...rr,
                        adminName: adminDocument.data().fullName,
                    }
                } else {
                    console.error(`Admin with ID ${rr.confirmedBy} not found`)
                    return {
                        ...rr,
                        adminName: "Admin tidak ditemukan",
                    }
                }
            })
        )

        return adminDetails
    } catch (error) {
        console.error("Error saat fetch customer:", error)
    }
}