import { useState, useEffect, useCallback } from 'react';
import './Toast.css';

let counter = 0;
let pushToast = null;

export function showToast(msg, type = 'error') {
  if (pushToast) pushToast(msg, type);
}

function Toast({ id, message, type, onRemove }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(id), 300);
    }, 3500);
    return () => clearTimeout(t);
  }, [id, onRemove]);

  function close() {
    setExiting(true);
    setTimeout(() => onRemove(id), 300);
  }

  const icons = { error: '✕', success: '✓', warning: '⚠' };

  return (
    <div className={`toast toast-${type} ${exiting ? 'toast-exit' : ''}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={close} aria-label="Close">✕</button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type) => {
    setToasts(prev => [...prev, { id: ++counter, message: msg, type }]);
  }, []);

  const remove = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    pushToast = add;
    return () => { pushToast = null; };
  }, [add]);

  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <Toast key={t.id} id={t.id} message={t.message} type={t.type} onRemove={remove} />
      ))}
    </div>
  );
}

export default Toast;
