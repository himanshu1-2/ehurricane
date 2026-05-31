import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Button from '../components/Button';
import { listProducts } from '../actions/productActions';

const HomeScreen = ({ route, navigation }) => {
  const keyword = route.params?.keyword || '';
  const pageNumber = route.params?.pageNumber || 1;

  const dispatch = useDispatch();
  const productList = useSelector((s) => s.productList);
  const { loading, error, products = [], page, pages } = productList || {};

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  const changePage = (n) => navigation.setParams({ pageNumber: n });

  return (
    <FlatList
      contentContainerStyle={{ padding: 8 }}
      ListHeaderComponent={
        <View>
          {keyword ? (
            <Button
              title="Go Back"
              variant="light"
              onPress={() => navigation.navigate('Home', { keyword: undefined })}
            />
          ) : (
            <ProductCarousel />
          )}
          <Text style={styles.heading}>Latest Products</Text>
          {loading && <Loader />}
          {error && <Message variant="danger">{error}</Message>}
        </View>
      }
      data={products}
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={({ item }) => <Product product={item} />}
      ListFooterComponent={
        <Paginate pages={pages} page={page} onChange={changePage} />
      }
    />
  );
};

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: '800', marginVertical: 12, marginLeft: 8 },
});

export default HomeScreen;
