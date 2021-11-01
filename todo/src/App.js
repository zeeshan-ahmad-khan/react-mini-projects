import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
}

function App() {

  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "please enter the value", "danger")
    } else if (name && isEditing) {
      setList(list.map((item) => {
        if (item.id === editId) {
          return { ...item, title: name }
        }
        return item;
      }))
      setName("");
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "value changed", "success")
    } else {
      showAlert(true, "item added to the list", "success")
      let newItem = {
        id: new Date().getTime().toString(), title: name
      }
      setList([...list, newItem]);
      setName("");
    }
  }

  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  }

  const clearList = () => {
    showAlert(true, "list is cleared", "danger");
    setList([]);
  }

  const removeItem = (id) => {
    showAlert(true, "item is deleted", "danger");
    setList(list.filter((item) => item.id !== id))
  }

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title)
  }

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list))
  })

  return (
    <section className="section-center">
      <form className="todo-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>todo list</h3>
        <div className="form-control">
          <input type="text" className="todo" placeholder="e.g. learn react" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="todo-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>clear items</button>
        </div>
      )}
    </section>
  )
}

export default App
