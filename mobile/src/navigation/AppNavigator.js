import React from 'react';
import { Pressable, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import CustomDrawer from '../components/CustomDrawer';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VendorRegisterScreen from '../screens/VendorRegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';
import ProductScreen from '../screens/ProductScreen';
import ShippingScreen from '../screens/ShippingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PlaceOrderScreen from '../screens/PlaceOrderScreen';
import OrderScreen from '../screens/OrderScreen';
import OrderListScreen from '../screens/OrderListScreen';
import CategoryScreen from '../screens/CategoryScreen';
import GenderScreen from '../screens/GenderScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductEditScreen from '../screens/ProductEditScreen';
import UserListScreen from '../screens/UserListScreen';
import UserEditScreen from '../screens/UserEditScreen';
import CouponListScreen from '../screens/CouponListScreen';
import CouponEditScreen from '../screens/CouponEditScreen';
import SuccessScreen from '../screens/SuccessScreen';
import CancelScreen from '../screens/CancelScreen';
import { colors } from '../theme';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HeaderMenuButton = ({ onPress }) => (
  <Pressable onPress={onPress} style={{ paddingHorizontal: 12 }}>
    <Text style={{ color: '#fff', fontSize: 22 }}>☰</Text>
  </Pressable>
);

const screens = [
  { name: 'Home', component: HomeScreen, title: 'Ajwani Store' },
  { name: 'Login', component: LoginScreen, title: 'Sign In' },
  { name: 'Register', component: RegisterScreen, title: 'Sign Up' },
  { name: 'VendorRegister', component: VendorRegisterScreen, title: 'Vendor Sign Up' },
  { name: 'Profile', component: ProfileScreen, title: 'Profile' },
  { name: 'Cart', component: CartScreen, title: 'Cart' },
  { name: 'Product', component: ProductScreen, title: 'Product' },
  { name: 'Category', component: CategoryScreen, title: 'Category' },
  { name: 'Gender', component: GenderScreen, title: 'Browse' },
  { name: 'Shipping', component: ShippingScreen, title: 'Shipping' },
  { name: 'Payment', component: PaymentScreen, title: 'Payment' },
  { name: 'PlaceOrder', component: PlaceOrderScreen, title: 'Place Order' },
  { name: 'Order', component: OrderScreen, title: 'Order' },
  { name: 'OrderList', component: OrderListScreen, title: 'Orders' },
  { name: 'ProductList', component: ProductListScreen, title: 'Products' },
  { name: 'ProductEdit', component: ProductEditScreen, title: 'Edit Product' },
  { name: 'UserList', component: UserListScreen, title: 'Users' },
  { name: 'UserEdit', component: UserEditScreen, title: 'Edit User' },
  { name: 'CouponList', component: CouponListScreen, title: 'Coupons' },
  { name: 'CouponEdit', component: CouponEditScreen, title: 'Coupon' },
  { name: 'Success', component: SuccessScreen, title: 'Success' },
  { name: 'Cancel', component: CancelScreen, title: 'Cancelled' },
];

const MainStack = () => (
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '700' },
      headerLeft: () => (
        <HeaderMenuButton onPress={() => navigation.openDrawer()} />
      ),
    })}
  >
    {screens.map((s) => (
      <Stack.Screen
        key={s.name}
        name={s.name}
        component={s.component}
        options={{ title: s.title }}
      />
    ))}
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{ headerShown: false, drawerType: 'front' }}
  >
    <Drawer.Screen name="Root" component={MainStack} />
  </Drawer.Navigator>
);

export default AppNavigator;
