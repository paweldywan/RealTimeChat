var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.RealTimeChat_Server>("realtimechat-server");

builder.Build().Run();
