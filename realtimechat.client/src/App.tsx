import React, { useState, useEffect } from 'react';
import './App.css';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

const App: React.FC = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    const [messages, setMessages] = useState<{ user: string, message: string }[]>([]);

    const [message, setMessage] = useState<string>('');

    const [username, setUsername] = useState<string>('');

    const [room, setRoom] = useState<string>('new');

    const [newRoom, setNewRoom] = useState<string>('');

    const [rooms, setRooms] = useState<string[]>([]);

    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('/chathub')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        const startConnection = async () => {
            if (connection) {
                try {
                    await connection.start();

                    console.log('Connected!');

                    connection.on('ReceiveMessage', (user: string, message: string) => setMessages(messages => [...messages, { user, message }]));

                    connection.on('ReceiveAvailableRooms', (rooms: string[]) => setRooms(['new', ...rooms]));

                    connection.on('ReceiveNewRoom', (room: string) => setRooms(rooms => [...rooms, room]));

                    connection.on('ReceiveRemovedRoom', (room: string) => setRooms(rooms => rooms.filter(r => r !== room)));

                    connection.on('ReceiveUsersInRoom', (users: string[]) => setUsers(users));

                    connection.on('ReceiveNewUser', (connectionId: string) => setUsers(users => [...users, connectionId]));

                    connection.on('ReceiveUserLeft', (connectionId: string) => setUsers(users => users.filter(u => u !== connectionId)));

                    connection.on('Send', (message: string) => setMessages(messages => [...messages, { user: 'System', message }]));

                    await connection.send('GetAvailableRooms');
                } catch (e) {
                    console.error('Connection failed: ', e);
                }
            }
        };

        startConnection();
    }, [connection]);

    const sendMessage = async () => {
        if (connection?.state === HubConnectionState.Connected) {
            try {
                await connection.send('SendMessageToRoom', room, username, message);

                setMessage('');
            } catch (e) {
                console.error(e);
            }
        } else {
            alert('No connection to server yet.');
        }
    };

    const joinRoom = async (roomToJoin: string) => {
        if (connection?.state === HubConnectionState.Connected) {
            try {
                if (room !== 'new') {
                    await connection.send('LeaveRoom', room);
                }

                if (roomToJoin !== 'new') {
                    await connection.send('JoinRoom', roomToJoin);

                    await connection.send('GetUsersInRoom', roomToJoin);
                }

                setRoom(roomToJoin);

                setNewRoom('');

                setMessages([]);
            } catch (e) {
                console.error(e);
            }
        } else {
            alert('No connection to server yet.');
        }
    };

    return (
        <div>
            <h1>Chat Application</h1>

            <div>
                <select
                    value={room}
                    onChange={e => joinRoom(e.target.value)}
                >
                    {rooms.map((r, index) => (
                        <option key={index}>{r}</option>
                    ))}
                </select>

                {room === 'new' &&
                    <input
                        placeholder="New Room"
                        value={newRoom}
                        onChange={e => setNewRoom(e.target.value)}
                        style={{ marginLeft: ".5rem" }}
                    />}
            </div>

            {room === 'new' &&
                <div style={{ marginTop: ".5rem", marginBottom: ".5rem" }}>
                    <button
                        onClick={() => joinRoom(newRoom)}
                    >
                        Add room
                    </button>
                </div>}

            <div>
                <input
                    placeholder="Name"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>

            <div>
                <input
                    placeholder="Message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
            </div>

            <div style={{ marginTop: ".5rem" }}>
                <button
                    onClick={sendMessage}
                    disabled={!username || !message || room === 'new'}
                >
                    Send
                </button>
            </div>

            <div>
                <h2>Users:</h2>
                <ul
                    style={{
                        listStyleType: 'none',
                        padding: 0
                    }}
                >
                    {users.map((u, index) => (
                        <li key={index}>{u}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Messages:</h2>
                <ul
                    style={{
                        listStyleType: 'none',
                        padding: 0
                    }}
                >
                    {messages.map((m, index) => (
                        <li key={index}><strong>{m.user}:</strong> {m.message}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
