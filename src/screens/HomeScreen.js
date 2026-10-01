import React, { useState, useEffect } from 'react';
import { View, FlatList, Button } from 'react-native';
import { setupDatabase } from '../database';
import { getTracks, deleteTrack } from '../database/trackRepository';

export default function HomeScreen() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    // 1. Prepara o banco
    setupDatabase();
    // 2. Carrega os dados para o estado do React
    loadData();
  }, []);

  const loadData = () => {
    const list = getTracks();
    setTracks(list); // Atualiza a FlatList
  };

  const handleDelete = (id) => {
    deleteTrack(id); // Exclui do banco SQLite
    loadData();      // Recarrega a lista
  };

  return (
    <View>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Button title="Excluir" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
}