import {
    useState,
    useEffect
} from 'react';

import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState
} from '@microsoft/signalr';

import {
    Container,
    List,
    Row
} from 'reactstrap';

import AppForm from './components/AppForm';

import {
    MessageData,
    RoomData
} from './interfaces';

import 'bootstrap/dist/css/bootstrap.css';

const App: React.FC = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    const [messages, setMessages] = useState<{ user: string, message: string }[]>([]);

    const [roomData, setRoomData] = useState<RoomData>({
        room: 'new',
        newRoom: ''
    });

    const [messageData, setMessageData] = useState<MessageData>({
        username: '',
        message: ''
    });

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
                await connection.send('SendMessageToRoom', roomData.room, messageData.username, messageData.message);

                setMessageData(prevState => ({ ...prevState, message: '' }));
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
                if (roomData.room !== 'new') {
                    await connection.send('LeaveRoom', roomData.room);
                }

                if (roomToJoin !== 'new') {
                    await connection.send('JoinRoom', roomToJoin);

                    await connection.send('GetUsersInRoom', roomToJoin);
                }
                else {
                    setUsers([]);
                }

                setRoomData({ room: roomToJoin, newRoom: '' });

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

            <AppForm
                onSubmit={e => {
                    e.preventDefault();

                    joinRoom(roomData.newRoom);
                }}
                className="mb-3"
                data={roomData}
                setData={setRoomData}
                inputs={[
                    {
                        id: 'room',
                        type: 'select',
                        options: rooms,
                        onChange: e => joinRoom(e.target.value),
                        label: 'Room'
                    },
                    {
                        id: 'newRoom',
                        label: 'New room'
                    }
                ]}
                rowProps={[{ sm: 2, xs: 1 }]}
                buttonProps={{
                    visible: roomData.room === 'new',
                    label: 'Join room'
                }}
            />

            <AppForm
                onSubmit={e => {
                    e.preventDefault();

                    sendMessage();
                }}
                className="mb-3"
                data={messageData}
                setData={setMessageData}
                inputs={[
                    {
                        id: 'username',
                        label: 'Username'
                    },
                    {
                        id: 'message',
                        label: 'Message'
                    }
                ]}
                rowProps={[{ sm: 2, xs: 1 }]}
                buttonProps={{
                    disabled: !messageData.username || !messageData.message || roomData.room === 'new',
                    label: 'Send'
                }}
            />

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
