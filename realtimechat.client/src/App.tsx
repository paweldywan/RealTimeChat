import React, { useState, useEffect } from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Container, Form, FormGroup, Input, Label, List, Row } from 'reactstrap';

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
                else {
                    setUsers([]);
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
        <Container>
            <h1>Chat Application</h1>

            <Form
                onSubmit={e => {
                    e.preventDefault();

                    joinRoom(newRoom);
                }}
                className="mb-3"
            >
                <Row sm="2" xs="1">
                    <FormGroup>
                        <Label for="room">Room</Label>

                        <Input
                            type="select"
                            value={room}
                            onChange={e => joinRoom(e.target.value)}
                            id="room"
                        >
                            {rooms.map((r, index) => (
                                <option key={index}>{r}</option>
                            ))}
                        </Input>
                    </FormGroup>

                    {room === 'new' &&
                        <FormGroup>
                            <Label for="newRoom">New room</Label>

                            <Input
                                value={newRoom}
                                onChange={e => setNewRoom(e.target.value)}
                                id="newRoom"
                            />
                        </FormGroup>}
                </Row>

                {room === 'new' &&
                    <Button>
                        Add room
                    </Button>}
            </Form>

            <Form
                onSubmit={e => {
                    e.preventDefault();

                    sendMessage();
                }}
                className="mb-3"
            >
                <Row sm="2" xs="1">
                    <FormGroup>
                        <Label for="username">Username</Label>

                        <Input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            id="username"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="message">Message</Label>

                        <Input
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            id="message"
                        />
                    </FormGroup>
                </Row>

                <Button
                    disabled={!username || !message || room === 'new'}
                >
                    Send
                </Button>
            </Form>

            <Row>
                <h2>Users:</h2>

                <List type="unstyled">
                    {users.map((u, index) => (
                        <li key={index}>{u}</li>
                    ))}
                </List>
            </Row>

            <Row>
                <h2>Messages:</h2>

                <List type="unstyled">
                    {messages.map((m, index) => (
                        <li key={index}><strong>{m.user}:</strong> {m.message}</li>
                    ))}
                </List>
            </Row>
        </Container >
    );
};

export default App;
