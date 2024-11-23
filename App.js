import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SignInScreen from './screens/signin/SignInScreen'
import SignUpScreen from './screens/signup/SignUpScreen'
import UserMainMenu from './screens/usermainmenu/UserMainMenuScreen'
import UserPenyewaan from './screens/userpenyewaan/UserPenyewaanScreen'
import UserTransaksi from './screens/usertransaksi/UserTransaksiScreen'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserPenyewaanBaru from './screens/userpenyewaanbaru/UserPenyewaanBaruScreen';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Masuk">
        <Stack.Screen name="Masuk" component={SignInScreen} />
        <Stack.Screen name="Daftar" component={SignUpScreen} />
        <Stack.Screen name="Menu Utama" component={UserMainMenu} />
        <Stack.Screen name="Penyewaan" component={UserPenyewaan} />
        <Stack.Screen name="Penyewaan Baru" component={UserPenyewaanBaru} />
        {/* <Stack.Screen name="Pengaturan" component={} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}