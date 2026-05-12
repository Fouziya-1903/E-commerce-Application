export default class UserModel{
    constructor(name, email, password, type, id){
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        this.id = id;
    }

    static signUp(name, email, password, type){
        const newUser = new UserModel(name, email, password, type);
        users.push(newUser);
        newUser.id = users.length + 1;
        return newUser;
    }

    static signIn(email, password){
        const user = users.find((u)=>{
            return u.email === email && u.password === password;
        });

        return user;
    }

    static getAll(){
        return users;
    }
}

const users = [
    {
        name: 'Seller User',
        email: 'seller@abcd.com',
        password: 'password1',
        type: 'seller'
    },

];