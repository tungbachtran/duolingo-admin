export interface User{
    fullName: string;
    avatarImage: string;
    roleId:{
        _id:string;
        name:string;
        permissions:string[];
    }
}

export interface UserResponse{
    value:{
        data:User;
    }
}