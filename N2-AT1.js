import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log('Erro ao carregar tarefas', error);
    }
  };

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.log('Erro ao salvar tarefas', error);
    }
  };

  const addTask = () => {
    if (task.trim()) {
      const newTasks = [...tasks, { id: Date.now().toString(), title: task }];
      setTasks(newTasks);
      setTask('');
      saveTasks(newTasks);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciador de Tarefas</Text>
      <TextInput
        style={styles.input}
        placeholder="Adicione uma nova tarefa"
        value={task}
        onChangeText={setTask}
      />
      <Button title="Adicionar Tarefa" onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  list: {
    marginTop: 20,
  },
  taskItem: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#e4e4e4',
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
});