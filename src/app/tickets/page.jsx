'use client'
// pages/tickets.tsx
import React, { useState } from 'react';

// Updated ticket data with name and pass
const ticketData = [
  {
    "id": 1234,
    "name": "Samya",
    "pass": "Maharaja",
    "created": "2022-03-04T00:00:00.000Z",
    "status": "Open"
  },
  {
    "id": 5678,
    "name": "Ashysh",
    "pass": "Value",
    "created": "2022-02-04T00:00:00.000Z",
    "status": "Closed"
  },
  {
    "id": 9012,
    "name": "Bhavin",
    "pass": "Value",
    "created": "2022-02-02T00:00:00.000Z",
    "status": "Open"
  },
  {
    "id": 3456,
    "name": "Wafi",
    "pass": "Saga",
    "created": "2022-01-15T00:00:00.000Z",
    "status": "Open"
  },
  {
    "id": 7890,
    "name": "Swaraj",
    "pass": "E Trio",
    "created": "2022-01-10T00:00:00.000Z",
    "status": "Closed"
  }
];

const TicketsPage = () => {
  const [tickets, setTickets] = useState(ticketData);

  const addTicket = () => {
    const newTicket = {
      id: Date.now(),
      name: 'New Name',
      pass: 'New Pass',
      created: new Date().toISOString(),
      status: 'Open'
    };
    setTickets([...tickets, newTicket]);
  };

  const deleteTicket = (id) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
  };

  const updateTicket = (id, updates) => {
    setTickets(tickets.map(ticket => (
      ticket.id === id ? { ...ticket, ...updates } : ticket
    )));
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-black">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Tickets</h1>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg mb-6 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={addTicket}
      >
        Add Ticket
      </button>
      <div className="overflow-x-auto bg-gray-900 shadow-lg rounded-lg border border-gray-700">
        <table className="w-full table-auto text-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Pass</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Created</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {tickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-gray-800">
                <td className="px-6 py-3 text-sm">{ticket.id}</td>
                <td className="px-6 py-3 text-sm">
                  <input
                    type="text"
                    defaultValue={ticket.name}
                    onChange={e => updateTicket(ticket.id, { name: e.target.value })}
                    className="w-full px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-3 text-sm">
                  <input
                    type="text"
                    defaultValue={ticket.pass}
                    onChange={e => updateTicket(ticket.id, { pass: e.target.value })}
                    className="w-full px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-3 text-sm">{new Date(ticket.created).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-sm">
                  <select
                    value={ticket.status}
                    onChange={e => updateTicket(ticket.id, { status: e.target.value })}
                    className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="px-6 py-3 text-sm">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => deleteTicket(ticket.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsPage;
