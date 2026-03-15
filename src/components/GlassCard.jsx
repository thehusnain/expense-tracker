import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';

export default function GlassCard({ children, style, intensity = 20 }) {
    return (
        <View style={[styles.container, style]}>
            <BlurView intensity={intensity} tint="dark" style={styles.blur}>
                <View style={styles.content}>
                    {children}
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.roundness.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    blur: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.md,
    }
});
