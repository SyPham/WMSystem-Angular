export class LoggedInUser {
    constructor(accessToken: string, username: string, fullName: string, email: string, avatar: string,
                roles: any, permissions: any, listOcs: number[], isLeader: boolean, oCLevel: number
    ) {
        this.accessToken = accessToken;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.avatar = avatar;
        this.roles = roles;
        this.permissions = permissions;
        this.listOcs = listOcs;
        this.isLeader = isLeader;
        this.oCLevel = oCLevel;
    }
    public id: string;
    public accessToken: string;
    public username: string;
    public fullName: string;
    public email: string;
    public avatar: string;
    public permissions: any;
    public roles: any;
    public listOcs: number[];
    public isLeader: boolean;
    public oCLevel: number;
}