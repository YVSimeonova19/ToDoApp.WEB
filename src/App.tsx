import { useEffect, useState } from "react";
import "./App.css";

interface Todo {
  id: string;
  name: string;
  isChecked: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  useEffect(() => {
    async function fetchTodos() {
      const response = await fetch("http://localhost:5062/api/todoitem/");
      const data = await response.json();
      setTodos(data);
    }
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      const response = await fetch("http://localhost:5062/api/todoitem/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTodo
        }),
      });

      const data = await response.json();

      setTodos([...todos, data]);
      setNewTodo("");
    }
  };

  const handleToggleTodo = async (index: number) => {
    await fetch(`http://localhost:5062/api/todoitem/checkout/${todos[index].id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const updatedTodos = [...todos];
    updatedTodos[index].isChecked = !updatedTodos[index].isChecked;
    setTodos(updatedTodos);
  };

  return (
    <div className="app">
      <h1>To-Do App</h1>
      <div className="todo-list">
        {todos.map((todo, index) => (
          <div
            key={index}
            className={`todo-item ${todo.isChecked ? "checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.isChecked}
              onChange={() => handleToggleTodo(index)}
            />
            <span>{todo.name}</span>
          </div>
        ))}
      </div>
      <div className="add-todo">
        <input type="text" value={newTodo} onChange={handleInputChange} />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
    </div>
  );
}

export default App;
