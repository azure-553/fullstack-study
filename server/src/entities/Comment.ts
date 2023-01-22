import { Exclude, Expose } from "class-transformer";
import { BaseEntity, BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { makeId } from "../utils/helper";
import Post from "./Post";
import User from "./User";
import Vote from "./Vote";

@Entity("comments")
export default class Comment extends BaseEntity {
    @Index()
    @PrimaryColumn()
    identifier: string;

    @Column()
    body: string;

    @Column()
    username: string;

    @ManyToOne(() => User)
    @JoinColumn({name: "username",referencedColumnName:"username"})
    user: User;

    @Column()
    postId: number;

    @ManyToOne(() => Post,(post) => post.comments,{nullable: false})
    post: Post;

    @Exclude()
    @OneToMany(() => Vote,(Vote) => Vote.comment)
    votes: Vote[];

    protected userVote: number;

    setUserVote(user:User) {
        const index = this.votes?.findIndex((v) => v.username === user.username);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }

    @Expose() get voteScore(): number {
        const initalValue = 0
        return this.votes?.reduce((previousValue,currentObject) => previousValue+(currentObject.value || 0),initalValue); 
    }

    @BeforeInsert()
    makeId(){
        this.identifier = makeId(8)
    }
}