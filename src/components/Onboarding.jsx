import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react-native';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        title: 'Track Smarter',
        description: 'Monitor every penny with precision and beauty. Our premium interface makes finance fun.',
        icon: <Zap size={48} color={theme.colors.primaryLight} />,
        colors: [theme.colors.primary, theme.colors.accent],
    },
    {
        title: 'Safe & Secure',
        description: 'Your data stays on your device. We use local SQLite storage to ensure maximum privacy.',
        icon: <Shield size={48} color={theme.colors.success} />,
        colors: [theme.colors.income, theme.colors.primaryDark],
    },
    {
        title: 'Insights at Glance',
        description: 'Vibrant analytics and trends help you understand where your money goes.',
        icon: <Sparkles size={48} color={theme.colors.gold} />,
        colors: [theme.colors.secondary, theme.colors.accent],
    },
];

export default function Onboarding({ onComplete }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const handleNext = () => {
        if (activeSlide < SLIDES.length - 1) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -50,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setActiveSlide(activeSlide + 1);
                slideAnim.setValue(50);
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start();
            });
        } else {
            onComplete();
        }
    };

    const slide = SLIDES[activeSlide];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[theme.colors.background, '#1e293b']}
                style={styles.background}
            />

            <View style={styles.content}>
                <Animated.View style={[
                    styles.slideContent,
                    { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }
                ]}>
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={slide.colors}
                            style={styles.iconGradient}
                        >
                            {slide.icon}
                        </LinearGradient>
                    </View>

                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.description}>{slide.description}</Text>
                </Animated.View>

                <View style={styles.footer}>
                    <View style={styles.pagination}>
                        {SLIDES.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    activeSlide === i && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <LinearGradient
                            colors={[theme.colors.primary, theme.colors.accent]}
                            style={styles.nextGradient}
                        >
                            <Text style={styles.nextText}>
                                {activeSlide === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
                            </Text>
                            <ArrowRight size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    slideContent: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 40,
        marginBottom: theme.spacing.xxl,
        ...theme.shadows.lg,
    },
    iconGradient: {
        flex: 1,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    description: {
        ...theme.typography.body,
        color: theme.colors.textLight,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: theme.spacing.xl,
        right: theme.spacing.xl,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xxl,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        backgroundColor: theme.colors.primary,
    },
    nextButton: {
        width: '100%',
        height: 60,
        borderRadius: 20,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    nextGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    nextText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
