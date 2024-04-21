import React, { useState, useEffect } from 'react';
import './App.css';
// import io from 'socket.io-client';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// const socket = io('ws://localhost:8000');

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({ id: 0, name: '', email: '', phone: '' });
  const [filterCriteria, setFilterCriteria] = useState<keyof User>('name');
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  // useEffect(() => {
  //   socket.on('newUser', (newUser: User) => {
  //     setUsers(prevUsers => [...prevUsers, newUser]);
  //     setFilteredUsers(prevUsers => [...prevUsers, newUser]);
  //   });
  //   return () => {
  //     socket.off('newUser');
  //   };
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://62ebdaa155d2bd170e77cf6d.mockapi.io/users');
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^[0-9\b]+$/;
    return re.test(phone);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = users.filter((user) => {
      if (filterCriteria === 'name') {
        return user.name.toLowerCase().includes(searchTerm);
      } else if (filterCriteria === 'email') {
        return user.email.toLowerCase().includes(searchTerm);
      }
      return false;
    });
    setFilteredUsers(filtered);
  };

  const handleCriteriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCriteria(e.target.value as keyof User);
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    if (!validateEmail(newUser.email)) {
      setEmailError('Некорректный формат почты');
      return;
    } else {
      setEmailError('');
    }

    if (!validatePhone(newUser.phone)) {
      setPhoneError('Некорректный формат номера');
      return;
    } else {
      setPhoneError('');
    }

    try {
      const response = await fetch('https://62ebdaa155d2bd170e77cf6d.mockapi.io/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      setUsers([...users, data]);
      setFilteredUsers([...filteredUsers, data]);
      setNewUser({ id: 0, name: '', email: '', phone: '' });
      // socket.emit("newUser", newUser);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const isAddButtonDisabled =
    !newUser.name || !newUser.email || !newUser.phone || !!emailError || !!phoneError;

  return (
    <div className="App">
      <div className="list-container">
        <h1>Список пользователей</h1>
        <div className="filter-container">
          <input type="text" placeholder="Поиск .." onChange={handleFilterChange} />
          <select value={filterCriteria} onChange={handleCriteriaChange}>
            <option value="name">Имя</option>
            <option value="email">Почта</option>
          </select>
        </div>
        <div>
          {filteredUsers.map((user) => (
            <div key={user.id}>
              <hr></hr>
              <p>Имя: {user.name}</p>
              <p>Почта: {user.email}</p>
              <p>Телефон: {user.phone}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="add-container">
        <h2>Добавить нового пользователя</h2>
        <div className="addForm">
          <input
            type="text"
            placeholder="Имя"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Почта"
            value={newUser.email}
            onChange={(e) => {
              setNewUser({ ...newUser, email: e.target.value });
              setEmailError('');
            }}
          />
          {emailError && <span className="error">{emailError}</span>}
          <input
            type="text"
            placeholder="Телефон"
            value={newUser.phone}
            onChange={(e) => {
              setNewUser({ ...newUser, phone: e.target.value });
              setPhoneError('');
            }}
          />
          {phoneError && <span className="error">{phoneError}</span>}
          <button onClick={handleAddUser} disabled={isAddButtonDisabled}>
            Добавить пользователя
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
