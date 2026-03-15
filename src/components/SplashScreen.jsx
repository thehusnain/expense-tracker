import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet, TrendingUp } from 'lucide-react-native';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <LinearGradient
                colors={[theme.colors.background, '#1e293b']}
                style={styles.background}
            />

            <Animated.View
                style={[
                    styles.content,
                    { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
                ]}
            >
                <View style={styles.logoContainer}>
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.accent]}
                        style={styles.logoGradient}
                    >
                        <Wallet size={50} color="#fff" />
                    </LinearGradient>
                    <View style={styles.badge}>
                        <TrendingUp size={16} color="#fff" />
                    </View>
                </View>

                <Text style={styles.title}>Expense Tracker</Text>
                <Text style={styles.subtitle}>Premium Financial Manager</Text>

                <View style={styles.loadingContainer}>
                    <View style={styles.progressBarBackground}>
                        <Animated.View
                            style={[styles.progressBarFill, { width: progressWidth }]}
                        >
                            <LinearGradient
                                colors={[theme.colors.primaryLight, theme.colors.primary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={StyleSheet.absoluteFill}
                            />
                        </Animated.View>
                    </View>
                    <Text style={styles.loadingText}>Initializing Secure Database...</Text>
                </View>
            </Animated.View>

            <Text style={styles.footerText}>Securely Stored on Device</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    logoContainer: {
        width: 120,
        height: 120,
        marginBottom: 30,
        position: 'relative',
    },
    logoGradient: {
        flex: 1,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.lg,
    },
    badge: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: theme.colors.income,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: theme.colors.background,
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.text,
        fontSize: 36,
        letterSpacing: 1.5,
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.textLight,
        marginTop: 8,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 12,
        fontWeight: '700',
    },
    loadingContainer: {
        marginTop: 60,
        width: '70%',
        alignItems: 'center',
    },
    progressBarBackground: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 15,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    loadingText: {
        color: theme.colors.textLight,
        fontSize: 12,
        fontWeight: '500',
    },
    footerText: {
        position: 'absolute',
        bottom: 40,
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    },
});
