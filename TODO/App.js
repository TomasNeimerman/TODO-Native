import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert} from 'react-native';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');

  const agregarTodo = () => {
    if (todoText.trim() !== '') {
      const existeTarea = todos.some(todo => todo.text === todoText);
      
      if (existeTarea) {
        mostrarError('Tarea ya existente');
        return; 
      }

      const todo = {
        text: todoText,
        completed: false,
        timestamp: new Date(),
        timeend: null,
      };
      setTodos([...todos, todo]);
      setTodoText('');
    }
  };

  const mostrarError = (mensaje) => {
    Alert.alert('Error', mensaje);
  };

  const mostrarCompletos = (index) => {
    const updatedTodos = [...todos];
    const now = new Date();
    updatedTodos[index].completed = !updatedTodos[index].completed;
    if (updatedTodos[index].completed) {
      updatedTodos[index].timeend = now;
    }
    setTodos(updatedTodos);
  };

  const borrarTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
  };

  const tareaMasRapida = () => {
    let tareaMasRapida = null;
    let tiempoMasRapido = Infinity;

    todos.forEach(todo => {
      if (todo.completed && todo.timeend) {
        const tiempoTranscurrido = todo.timeend - todo.timestamp;

        if (tiempoTranscurrido < tiempoMasRapido) {
          tiempoMasRapido = tiempoTranscurrido;
          tareaMasRapida = todo;
        }
      }
    });

    if (tareaMasRapida) {
      const { text, timeend } = tareaMasRapida;
      const fecha = new Date(timeend);
      Alert.alert('Tarea más rápida', `Tarea: ${text} (Hecho a las ${fecha.getHours()}hs ${fecha.getMinutes()}mins ${fecha.getSeconds()}segs del ${fecha.getDate()}/${fecha.getMonth() + 1})`);
    } else {
      Alert.alert('Tarea más rápida', 'No hay tareas completadas para mostrar la más rápida.');
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.todoItem}>
      <Text style={item.completed ? styles.completed : styles.todoText}>{item.text}</Text>
      {!item.completed ? (
        <Button title="Completar" onPress={() => mostrarCompletos(index)} />
      ) : (
        <Text style={styles.completedTime}>Completado a las {item.timeend.getHours()}hs {item.timeend.getMinutes()}mins {item.timeend.getSeconds()}segs del {item.timeend.getDate()}/{item.timeend.getMonth() + 1}</Text>
      )}
      <Button title="Borrar" color="#f44336" onPress={() => borrarTodo(index)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tareas Pendientes</Text>
      <View style={styles.addTask}>
        <TextInput
          style={styles.input}
          placeholder="Agregar nueva tarea"
          value={todoText}
          onChangeText={setTodoText}
        />
        <Button title="Agregar" onPress={agregarTodo} />
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Mostrar Tarea Más Rápida" onPress={tareaMasRapida} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addTask: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  todoItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  todoText: {
    fontSize: 16,
  },
  completed: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: 'grey',
  },
  completedTime: {
    fontSize: 12,
    color: 'grey',
    marginTop: 5,
  },
});
