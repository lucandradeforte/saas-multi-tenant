import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { UserRole } from "../../../domain/entities/user-role.enum";

@Entity({ name: "users" })
export class UserOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  companyId!: string;

  @Column({ length: 120 })
  name!: string;

  @Index({ unique: true })
  @Column({ length: 180 })
  email!: string;

  @Column({ length: 255 })
  passwordHash!: string;

  @Column({ type: "varchar", length: 20 })
  role!: UserRole;

  @Column({ type: "varchar", length: 255, nullable: true })
  refreshTokenHash!: string | null;

  @Column({ type: "timestamp" })
  createdAt!: Date;

  @Column({ type: "timestamp" })
  updatedAt!: Date;
}
