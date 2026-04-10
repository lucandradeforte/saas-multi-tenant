import { UserRole } from "../../modules/users/domain/entities/user-role.enum";

export interface AuthenticatedUser {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
}
