import { http, HttpResponse } from "msw";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Mock users database with password
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
  http.post("/auth/refresh", () => {
    return HttpResponse.json(
      { accessToken: "mock_new_access_token" },
      { status: 200 }
    );
  }),

  // LOGOUT
  http.post("/auth/logout", () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
