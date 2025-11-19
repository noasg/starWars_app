import { http, HttpResponse } from "msw";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Mock users database
const users: User[] = [
  {
    id: "1",
    name: "Luke Skywalker",
    email: "luke@starwars.com",
    password: "jedi1",
  },
  {
    id: "2",
    name: "Leia Organa",
    email: "leia@starwars.com",
    password: "jedi2",
  },
];

// Mock people data
const mockPeopleArray = [
  {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    birth_year: "19BBY",
    films: [],
    created: new Date().toISOString(),
  },
  {
    name: "Leia Organa",
    height: "150",
    mass: "49",
    birth_year: "19BBY",
    films: [],
    created: new Date().toISOString(),
  },
  // Add more as needed
];

export const handlers = [
  // LOGIN
  http.post("/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return HttpResponse.json(
      {
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 }
    );
  }),

  // REFRESH
  http.post("/auth/refresh", async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken: string };

    if (refreshToken === "expired_token") {
      return HttpResponse.json(
        { message: "Refresh token expired" },
        { status: 401 }
      );
    }

    return HttpResponse.json(
      { accessToken: "mock_new_access_token" },
      { status: 200 }
    );
  }),

  // LOGOUT
  http.post("/auth/logout", () => new HttpResponse(null, { status: 204 })),

  // PEOPLE endpoint
  http.get("/people", ({ request }) => {
    const auth = request.headers.get("authorization");

    // Simulate 401 if token is expired
    if (auth === "Bearer expired_token") {
      return HttpResponse.json({ message: "Token expired" }, { status: 401 });
    }

    return HttpResponse.json(
      { count: mockPeopleArray.length, results: mockPeopleArray },
      { status: 200 }
    );
  }),

  http.get("/protected/secret", ({ request }) => {
    const auth = request.headers.get("authorization");

    if (auth === "Bearer expired_token") {
      console.log("⚠️ MSW: returning 401 for expired token");
      return HttpResponse.json({ message: "Token expired" }, { status: 401 });
    }

    console.log("✅ MSW: returning protected data");
    return HttpResponse.json(
      { secret: "The Force is strong with you!" },
      { status: 200 }
    );
  }),
];
