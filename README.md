# RealTimeChat

A real-time chat application with a .NET backend and a React (Vite) frontend.

## Project Structure

- **RealTimeChat.AppHost/**: .NET application host configuration and entry point.
- **RealTimeChat.Server/**: ASP.NET Core server hosting the chat API and SignalR hub.
- **RealTimeChat.ServiceDefaults/**: Shared service configuration and extensions for the backend.
- **realtimechat.client/**: Frontend client built with React and Vite.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (v18+ recommended)](https://nodejs.org/)

## Getting Started

### Backend

1. Navigate to the backend folder:
   ```pwsh
   cd RealTimeChat.AppHost
   ```
2. Restore dependencies and run the server:
   ```pwsh
   dotnet restore
   dotnet run
   ```
   The server will start on the port specified in `appsettings.json` or `launchSettings.json`.

### Frontend

1. Navigate to the client folder:
   ```pwsh
   cd realtimechat.client
   ```
2. Install dependencies:
   ```pwsh
   npm install
   ```
3. Start the development server:
   ```pwsh
   npm run dev
   ```
   The app will be available at the URL shown in the terminal (usually http://localhost:5173).

## Features

- Real-time chat using SignalR
- Modern React frontend (Vite, TypeScript)
- .NET 8 backend

## Development

- Backend code: `RealTimeChat.Server/`, `RealTimeChat.AppHost/`, `RealTimeChat.ServiceDefaults/`
- Frontend code: `realtimechat.client/src/`

## Demo

[Live Demo](https://realtimechat.paweldywan.com/)

## License

MIT License
