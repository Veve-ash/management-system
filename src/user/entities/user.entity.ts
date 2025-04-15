import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Role } from "../enum/user.role.enum"

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    firstName:string

    @Column()
    lastName:string

    @Column({unique:true})
    Email:string

    @Column()
    Password:string

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User
    })
    role: Role;
}
