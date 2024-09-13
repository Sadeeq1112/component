import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

const MediaPlayer = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAudio = useCallback(async () => {
    try {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        require('./assets/sample.mp3'),
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(audioSound);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  }, []);

  useEffect(() => {
    loadAudio();
  }, [loadAudio]);

  const onPlaybackStatusUpdate = (status) => {
    setIsBuffering(status.isBuffering);
    setPosition(status.positionMillis);
    setDuration(status.durationMillis);
  };

  const playSound = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      setIsPlaying(false);
    }
  };

  const seekSound = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value * duration);
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Media Player</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={isPlaying ? pauseSound : playSound} style={styles.button}>
          <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={stopSound} style={styles.button}>
          <MaterialIcons name="stop" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${(position / duration) * 100}%` }]} />
        </View>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      {isBuffering && <Text style={styles.bufferingText}>Buffering...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 10,
    marginHorizontal: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  bufferingText: {
    marginTop: 10,
    color: '#666',
  },
});

export default MediaPlayer;
