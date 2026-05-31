import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

const FormContainer = ({ children }) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    style={{ flex: 1 }}
  >
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
      <View style={{ maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        {children}
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);

export default FormContainer;
