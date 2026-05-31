import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList } from 'react-native';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import Paginate from '../components/Paginate';
import { PRODUCTS_URL } from '../constants';

const CategoryScreen = ({ route }) => {
  const category = route.params?.category || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(
          `${PRODUCTS_URL}?category=${encodeURIComponent(category)}&pageNumber=${pageNumber}`
        );
        if (cancelled) return;
        setProducts(data.products || []);
        setPage(data.page || pageNumber);
        setPages(data.pages || 1);
      } catch (err) {
        if (!cancelled)
          setError(err.response?.data?.message || err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, pageNumber]);

  return (
    <FlatList
      contentContainerStyle={{ padding: 8 }}
      ListHeaderComponent={
        <Text
          style={{
            fontSize: 22,
            fontWeight: '800',
            margin: 8,
            textAlign: 'center',
          }}
        >
          {category || 'All Products'}
        </Text>
      }
      data={products}
      keyExtractor={(p) => p._id}
      numColumns={2}
      renderItem={({ item }) => <Product product={item} />}
      ListEmptyComponent={
        loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Message>No products found in this category.</Message>
        )
      }
      ListFooterComponent={
        <Paginate pages={pages} page={page} onChange={setPageNumber} />
      }
    />
  );
};

export default CategoryScreen;
