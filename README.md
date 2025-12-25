# RealTimeChat

A modern real-time chat application built with ASP.NET Core, SignalR, and React. This application enables users to create and join chat rooms, exchange messages in real-time, and see live updates of connected users.

**Live Application:** https://realtimechat.paweldywan.com/

## Overview

RealTimeChat is a production-ready, full-stack real-time communication platform that demonstrates the power of SignalR for bi-directional communication between clients and servers. The application uses .NET Aspire for orchestration, ASP.NET Core for the backend API, and a React frontend with TypeScript for a modern, responsive user interface.

## Key Features

- **Real-Time Messaging**: Instant message delivery using SignalR WebSocket connections
- **Multiple Chat Rooms**: Create and join different chat rooms dynamically
- **Live User Presence**: See who's currently in each room
- **Room Management**: Automatic room creation and deletion based on user participation
- **Connection Resilience**: Automatic reconnection with exponential backoff
- **Modern UI**: Responsive React-based interface with Bootstrap styling
- **Type Safety**: Full TypeScript support on the frontend
- **Swagger Documentation**: Interactive API documentation for development

## Architecture

This solution follows a distributed application architecture using .NET Aspire:

```plaintext
RealTimeChat/
|
+-- RealTimeChat.AppHost/
|   +-- Program.cs                    # .NET Aspire orchestration host
|   +-- RealTimeChat.AppHost.csproj
|
+-- RealTimeChat.Server/
|   +-- ChatHub.cs                    # SignalR hub for real-time communication
|   +-- Program.cs                    # ASP.NET Core web application
|   +-- RealTimeChat.Server.csproj
|
+-- RealTimeChat.ServiceDefaults/
|   +-- RealTimeChat.ServiceDefaults.csproj  # Shared service configurations
|
+-- realtimechat.client/
    +-- src/
    |   +-- App.tsx                   # Main React application
    |   +-- main.tsx                  # Application entry point
    |   +-- components/               # React components
    |   +-- interfaces/               # TypeScript interfaces
    +-- package.json
    +-- realtimechat.client.esproj
```

### Components

#### RealTimeChat.AppHost
The .NET Aspire orchestration project that manages the application lifecycle and configuration. It uses Aspire.Hosting.AppHost to coordinate the server project and handle service discovery.

#### RealTimeChat.Server
The ASP.NET Core backend that provides:
- SignalR hub (`ChatHub`) for real-time communication
- RESTful API endpoints
- Static file serving for the React frontend
- Swagger/OpenAPI documentation
- Docker support for containerized deployment

#### RealTimeChat.ServiceDefaults
Shared service configuration and extension methods used across backend projects for consistent service setup.

#### realtimechat.client
A React + TypeScript frontend built with Vite that provides:
- Modern, responsive UI using Reactstrap and Bootstrap
- SignalR client integration for real-time updates
- Room and user management interfaces
- Type-safe communication with the backend

## Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (version 8.0 or later)
- [Node.js](https://nodejs.org/) (version 18.0 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A code editor such as [Visual Studio 2022](https://visualstudio.microsoft.com/) or [Visual Studio Code](https://code.visualstudio.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/paweldywan/RealTimeChat.git
   cd RealTimeChat
   ```

2. Restore .NET dependencies:
   ```bash
   dotnet restore
   ```

3. Install frontend dependencies:
   ```bash
   cd realtimechat.client
   npm install
   cd ..
   ```

### Running the Application

#### Option 1: Using .NET Aspire (Recommended)

1. Set the AppHost project as the startup project
2. Run the application:
   ```bash
   cd RealTimeChat.AppHost
   dotnet run
   ```

This will start the Aspire dashboard and launch all required services. The dashboard provides monitoring and management capabilities for the distributed application.

#### Option 2: Running Server and Client Separately

**Backend:**

1. Navigate to the server directory:
   ```bash
   cd RealTimeChat.Server
   ```

2. Run the server:
   ```bash
   dotnet run
   ```

The server will start on `https://localhost:7123` (or the port specified in `launchSettings.json`).

**Frontend:**

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd realtimechat.client
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `https://localhost:5173` (default Vite port).

### Building for Production

**Backend:**
```bash
cd RealTimeChat.Server
dotnet publish -c Release -o ./publish
```

**Frontend:**
```bash
cd realtimechat.client
npm run build
```

The production build will be created in the `dist` folder and can be served by the ASP.NET Core backend.

## Technology Stack

### Backend
- **.NET 8**: Modern, high-performance framework
- **ASP.NET Core**: Web application framework
- **SignalR**: Real-time web functionality library
- **.NET Aspire**: Cloud-native orchestration framework
- **Swashbuckle**: Swagger/OpenAPI documentation generator

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and development server
- **Reactstrap**: React components for Bootstrap 5
- **@microsoft/signalr**: SignalR client library
- **Bootstrap 5**: CSS framework for responsive design

### Development Tools
- **ESLint**: Code linting for JavaScript/TypeScript
- **Docker**: Container support for deployment

## API Documentation

When running in development mode, Swagger UI is available at:
```
https://localhost:7123/swagger
```

### SignalR Hub Endpoints

The ChatHub (`/chathub`) provides the following methods:

#### Client-to-Server Methods

- **JoinRoom(string roomName)**: Join a specific chat room
- **LeaveRoom(string roomName)**: Leave the current chat room
- **SendMessageToRoom(string roomName, string user, string message)**: Send a message to a room
- **GetAvailableRooms()**: Retrieve list of all active rooms
- **GetUsersInRoom(string roomName)**: Get list of users in a specific room

#### Server-to-Client Events

- **ReceiveMessage(string user, string message)**: Receive a new message
- **ReceiveNewRoom(string roomName)**: Notification of new room creation
- **ReceiveRemovedRoom(string roomName)**: Notification of room deletion
- **ReceiveNewUser(string connectionId)**: User joined the room
- **ReceiveUserLeft(string connectionId)**: User left the room
- **ReceiveAvailableRooms(List<string> rooms)**: List of available rooms
- **ReceiveUsersInRoom(List<string> users)**: List of users in a room
- **Send(string message)**: System messages

## Usage

1. **Access the Application**: Navigate to the frontend URL in your browser
2. **Enter Username**: Provide a username when prompted
3. **Join/Create Room**: Either join an existing room or create a new one
4. **Start Chatting**: Send messages and see real-time updates from other users
5. **View Users**: See who else is in the room
6. **Switch Rooms**: Leave the current room and join another at any time

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

Please ensure your code:
- Follows the existing code style
- Includes appropriate comments
- Passes all builds and tests
- Updates documentation as needed

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Author

**Pawel Dywan**

- GitHub: [@paweldywan](https://github.com/paweldywan)
- Website: https://paweldywan.com/

## Acknowledgments

- Microsoft for the excellent SignalR library and .NET platform
- The React team for the powerful UI framework
- The Vite team for the blazing-fast build tool
- Bootstrap team for the responsive CSS framework
- The open-source community for inspiration and support

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/paweldywan/RealTimeChat/issues)
- Try the [live application](https://realtimechat.paweldywan.com/)
