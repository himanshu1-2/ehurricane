import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Button from '../components/Button';
import {
  listProducts,
  listMyProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import { colors } from '../theme';

const ProductListScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, error, products = [], page, pages } =
    useSelector((s) => s.productList) || {};
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((s) => s.productDelete) || {};
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = useSelector((s) => s.productCreate) || {};
  const { userInfo } = useSelector((s) => s.userLogin) || {};

  const isAdmin = userInfo && userInfo.isAdmin;
  const isVendor = userInfo && userInfo.role === 'vendor' && !isAdmin;
  const vendorMode =
    route.params?.vendorMode === true || (!route.params && isVendor) || (route.params?.vendorMode !== false && isVendor);

  const heading = vendorMode ? 'My Cuisines' : 'Products';
  const createLabel = vendorMode ? '+ Add Cuisine' : '+ Create Product';

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo || (!isAdmin && !isVendor)) {
      navigation.replace('Login');
      return;
    }
    if (successCreate && createdProduct?._id) {
      navigation.navigate('ProductEdit', {
        id: createdProduct._id,
        vendorMode,
      });
    } else if (vendorMode) {
      dispatch(listMyProducts('', pageNumber));
    } else {
      dispatch(listProducts('', pageNumber));
    }
  }, [
    dispatch,
    navigation,
    userInfo,
    isAdmin,
    isVendor,
    vendorMode,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const onDelete = (id) =>
    Alert.alert('Confirm', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteProduct(id)) },
    ]);

  return (
    <FlatList
      contentContainerStyle={{ padding: 12 }}
      ListHeaderComponent={
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '800' }}>{heading}</Text>
            <Button
              small
              title={createLabel}
              onPress={() => dispatch(createProduct())}
            />
          </View>
          {loadingDelete && <Loader />}
          {errorDelete && <Message variant="danger">{errorDelete}</Message>}
          {loadingCreate && <Loader />}
          {errorCreate && <Message variant="danger">{errorCreate}</Message>}
          {loading && <Loader />}
          {error && <Message variant="danger">{error}</Message>}
        </View>
      }
      data={products}
      keyExtractor={(p) => p._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.id}>{item._id}</Text>
          <Text style={{ fontWeight: '700' }}>{item.name}</Text>
          <Text>₹ {item.price}</Text>
          <Text style={{ color: colors.textMuted }}>
            {item.category} · {item.brand}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <Button
              small
              variant="light"
              title="Edit"
              onPress={() =>
                navigation.navigate('ProductEdit', {
                  id: item._id,
                  vendorMode,
                })
              }
            />
            <View style={{ width: 8 }} />
            <Button
              small
              variant="danger"
              title="Delete"
              onPress={() => onDelete(item._id)}
            />
          </View>
        </View>
      )}
      ListFooterComponent={
        <Paginate pages={pages} page={page} onChange={setPageNumber} />
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  id: { fontSize: 11, color: colors.textMuted },
});

export default ProductListScreen;
