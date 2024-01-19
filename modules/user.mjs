class User {

    constructor(email, pswHash, UserName) {
        ///TODO: Are these the correct fields for your project?
        this.email = email || "";
        this.pswHash = pswHash || "";
        this.UserName = UserName || "";
    }
}

export default User;