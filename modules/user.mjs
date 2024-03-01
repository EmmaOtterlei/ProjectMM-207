class User {
    constructor(email, pswHash, UserName) {
      this.email = email || "";
      this.pswHash = pswHash || "";
      this.UserName = UserName || "";
      this.id = null; // Adding an id property
  
      // Alternatively, you can initialize these properties in the constructor if needed
      // this.email = "";
      // this.pswHash = "";
      // this.UserName = "";
    }
  
    async save() {
      if (this.id == null) {
        // If the user doesn't have an ID, create a new user
        const createdUser = await DBManager.createUser(this);
        this.id = createdUser.id; // Assuming DBManager.createUser returns the user with an ID
      } else {
        // If the user has an ID, update the existing user
        await DBManager.updateUser(this);
      }
    }
  
    delete() {
      // Delete the user using the DBManager
      DBManager.deleteUser(this);
    }
  }
  
  export default User;