import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ChevronDown, Calendar, CreditCard, Tag, DollarSign, Check, ArrowUpCircle, ArrowDownCircle } from 'lucide-react-native';
import { addTransaction, getTransactionCount } from '../database/db';
import { theme } from '../theme';
import GlassCard from './GlassCard';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Subscription', 'Bills', 'Other'
];

export default function AddTransaction({ userId, onClose }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [type, setType] = useState('expense'); // income, expense
  const [description, setDescription] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successSlideAnim = useRef(new Animated.Value(0)).current;
  const successFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const triggerSuccessAnim = () => {
    setShowSuccessAnim(true);
    Animated.parallel([
      Animated.timing(successSlideAnim, {
        toValue: -100,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(successFadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(successFadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ]).start(() => handleClose());
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > 1000000000) {
      Alert.alert('Limit Reached', 'Transaction amount cannot exceed 1 billion for security reasons.');
      return;
    }

    try {
      const count = await getTransactionCount(userId);
      if (count >= 30) {
        Alert.alert(
          'Limit Reached',
          'Free users are limited to 30 transactions. Upgrade to Premium for unlimited tracking!',
          [{ text: 'OK' }]
        );
        return;
      }

      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0];

      await addTransaction(
        userId,
        parseFloat(amount),
        type === 'income' ? 'Income' : category,
        type,
        description,
        date,
        time
      );

      triggerSuccessAnim();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  return (
    <Modal animationType="none" transparent={true} visible={true} onRequestClose={handleClose}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={[theme.colors.background, '#1e293b']}
          style={styles.background}
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={26} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Transaction</Text>
            <View style={{ width: 40 }} />
          </View>

          <Animated.ScrollView
            style={[styles.content, { transform: [{ translateY: slideAnim }] }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Type Selector */}
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Transaction Type</Text>
            </View>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'income' && { backgroundColor: 'rgba(16, 185, 129, 0.2)' }
                ]}
                onPress={() => setType('income')}
              >
                <ArrowUpCircle size={20} color={type === 'income' ? theme.colors.income : theme.colors.textLight} />
                <Text style={[
                  styles.typeButtonText,
                  { color: type === 'income' ? theme.colors.income : theme.colors.textLight }
                ]}>Income</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'expense' && { backgroundColor: 'rgba(244, 63, 94, 0.2)' }
                ]}
                onPress={() => setType('expense')}
              >
                <ArrowDownCircle size={20} color={type === 'expense' ? theme.colors.expense : theme.colors.textLight} />
                <Text style={[
                  styles.typeButtonText,
                  { color: type === 'expense' ? theme.colors.expense : theme.colors.textLight }
                ]}>Expense</Text>
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <GlassCard style={styles.amountCard}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <View style={styles.amountInputRow}>
                <TextInput
                  style={[
                    styles.amountInput,
                    { color: type === 'income' ? theme.colors.income : theme.colors.expense }
                  ]}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.1)"
                  maxLength={12}
                  value={amount}
                  onChangeText={(val) => {
                    // Only allow numbers and one decimal point
                    const cleanValue = val.replace(/[^0-9.]/g, '');
                    if (cleanValue.split('.').length <= 2) {
                      setAmount(cleanValue);
                    }
                  }}
                  textAlign="center"
                />
              </View>
            </GlassCard>

            {/* Category Selector */}
            {type === 'expense' && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.label}>Select Category</Text>
                </View>
                <View style={styles.categoryGrid}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryItem,
                        category === cat && styles.categoryItemActive
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[
                        styles.categoryText,
                        category === cat && styles.categoryTextActive
                      ]}>{cat}</Text>
                      {category === cat && <Check size={14} color="#fff" style={styles.checkIcon} />}
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Description Input */}
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Description {type === 'income' && '(Optional)'}</Text>
            </View>
            <GlassCard style={styles.descriptionCard}>
              <TextInput
                style={styles.textInput}
                placeholder={type === 'income' ? "Ex. Salary, Bonus, Freelance..." : "Ex. Monthly Rent, Grocery Shopping..."}
                placeholderTextColor={theme.colors.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </GlassCard>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitButtonText}>Confirm Transaction</Text>
              </LinearGradient>
            </TouchableOpacity>

            {showSuccessAnim && (
              <Animated.View style={[
                styles.successOverlay,
                { opacity: successFadeAnim, transform: [{ translateY: successSlideAnim }] }
              ]}>
                <Text style={[
                  styles.successText,
                  { color: type === 'income' ? theme.colors.income : theme.colors.expense }
                ]}>
                  {type === 'income' ? '+' : '-'} Rs {parseFloat(amount).toLocaleString()}
                </Text>
                <Check size={48} color={type === 'income' ? theme.colors.income : theme.colors.expense} />
              </Animated.View>
            )}
          </Animated.ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  sectionHeader: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  typeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: theme.roundness.lg,
    padding: 6,
    marginBottom: theme.spacing.lg,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: theme.roundness.md,
    gap: 8,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  amountCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  amountLabel: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textLight,
    marginRight: 10,
    marginTop: 8,
  },
  amountInput: {
    fontSize: 54,
    fontWeight: '900',
    width: '100%',
    paddingVertical: theme.spacing.md,
    minHeight: 80,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: theme.spacing.lg,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.roundness.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryItemActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textLight,
  },
  categoryTextActive: {
    color: '#fff',
  },
  checkIcon: {
    marginLeft: 6,
  },
  descriptionCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  textInput: {
    ...theme.typography.body,
    color: theme.colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
    ...theme.shadows.lg,
  },
  submitGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successOverlay: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  successText: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});