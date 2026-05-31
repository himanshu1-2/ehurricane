import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Rating from '../components/Rating';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { Field, Select } from '../components/Field';
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';
import { resolveImage } from '../constants';
import { colors } from '../theme';

const ProductScreen = ({ route, navigation }) => {
  const productId = route.params?.id;
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { loading, error, product = {} } =
    useSelector((s) => s.productDetails) || {};
  const { userInfo } = useSelector((s) => s.userLogin) || {};
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = useSelector((s) => s.productReviewCreate) || {};

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment('');
    }
    if (!product._id || product._id !== productId) {
      dispatch(listProductDetails(productId));
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
  }, [dispatch, productId, successProductReview, product._id]);

  const addToCart = () =>
    navigation.navigate('Cart', { id: productId, qty });

  const submitReview = () => {
    dispatch(createProductReview(productId, { rating: Number(rating), comment }));
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!product._id) return null;

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      <Button
        title="Go Back"
        variant="light"
        onPress={() => navigation.goBack()}
      />
      <Image
        source={{ uri: resolveImage(product.image) }}
        style={styles.image}
      />
      <Text style={styles.title}>{product.name}</Text>
      <Rating
        value={product.rating}
        text={`${product.numReviews} reviews`}
      />
      <Text style={styles.price}>₹ {product.price}</Text>
      <Text style={styles.desc}>{product.description}</Text>

      <View style={styles.card}>
        <Row label="Price" value={`₹ ${product.price}`} />
        <Row
          label="Status"
          value={product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
        />
        {product.countInStock > 0 && (
          <Select
            label="Qty"
            value={qty}
            onChange={(v) => setQty(Number(v))}
            items={[...Array(product.countInStock).keys()].map((x) => ({
              label: String(x + 1),
              value: x + 1,
            }))}
          />
        )}
        <Button
          title="Add To Cart"
          disabled={product.countInStock === 0}
          onPress={addToCart}
        />
      </View>

      <Text style={[styles.title, { marginTop: 24 }]}>Reviews</Text>
      {(product.reviews || []).length === 0 && (
        <Message>No Reviews</Message>
      )}
      {(product.reviews || []).map((r) => (
        <View key={r._id} style={styles.review}>
          <Text style={{ fontWeight: '700' }}>{r.name}</Text>
          <Rating value={r.rating} />
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>
            {r.createdAt && r.createdAt.substring(0, 10)}
          </Text>
          <Text>{r.comment}</Text>
        </View>
      ))}

      <Text style={[styles.title, { marginTop: 16 }]}>
        Write a Customer Review
      </Text>
      {successProductReview && (
        <Message variant="success">Review submitted successfully</Message>
      )}
      {loadingProductReview && <Loader />}
      {errorProductReview && (
        <Message variant="danger">{errorProductReview}</Message>
      )}
      {userInfo ? (
        <>
          <Select
            label="Rating"
            value={rating}
            onChange={(v) => setRating(v)}
            items={[
              { label: 'Select...', value: 0 },
              { label: '1 - Poor', value: 1 },
              { label: '2 - Fair', value: 2 },
              { label: '3 - Good', value: 3 },
              { label: '4 - Very Good', value: 4 },
              { label: '5 - Excellent', value: 5 },
            ]}
          />
          <Field
            label="Comment"
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <Button
            title="Submit"
            onPress={submitReview}
            disabled={loadingProductReview}
          />
        </>
      ) : (
        <Message>
          Please{' '}
          <Text
            style={{ color: colors.primary }}
            onPress={() => navigation.navigate('Login')}
          >
            sign in
          </Text>{' '}
          to write a review
        </Message>
      )}
    </ScrollView>
  );
};

const Row = ({ label, value }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }}
  >
    <Text>{label}</Text>
    <Text style={{ fontWeight: '700' }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 260,
    marginVertical: 12,
    backgroundColor: colors.light,
    borderRadius: 8,
  },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  price: { fontSize: 22, fontWeight: '800', marginVertical: 6 },
  desc: { color: colors.text, marginBottom: 12 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginVertical: 12,
  },
  review: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});

export default ProductScreen;
