import { User as PrismaUser } from "@prisma/client";
import { UserPayload } from "../services/jwt.service";
declare global {
  namespace Express {
    interface User extends PrismaUser {}
    interface Request {
      authUser?: UserPayload;
    }
  }
}
// declare module "@prisma/client" {
//   interface Toilet {
//     location: Geolocation;
//   }
// }

// export type Geolocation = {
//   latitude: number;
//   longitude: number;
// };
