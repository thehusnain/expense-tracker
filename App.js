// App.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Login from './src/components/Login';
import Signup from './src/components/Signup';
import Dashboard from './src/components/Dashboard';
import Onboarding from './src/components/Onboarding';
import SplashScreen from './src/components/SplashScreen';
import { initDatabase } from './src/database/db';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // login, signup, dashboard
  const [currentUser, setCurrentUser] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
        // Artificial delay for splash screen visibility
        setTimeout(() => {
          setDbInitialized(true);
          setIsLoading(false);
        }, 2500);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbInitialized(true);
        setIsLoading(false);
      }
    };
    setupDatabase();
  }, []);

  const handleLogin = async (user) => {
    setCurrentUser(user);
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        setCurrentScreen('onboarding');
      } else {
        setCurrentScreen('dashboard');
      }
    } catch (e) {
      console.warn('AsyncStorage error:', e);
      setCurrentScreen('dashboard');
    }
  };

  const handleSignup = async (user) => {
    setCurrentUser(user);
    // New users always see onboarding
    setCurrentScreen('onboarding');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const handleCompleteOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    } catch (e) {
      console.warn('Failed to save onboarding state:', e);
    }
    setCurrentScreen('dashboard');
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {currentScreen === 'login' && (
        <Login
          onLogin={handleLogin}
          onNavigateToSignup={() => setCurrentScreen('signup')}
        />
      )}

      {currentScreen === 'signup' && (
        <Signup
          onSignup={handleSignup}
          onNavigateToLogin={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'onboarding' && (
        <Onboarding onComplete={handleCompleteOnboarding} />
      )}

      {currentScreen === 'dashboard' && (
        <Dashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // theme.colors.background
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});