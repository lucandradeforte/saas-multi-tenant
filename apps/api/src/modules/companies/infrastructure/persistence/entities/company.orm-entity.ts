import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({ name: "companies" })
export class CompanyOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ length: 120 })
  name!: string;

  @Index({ unique: true })
  @Column({ length: 80 })
  slug!: string;

  @Column({ type: "timestamp" })
  createdAt!: Date;

  @Column({ type: "timestamp" })
  updatedAt!: Date;
}
