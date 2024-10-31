import express from "express";
import session from "express-session";
import crypto from "crypto";
import cors from "cors";
import jwt from "jsonwebtoken";

// Generate a strong session secret
const secret = crypto.randomBytes(64).toString("hex");

const app = express();

// Enable CORS and specify allowed origins
app.use(
  cors({
    origin: "http://192.168.29.199:3000", // Allow requests from your frontend
    credentials: true,
  })
);

// AWS Cognito Hosted UI details
const cognitoDomain = ""; // Your Cognito domain
const clientId = ""; // Cognito App Client ID
const callbackUrl = "com.notion://auth"; // Change for local server testing
// const callbackUrl = "https://jwt.io/";
// Middleware for sessions
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    },
  })
);

// Google login via Cognito Hosted UI using Implicit Grant (response_type=token)
app.get("/auth/google", (req, res) => {
  console.log("Request received at /auth/google endpoint");
  // Use "token" as the response_type for Implicit Grant Type
  const loginUrl = `https://${cognitoDomain}/login?response_type=token&client_id=${clientId}&redirect_uri=${callbackUrl}&identity_provider=Google`;
  console.log("Redirecting to Cognito URL: ", loginUrl);
  res.redirect(loginUrl);
});

app.use(express.json());

//   const idToken = req.body.id_token || req.query.id_token;

//   if (!idToken) {
//     return res.status(400).json({ message: "ID Token is required" });
//   }

//   try {
//     // Decode the token to extract user information
//     const decodedToken = jwt.decode(idToken);

//     if (!decodedToken) {
//       return res.status(400).json({ message: "Invalid ID Token" });
//     }

//     // Extract specific user details from the decoded token
//     const { email, name, sub, picture, identities, email_verified } =
//       decodedToken;

//     // Return a structured response with the extracted details
//     res.status(200).json({
//       message: "User information extracted successfully",
//       user: {
//         email, // User's email address
//         name, // User's full name (if available)
//         userId: sub, // Unique identifier for the user
//         picture:
//           picture ||
//           (identities && identities[0].providerType === "Google"
//             ? `https://lh3.googleusercontent.com/a-/profile-picture-url`
//             : null), // Profile picture
//         provider: identities ? identities[0].providerName : "Google22", // Identity provider (e.g., Google)
//         emailVerified: email_verified, // Whether the email is verified
//       },
//     });
//   } catch (error) {
//     console.error("Error decoding the ID Token:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to decode ID Token", error: error.message });
//   }
// });

// app.get("/auth/apple", (req, res) => {
//   console.log("Request received at /auth/apple endpoint");
//   // Use "token" as the response_type for Implicit Grant Type
//   const loginUrl = `https://${cognitoDomain}/login?response_type=token&client_id=${clientId}&redirect_uri=${callbackUrl}&identity_provider=Apple`;
//   console.log("Redirecting to Cognito URL for Apple Sign-In: ", loginUrl);
//   res.redirect(loginUrl);
// });

// // Start Express server
app.listen(3000, () => {
  console.log("Server is running on http://192.168.29.199:3000");
});
