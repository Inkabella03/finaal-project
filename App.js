import React, { useState, useEffect } from 'react';

const App = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [score, setScore] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // Fetch data from API
    fetch('https://backendexample.sanbercloud.com/api/student-scores')
      .then(response => response.json())
      .then(data => setStudents(data));
  }, []);

  const handleDelete = id => {
    fetch(`https://backendexample.sanbercloud.com/api/student-scores/${id}`, {
      method: 'DELETE',
    }).then(() => setStudents(students.filter(item => item.id !== id)));
  };

  const handleEdit = (id, student) => {
    setEditingId(id);
    setName(student.name);
    setCourse(student.course);
    setScore(student.score);
  };

  const handleSubmit = () => {
    if (editingId) {
      // Update existing data
      fetch(`https://backendexample.sanbercloud.com/api/student-scores/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, course, score }),
      })
        .then(response => response.json())
        .then(updatedData => {
          setStudents(students.map(item => (item.id === editingId ? updatedData : item)));
          setEditingId(null);
        });
    } else {
      // Add new data
      fetch('https://backendexample.sanbercloud.com/api/student-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, course, score }),
      })
        .then(response => response.json())
        .then(newData => setStudents([...students, newData]));
    }

    // Reset form
    setName('');
    setCourse('');
    setScore('');
  };

  return (
    <div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>NO</th>
            <th style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>NAMA</th>
            <th style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>MATA KULIAH</th>
            <th style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>NILAI</th>
            <th style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>INDEKS NILAI</th>
            <th style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>{index + 1}</td>
              <td style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>{student.name}</td>
              <td style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>{student.course}</td>
              <td style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>{student.score}</td>
              <td style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>A</td>
              <td style={{ textAlign: 'left', padding: '8px', border: '1px solid black' }}>
                <button onClick={() => handleEdit(student.id, student)}>Edit</button>
                <button onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
          Course:
          <input type="text" value={course} onChange={e => setCourse(e.target.value)} />
        </label>
        <label>
          Score:
          <input type="text" value={score} onChange={e => setScore(e.target.value)} />
        </label>
        <button type="submit">{editingId ? 'Update' : 'Submit'}</button>
      </form>
    </div>
  );
};

export default App;
