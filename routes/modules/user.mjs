class User {

    constructor(email, pswHash, userName) {
        ///TODO: Are these the correct fields for your project?
        this.email = email || "";
        this.pswHash = pswHash || "";
        this.userName = userName || "";
    }
}

export default User;