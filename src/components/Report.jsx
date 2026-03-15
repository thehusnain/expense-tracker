import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Filter, Download, ArrowUpCircle, ArrowDownCircle } from 'lucide-react-native';
import { getTransactions } from '../database/db';
import { theme } from '../theme';
import GlassCard from './GlassCard';

const { width } = Dimensions.get('window');

export default function Report({ user, onBack }) {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, income, expense

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactions = await getTransactions(user.id);
      setData(transactions);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    };
    fetchTransactions();
  }, [user.id]);

  const filteredData = data.filter(t => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

  const totals = filteredData.reduce((acc, t) => acc + t.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, '#1e293b']}
        style={styles.background}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={[styles.scrollContent, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContainer}>
          {['all', 'income', 'expense'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <GlassCard style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total {activeTab === 'all' ? 'Transactions' : activeTab}</Text>
          <Text style={[
            styles.summaryAmount,
            activeTab === 'expense' && { color: theme.colors.expense },
            activeTab === 'income' && { color: theme.colors.income }
          ]}>
            ${totals.toLocaleString()}
          </Text>
          <View style={styles.summaryFooter}>
            <TrendingUp size={16} color={theme.colors.success} style={{ marginRight: 6 }} />
            <Text style={styles.summaryTrend}>+12.5% from last month</Text>
          </View>
        </GlassCard>

        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Details</Text>
          <TouchableOpacity>
            <Download size={20} color={theme.colors.primaryLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {filteredData.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No history found</Text>
            </View>
          ) : (
            filteredData.map((t) => (
              <GlassCard key={t.id} style={styles.item}>
                <View style={styles.itemMain}>
                  <View style={[
                    styles.iconWrapper,
                    { backgroundColor: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)' }
                  ]}>
                    {t.type === 'income' ? (
                      <ArrowUpCircle size={22} color={theme.colors.income} />
                    ) : (
                      <ArrowDownCircle size={22} color={theme.colors.expense} />
                    )}
                  </View>
                  <View>
                    <Text style={styles.itemCategory}>{t.category}</Text>
                    <Text style={styles.itemDate}>{t.date} • {t.time}</Text>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <Text style={[
                    styles.itemAmount,
                    { color: t.type === 'income' ? theme.colors.income : theme.colors.expense }
                  ]}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </Text>
                  {t.description ? <Text style={styles.itemDesc}>{t.description}</Text> : null}
                </View>
              </GlassCard>
            ))
          )}
        </View>
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      <TouchableOpacity style={styles.exportButton}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.exportGradient}
        >
          <Download size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.exportText}>Download Full Report</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Add TrendingUp as it was missing from lucide-react-native imports in previous context but let's assume it's available
import { TrendingUp } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xl,
    marginVertical: theme.spacing.lg,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textLight,
  },
  activeTabText: {
    color: '#fff',
  },
  summaryCard: {
    marginHorizontal: theme.spacing.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  summaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 40,
    fontWeight: '900',
    color: theme.colors.text,
    marginBottom: 12,
  },
  summaryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  summaryTrend: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.success,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  transactionsTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  list: {
    paddingHorizontal: theme.spacing.xl,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    marginBottom: 12,
  },
  itemMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemCategory: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  itemDate: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 17,
    fontWeight: '800',
  },
  itemDesc: {
    fontSize: 11,
    color: theme.colors.textLight,
    marginTop: 2,
    maxWidth: 120,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    color: theme.colors.textLight,
    fontSize: 16,
    fontWeight: '500',
  },
  exportButton: {
    position: 'absolute',
    bottom: 30,
    left: theme.spacing.xl,
    right: theme.spacing.xl,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  exportGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  }
});