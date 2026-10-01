import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import { setupDatabase, feedInitialData } from './src/database';
import { getTracks, insertTrack, deleteTrack } from './src/database/databaseRepository';
import { AUDIO_FILES } from './src/utils/audioRegistry';

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [sound, setSound] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  // Inicialização do Banco de Dados SQLite e limpeza de áudio
  useEffect(() => {
    // Inicializar tabela e popular dados na primeira execução
    setupDatabase();
    feedInitialData();
    loadTracksFromDB();

    // Requisito: Parar e descarregar o áudio ao desmontar a tela/sair do app
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadTracksFromDB = () => {
    const data = getTracks();
    setTracks(data);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 1);
      if (status.didJustFinish) {
        setCurrentTrackId(null);
      }
    }
  };

  const playAudio = async (item) => {
    if (sound) {
      await sound.unloadAsync();
    }

    // Busca o arquivo físico baseado na propriedade salva no SQLite
    const audioSource = AUDIO_FILES[item.fileName];

    const { sound: newSound } = await Audio.Sound.createAsync(
      audioSource,
      { shouldPlay: true },
      onPlaybackStatusUpdate
    );

    setSound(newSound);
    setCurrentTrackId(item.id);
  };

  // Excluir registro do SQLite e atualizar a tela
  const handleDelete = async (id) => {
    if (currentTrackId === id && sound) {
      await sound.stopAsync();
      setCurrentTrackId(null);
    }

    // Executa o DELETE no SQLite
    deleteTrack(id);
    
    // Recarrega a lista do banco de dados
    loadTracksFromDB();
  };

  const formatTime = (millis) => {
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meu Player SQLite</Text>

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isPlaying = item.id === currentTrackId;
          const progressPercent = isPlaying ? (position / duration) * 100 : 0;

          return (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              
              {isPlaying && (
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
                  <Text style={styles.timer}>
                    {formatTime(position)} / {formatTime(duration)}
                  </Text>
                </View>
              )}

              <View style={styles.actions}>
                <Button
                  title={isPlaying ? "Tocar Novamente" : "Reproduzir"}
                  onPress={() => playAudio(item)}
                />
                <Button
                  title="Excluir"
                  color="red"
                  onPress={() => handleDelete(item.id)}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 12, elevation: 2 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  progressContainer: { marginVertical: 10 },
  progressBar: { height: 6, backgroundColor: '#007AFF', borderRadius: 3, marginBottom: 4 },
  timer: { fontSize: 12, color: '#666', textAlign: 'right' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }
});