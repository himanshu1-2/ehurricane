import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Text, FlatList } from 'react-native';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import Paginate from '../components/Paginate';
import { PRODUCTS_URL } from '../constants';

const GenderScreen = ({ route }) => {
  const gender = route.params?.gender || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get(
          `${PRODUCTS_URL}?gender=${encodeURIComponent(gender)}&pageNumber=${pageNumber}`
        );
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
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
  }, [gender, pageNumber]);

  const title =
    gender === 'male'
      ? 'Men'
      : gender === 'female'
      ? 'Women'
      : gender === 'unisex'
      ? 'Unisex'
      : 'Products';

  return (
    <FlatList
      contentContainerStyle={{ padding: 8 }}
      ListHeaderComponent={
        <Text style={{ fontSize: 22, fontWeight: '800', margin: 8 }}>
          {title}
        </Text>
      }
      data={products}
      keyExtractor={(p) => p._id}
      numColumns={2}
      renderItem={({ item }) => <Product product={item} />}
      ListEmptyComponent={
        loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : null
      }
      ListFooterComponent={
        <Paginate pages={pages} page={page} onChange={setPageNumber} />
      }
    />
  );
};

export default GenderScreen;
