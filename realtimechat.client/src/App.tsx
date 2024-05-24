import React, { useState, useEffect } from 'react';
import './App.css';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

const App: React.FC = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    const [messages, setMessages] = useState<{ user: string, message: string }[]>([]);

    const [message, setMessage] = useState<string>('');

    const [username, setUsername] = useState<string>('');

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
                await connection.send('SendMessage', username, message);

                setMessage('');
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
                <input
                    type="text"
                    placeholder="Name"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
            </div>
            <div style={{ marginTop: ".5rem" }}>
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                <h2>Messages:</h2>
                <ul>
                    {messages.map((m, index) => (
                        <li key={index}><strong>{m.user}:</strong> {m.message}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
