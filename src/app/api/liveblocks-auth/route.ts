import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { faker } from "@faker-js/faker";

// Authenticating your Liveblocks application
// https://liveblocks.io/docs/rooms/authentication/access-token-permissions/nextjs

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

const liveblocks = new Liveblocks({
  secret: API_KEY!,
});

type UserInfo = {
  name: string;
  picture: string;
  color: string;
}

export async function POST(request: NextRequest) {
  let userId: string;
  let userInfo: UserInfo
  const cookies = request.headers.get("cookie");
  const userIdCookie = cookies && cookies.split("; ").find(row => row.startsWith("userId="));

  if (userIdCookie) {
    const decodedCookie = decodeURIComponent(userIdCookie.split("=")[1])
    const separatorIndex = decodedCookie.indexOf(':');
    
    userId = decodedCookie.substring(0, separatorIndex);
    userInfo = decodedCookie.substring(separatorIndex + 1) ? JSON.parse(decodedCookie.substring(separatorIndex + 1)) : createUserInfo();
   } else {
    userId = "user-" + Math.random().toString(36).substr(2, 9);
    userInfo = createUserInfo();
  }

  const cookieValue = `${userId}:${JSON.stringify(userInfo)}`;
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year from now
  const cookieHeader = `userId=${encodeURIComponent(cookieValue)}; Expires=${expiryDate.toUTCString()}; Path=/; HttpOnly`;

  const session = liveblocks.prepareSession(`user-${userId}`, {
    userInfo,
  });

  // Give the user access to the room
  const { room } = await request.json();
  session.allow(room, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { body, status } = await session.authorize();
  return new Response(body, {
    status,
    headers: {
      "Set-Cookie": cookieHeader,
    },
  });
}

const createUserInfo = () => ({
  name: faker.animal.fish(),
  color: faker.internet.color(),
  picture: faker.image.urlLoremFlickr({ category: 'animals', width: 80, height: 80 }),
});
