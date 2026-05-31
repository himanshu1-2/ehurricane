import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Text, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { Field, Select } from '../components/Field';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  listProductDetails,
  updateProduct,
} from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import { UPLOAD_URL, resolveImage } from '../constants';

const ProductEditScreen = ({ route, navigation }) => {
  const productId = route.params?.id;
  const vendorMode = route.params?.vendorMode === true;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('0');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('');
  const [countInStock, setCountInStock] = useState('0');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, product = {} } =
    useSelector((s) => s.productDetails) || {};
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((s) => s.productUpdate) || {};

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigation.navigate('ProductList', { vendorMode });
      return;
    }
    if (!product.name || product._id !== productId) {
      dispatch(listProductDetails(productId));
    } else {
      setName(product.name || '');
      setPrice(String(product.price ?? 0));
      setImage(product.image || '');
      setBrand(product.brand || '');
      setCategory(product.category || '');
      setGender(product.gender || '');
      setCountInStock(String(product.countInStock ?? 0));
      setDescription(product.description || '');
    }
  }, [dispatch, navigation, productId, product, successUpdate, vendorMode]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled) return;
    setUploading(true);
    try {
      const asset = result.assets[0];
      const filename = asset.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      const form = new FormData();
      form.append('image', { uri: asset.uri, name: filename, type });
      const { data } = await axios.post(UPLOAD_URL, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(data.imageUrl);
    } catch (e) {
      // swallow
    } finally {
      setUploading(false);
    }
  };

  const submit = () => {
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price: Number(price),
        image,
        brand,
        category,
        gender,
        description,
        countInStock: Number(countInStock),
      })
    );
  };

  return (
    <FormContainer>
      <Button
        variant="light"
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
      <Text style={{ fontSize: 22, fontWeight: '800', marginVertical: 8 }}>
        Edit Product
      </Text>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Field label="Name" value={name} onChangeText={setName} />
          <Field
            label="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <Field
            label="Image URL"
            value={image}
            onChangeText={setImage}
          />
          {image ? (
            <Image
              source={{ uri: resolveImage(image) }}
              style={{ height: 160, borderRadius: 6, marginBottom: 8 }}
              resizeMode="cover"
            />
          ) : null}
          <Button
            variant="light"
            title={uploading ? 'Uploading...' : 'Choose Image'}
            onPress={pickImage}
            disabled={uploading}
          />
          <Field label="Brand" value={brand} onChangeText={setBrand} />
          <Field
            label="Count In Stock"
            value={countInStock}
            onChangeText={setCountInStock}
            keyboardType="numeric"
          />
          <Field
            label="Category"
            value={category}
            onChangeText={setCategory}
          />
          <Select
            label="Gender"
            value={gender}
            onChange={setGender}
            items={[
              { label: 'Select gender', value: '' },
              { label: 'Men', value: 'male' },
              { label: 'Women', value: 'female' },
              { label: 'Unisex', value: 'unisex' },
            ]}
          />
          <Field
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <Button title="Update" onPress={submit} />
        </>
      )}
    </FormContainer>
  );
};

export default ProductEditScreen;
