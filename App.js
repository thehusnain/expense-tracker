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
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // login, signup, dashboard
  const [currentUser, setCurrentUser] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();

        // Check for persistent login
        const savedUser = await AsyncStorage.getItem('currentUser');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);

          const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
          if (hasSeenOnboarding) {
            setCurrentScreen('dashboard');
          } else {
            setCurrentScreen('onboarding');
          }
        }

        // Artificial delay for splash screen visibility and smooth transition
        setTimeout(() => {
          setDbInitialized(true);
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Failed to initialize database or check auth:', error);
        setDbInitialized(true);
        setIsLoading(false);
      }
    };
    setupDatabase();
  }, []);

  const handleLogin = async (user) => {
    setCurrentUser(user);
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
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
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    } catch (e) {
      console.warn('AsyncStorage error saving signup:', e);
    }
    // New users always see onboarding
    setCurrentScreen('onboarding');
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    try {
      await AsyncStorage.removeItem('currentUser');
    } catch (e) {
      console.warn('Failed to clear user storage:', e);
    }
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
    <SafeAreaProvider>
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
    </SafeAreaProvider>
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