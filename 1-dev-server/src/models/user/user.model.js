export const User = class {

  constructor(id, username, password, timestamp){
    this.id = id
    this.username = username
    this.password = password
    this.created = timestamp
  }

  getUsername(){
    return this.username
  }

  getPassword(){
    return this.password
  }

  setToken(token){
    this.token = token
  }

  getCreationTime() {
    return this.created
  }

  getToken(){
    return this.token
  }

}