export const openApiInfo = {
  title: "WCQuest API",
  version: "1.0.0",
  description: "WCQuest json api",
};

export const openApiServers = [
  {
    url: "https://wcquestserver-production.up.railway.app",
  },
  {
    url: "http://localhost:3000",
  },
];

export const openApiTags = [
  {
    name: "Auth",
    description: "Authentication endpoints",
  },
  { name: "Profile", description: "User profile endpoints" },
  {
    name: "Toilet",
    description: "Toilet endpoints",
  },
];
