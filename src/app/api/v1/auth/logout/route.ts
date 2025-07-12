// // src/app/api/v1/auth/logout/route.ts

// import { NextResponse } from "next/server";

// // It's good practice for an action like logout to be a POST request
// export async function POST() {
//   try {
//     // Create a response object
//     const response = NextResponse.json({
//       success: true,
//       message: "Logged out successfully.",
//     });

//     // Instruct the browser to clear the 'auth-token' cookie
//     response.cookies.set("auth-token", "", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 0, // Setting maxAge to 0 tells the browser to expire the cookie immediately
//     });

//     return response;
//   } catch (e: any) {
//     return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";

export async function POST() {
  // Clear the cookie by setting it to empty and maxAge to 0
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set("access_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
