import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  LogOut,
  Calendar,
  Wallet,
  Settings,
  PieChart,
  Bell,
} from 'lucide-react-native';
import { getTransactions } from '../database/db';
import { theme } from '../theme';
import AddTransaction from './AddTransaction';
import Report from './Report';
import GlassCard from './GlassCard';

const { width } = Dimensions.get('window');

export default function Dashboard({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [totals, setTotals] = useState({ balance: 0, income: 0, expense: 0 });

  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchData = useCallback(async () => {
    try {
      const data = await getTransactions(user.id);
      setTransactions(data);

      let inc = 0, exp = 0;
      data.forEach(t => {
        if (t.type === 'income') inc += t.amount;
        else exp += t.amount;
      });

      setTotals({
        income: inc,
        expense: exp,
        balance: inc - exp
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const balanceScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  if (showReport) {
    return <Report user={user} onBack={() => setShowReport(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[theme.colors.background, '#1e293b']}
        style={styles.background}
      />

      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout} style={styles.iconButton}>
            <LogOut size={22} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: balanceScale }] }}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <View style={styles.balanceHeader}>
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceTitle}>Total Balance</Text>
                <Text style={styles.balanceAmount}>${totals.balance.toLocaleString()}</Text>
              </View>
              <View style={styles.walletIcon}>
                <Wallet size={24} color="#fff" />
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconWrapper}>
                  <ArrowUpCircle size={20} color={theme.colors.income} />
                </View>
                <View>
                  <Text style={styles.statLabel}>Income</Text>
                  <Text style={styles.statValue}>+${totals.income.toLocaleString()}</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                  <ArrowDownCircle size={20} color={theme.colors.expense} />
                </View>
                <View>
                  <Text style={styles.statLabel}>Expenses</Text>
                  <Text style={styles.statValue}>-${totals.expense.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.actionsGrid}>
          {[
            { id: '1', icon: <Plus size={24} color="#fff" />, label: 'Add', color: theme.colors.primary, onPress: () => setShowAddModal(true) },
            { id: '2', icon: <PieChart size={24} color="#fff" />, label: 'Stats', color: theme.colors.accent, onPress: () => setShowReport(true) },
            { id: '3', icon: <Calendar size={24} color="#fff" />, label: 'Plans', color: theme.colors.secondary },
            { id: '4', icon: <Settings size={24} color="#fff" />, label: 'Config', color: '#64748b' },
          ].map((action) => (
            <TouchableOpacity key={action.id} style={styles.actionItem} onPress={action.onPress}>
              <LinearGradient colors={[action.color, action.color + 'dd']} style={styles.actionIcon}>
                {action.icon}
              </LinearGradient>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => setShowReport(true)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {transactions.length === 0 ? (
            <GlassCard style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No transactions yet.</Text>
            </GlassCard>
          ) : (
            transactions.slice(0, 5).map((t) => (
              <GlassCard key={t.id} style={styles.transactionCard}>
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)' }
                ]}>
                  {t.type === 'income' ? (
                    <ArrowUpCircle size={22} color={theme.colors.income} />
                  ) : (
                    <ArrowDownCircle size={22} color={theme.colors.expense} />
                  )}
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionCategory}>{t.category}</Text>
                  <Text style={styles.transactionDate}>{t.date}</Text>
                </View>
                <View style={styles.amountContainer}>
                  <Text style={[
                    styles.transactionAmount,
                    { color: t.type === 'income' ? theme.colors.income : theme.colors.expense }
                  ]}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </Text>
                </View>
              </GlassCard>
            ))
          )}
        </View>
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.accent]}
          style={styles.fabGradient}
        >
          <Plus size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {showAddModal && (
        <AddTransaction
          userId={user.id}
          onClose={() => {
            setShowAddModal(false);
            fetchData();
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    zIndex: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    ...theme.typography.body,
    color: theme.colors.textLight,
  },
  userName: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  balanceCard: {
    margin: theme.spacing.xl,
    borderRadius: theme.roundness.xxl,
    padding: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  balanceTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '800',
    marginTop: 4,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: theme.roundness.lg,
    padding: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  seeAll: {
    color: theme.colors.primaryLight,
    fontWeight: '700',
    fontSize: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  actionItem: {
    alignItems: 'center',
    width: (width - theme.spacing.xl * 2) / 4.5,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    ...theme.shadows.md,
  },
  actionLabel: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '600',
  },
  transactionsList: {
    paddingHorizontal: theme.spacing.xl,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  transactionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  transactionDate: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 17,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyStateText: {
    color: theme.colors.textLight,
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 68,
    height: 68,
    borderRadius: 24,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  fabGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});