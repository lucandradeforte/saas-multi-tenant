import { Column, Entity, PrimaryColumn } from "typeorm";
import { CustomerStatus } from "../../../domain/entities/customer-status.enum";

@Entity({ name: "customers" })
export class CustomerOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  companyId!: string;

  @Column({ length: 120 })
  name!: string;

  @Column({ length: 180 })
  email!: string;

  @Column({ type: "varchar", length: 40, nullable: true })
  phone!: string | null;

  @Column({ type: "varchar", length: 20 })
  status!: CustomerStatus;

  @Column({ type: "timestamp" })
  createdAt!: Date;

  @Column({ type: "timestamp" })
  updatedAt!: Date;
}
