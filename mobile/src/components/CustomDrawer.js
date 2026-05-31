import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import SearchBox from './SearchBox';
import { logout } from '../actions/userActions';
import { PRODUCTS_URL } from '../constants';
import { colors } from '../theme';

const Item = ({ label, onPress, danger }) => (
  <Pressable onPress={onPress} style={styles.item}>
    <Text style={[styles.itemText, danger && { color: colors.danger }]}>
      {label}
    </Text>
  </Pressable>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const CustomDrawer = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((s) => s.userLogin) || {};
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(`${PRODUCTS_URL}/categories`);
        if (!cancelled) setCategories(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setCategories([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const go = (screen, params) => {
    navigation.closeDrawer();
    navigation.navigate(screen, params);
  };

  const onLogout = () => {
    navigation.closeDrawer();
    dispatch(logout());
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      <View style={styles.brandBox}>
        <Text style={styles.brand}>Ajwani Store</Text>
      </View>

      <SearchBox />

      <Item label="Home" onPress={() => go('Home', {})} />
      <Item label="Cart" onPress={() => go('Cart', {})} />

      <Section title="Categories">
        {categories.length === 0 ? (
          <Text style={styles.muted}>Loading...</Text>
        ) : (
          categories.map((cat) => (
            <Item
              key={cat}
              label={cat}
              onPress={() => go('Category', { category: cat })}
            />
          ))
        )}
      </Section>

      <Section title="Browse">
        <Item label="Men" onPress={() => go('Gender', { gender: 'male' })} />
        <Item label="Women" onPress={() => go('Gender', { gender: 'female' })} />
        <Item label="Unisex" onPress={() => go('Gender', { gender: 'unisex' })} />
      </Section>

      {userInfo ? (
        <Section title={userInfo.name}>
          <Item label="Profile" onPress={() => go('Profile')} />
          <Item label="Logout" onPress={onLogout} danger />
        </Section>
      ) : (
        <Item label="Sign In" onPress={() => go('Login')} />
      )}

      {userInfo && userInfo.role === 'vendor' && (
        <Section title="Vendor">
          <Item
            label="My Cuisines"
            onPress={() => go('ProductList', { vendorMode: true })}
          />
        </Section>
      )}

      {userInfo && userInfo.isAdmin && (
        <Section title="Admin">
          <Item label="Users" onPress={() => go('UserList')} />
          <Item label="Products" onPress={() => go('ProductList', { vendorMode: false })} />
          <Item label="Orders" onPress={() => go('OrderList')} />
          <Item label="Coupons" onPress={() => go('CouponList')} />
        </Section>
      )}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  brandBox: {
    padding: 16,
    backgroundColor: colors.primary,
  },
  brand: { color: '#fff', fontSize: 20, fontWeight: '800' },
  item: { paddingVertical: 10, paddingHorizontal: 16 },
  itemText: { fontSize: 15, color: colors.text },
  section: {
    paddingTop: 8,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 8,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  muted: { paddingHorizontal: 16, paddingVertical: 8, color: colors.textMuted },
});

export default CustomDrawer;
