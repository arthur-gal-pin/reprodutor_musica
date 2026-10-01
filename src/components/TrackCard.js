import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TrackCard({ 
  title, 
  isPlaying, 
  position, 
  duration, 
  onPlay, 
  onDelete 
}) {

  // Função auxiliar para formatar milissegundos em minutos e segundos (ex: 02:15)
  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Calcula a porcentagem do progresso para a largura da barra
  const progressPercent = isPlaying && duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.card}>
      {/* Nome do arquivo/faixa */}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      {/* Exibição condicional: Barra de progresso e temporizador apenas quando reproduzindo */}
      {isPlaying && (
        <View style={styles.progressSection}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.timer}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
        </View>
      )}

      {/* Ações (Reproduzir/Tocar e Excluir) */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, isPlaying ? styles.buttonActive : styles.buttonPrimary]} 
          onPress={onPlay}
        >
          <Text style={styles.buttonText}>{isPlaying ? "Pausar / Tocar" : "Reproduzir"}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonDanger]} 
          onPress={onDelete}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  progressSection: {
    marginVertical: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  timer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    flex: 0.48,
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonActive: {
    backgroundColor: '#34C759',
  },
  buttonDanger: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});