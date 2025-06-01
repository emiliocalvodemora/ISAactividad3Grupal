import { useEffect, useState } from 'react';
import './Comments.css';


function Comments({ stationId, user }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:4000/api/comments/${stationId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [stationId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4000/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, station_id: stationId, comment })
    });
    const data = await res.json();
    if (res.ok) {
      setComment('');
      setMsg('¡Comentario enviado!');
      fetchComments();
    } else {
      setMsg(data.message);
    }
  };


  return (
    <div className="comments-section">
      <h3>Comentarios de los usuarios</h3>
      {
        !user && (
          <p>Inicia sesión para dejar un comentario.</p>
        )
      }
      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            required
          />
          <button type="submit">Enviar</button>
        </form>
      )}
      {msg && <p>{msg}</p>}
      <ul className="comments-list">
        {comments.map((c, idx) => (
          <li key={idx}>
            <strong>{c.username}</strong> <em>({new Date(c.created_at).toLocaleString()})</em>
            <div>{c.comment}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Comments;