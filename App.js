import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SignInScreen from './src/screens/SignInScreen'
import SignUpScreen from './src/screens/SignUpScreen'
import RedirectorScreen from './src/screens/RedirectorScreen'

import UserMainMenuScreen from './src/screens/UserMainMenuScreen'
import UserRentalsScreen from './src/screens/UserRentalsScreen'
import UserNewRentalScreen from './src/screens/UserNewRentalScreen'
import UserDoPaymentScreen from './src/screens/UserDoPaymentScreen'
import UserSettingsScreen from './src/screens/UserSettingsScreen'

import AdminMainMenuScreen from './src/screens/AdminMainMenuScreen'
import AdminRentalsScreen from './src/screens/AdminRentalsScreen'
import AdminCustomersScreen from './src/screens/AdminCustomersScreen'
import AdminCustomerDetailsScreen from './src/screens/AdminCustomerDetailsScreen'
import AdminConsoleManagementScreen from './src/screens/AdminConsoleManagementScreen'
import AdminAddConsoleScreen from './src/screens/AdminAddConsole'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Masuk">
        <Stack.Screen name="Masuk" component={SignInScreen} />
        <Stack.Screen name="Daftar" component={SignUpScreen} />
        <Stack.Screen name="Redirecting" component={RedirectorScreen} />
        <Stack.Screen name="Menu Utama" component={UserMainMenuScreen} />
        <Stack.Screen name="Penyewaan" component={UserRentalsScreen} />
        <Stack.Screen name="Penyewaan Baru" component={UserNewRentalScreen} />
        <Stack.Screen name="Membayar Penyewaan" component={UserDoPaymentScreen} />
        <Stack.Screen name="Pengaturan" component={UserSettingsScreen} />
        <Stack.Screen name="Menu Admin" component={AdminMainMenuScreen} />
        <Stack.Screen name="Penyewaan Admin" component={AdminRentalsScreen} />
        <Stack.Screen name="Semua Pelanggan" component={AdminCustomersScreen} />
        <Stack.Screen name="Detail Pelanggan" component={AdminCustomerDetailsScreen} />
        <Stack.Screen name="Manajemen Konsol" component={AdminConsoleManagementScreen} />
        <Stack.Screen name="Tambahkan Konsol" component={AdminAddConsoleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}