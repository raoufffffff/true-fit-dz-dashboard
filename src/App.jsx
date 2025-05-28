import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  const getOrder = async () => {
    try {
      const res = await axios.get(`https://true-fit-dz-api.vercel.app/`);
      if (res.data.good) setOrder(res.data.result);
    } catch {
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const deleteOrder = async (id) => {
    try {
      const res = await axios.delete(`https://true-fit-dz-api.vercel.app/${id}`);
      if (res.data.good) getOrder();
    } catch {
      setErr(true);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(`https://true-fit-dz-api.vercel.app/${id}`, { status });
      if (res.data.good) getOrder();
    } catch {
      setErr(true);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    cancel: 'bg-red-100 text-red-800',
    done: 'bg-green-100 text-green-800',
    '1call': 'bg-blue-100 text-blue-800',
    '2call': 'bg-purple-100 text-purple-800',
  };

  const statusEmoji = {
    pending: '🕒',
    cancel: '❌',
    done: '✅',
    '1call': '📞',
    '2call': '📞📞',
  };

  if (loading) return <h1 className="text-center text-2xl font-bold mt-10">Loading...</h1>;
  if (err) return <h1 className="text-center text-2xl font-bold text-red-500 mt-10">Error fetching orders</h1>;

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Price</th>
            <th className="p-3">Ride</th>
            <th className="p-3">Size</th>
            <th className="p-3">Phone</th>
            <th className="p-3">State</th>
            <th className="p-3">City</th>
            <th className="p-3">Delivery</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {order.map((o, i) => (
            <tr key={i} className={`${statusColors[o.status] || 'bg-white'} transition-all`}>
              <td className="p-3 font-medium">{o.name}</td>
              <td className="p-3">{o.price} DA</td>
              <td className="p-3">{o.ride}</td>
              <td className="p-3">{o.size}</td>
              <td className="p-3">{o.phone}</td>
              <td className="p-3">{o.state}</td>
              <td className="p-3">{o.city}</td>
              <td className="p-3">{o.home ? "Yes 🏠" : "No 🏢"}</td>
              <td className="p-3 font-bold">
                {statusEmoji[o.status] || ''} {o.status}
              </td>
              <td className="p-3 flex flex-col gap-1">
                <select
                  className="p-1 rounded border text-sm"
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                >
                  <option value="pending">🕒 Pending</option>
                  <option value="cancel">❌ Cancel</option>
                  <option value="done">✅ Done</option>
                  <option value="1call">📞 1 Call</option>
                  <option value="2call">📞📞 2 Calls</option>
                </select>
                <button
                  onClick={() => deleteOrder(o._id)}
                  className="mt-1 bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
