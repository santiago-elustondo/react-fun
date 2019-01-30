import * as endpoints from './endpoints.functions'

export class ThinkerSDK {

  constructor() {
    this._user = JSON.parse(localStorage.getItem('thinker-user'))
    this._token = localStorage.getItem('thinker-token')
    this._authState = 'LOADING'
    this._authhandlers = []
    if (this._token)
      this.tokenIsValid().then(isValid => {
        if (isValid) this._updateAuthState('LOGGED-IN')
        else this.logout()
      })
    else this.logout()
  }

  user() {
    return this._user
  }

  subscribeToAuthState(handler) {
    this._authhandlers.push(handler)
    setTimeout(() => handler(this._authState))
  }

  async tokenIsValid() {
    if (!this._token) return false
    const validateResponse = await endpoints.validateToken({ token: this._token })
    return (
      validateResponse.response.status === 200 &&
      validateResponse.body._id === this._user._id 
    )
  }

  async signup({ username, password }) {
    const signUpResponse = await endpoints.signUp({ username, password })
    if (signUpResponse.response.ok) {
      this._setUser(signUpResponse.body)
      return this.login({ username, password })
    } else return { success: false }
  }

  async login({ username, password }) {
    const loginResponse = await endpoints.logIn({ username, password })
    if (loginResponse.response.ok) {
      this._setToken(loginResponse.body.token)
      this._setUser(loginResponse.body.user)
      this._updateAuthState('LOGGED-IN')
      return { success: true, user: this._user }
    } else {
      return { success: false }
    }
  }

  async logout() {
    this._setUser(null)
    this._setToken(null)
    this._updateAuthState('LOGGED-OUT')
  }

  // deprecated
  async listUsers() {
    return this.fetchUsers()
  }
  
  async fetchUsers() {
    const response = await endpoints.listUsers()
    return response.body
  }

  // deprecated
  async listUserThoughts({ userId }) {
    return this.fetchUserThoughts({ userId })
  }

  async fetchUserThoughts({ userId }) {
    const response = await endpoints.listUserThoughts({ userId, token: this._token })
    const thoughts = response.body
    thoughts.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
    return thoughts
  }

  // deprecated
  async getComments({ thoughtId, userId }) {
    return this.fetchComments({ thoughtId, userId })
  }

  async fetchCommentsForThought({ thoughtId, userId }) {
    const allUsers = await this.fetchUsers()
    const commentsResponse = await endpoints.getCommentsForThought({ userId, thoughtId, token: this._token })
    const comments = commentsResponse.body
    comments.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
    const commentsWithUser = comments.map(comment => ({
      ...comment,
      user: allUsers.find(u => comment.userId === u._id)
    }))
    return commentsWithUser
  }

  async fetchThoughts() {
    const users = await this.fetchUsers()
    const userThoughts = await Promise.all(
      users.map(u => this.fetchUserThoughts({ userId: u._id }))
    )
    const allThoughts = userThoughts.reduce((allThoughts, thoughtsOfUser, i) => 
      allThoughts.concat(
        thoughtsOfUser.map(thought => Object.assign(thought, { 
          user: users[i]
        }))
      ), [])
    const commentsForThoughts = await Promise.all(
      allThoughts.map(t => this.fetchCommentsForThought({ thoughtId: t._id, userId: t.user._id }))
    )
    allThoughts.forEach((thought, i) => thought.comments = commentsForThoughts[i])
    allThoughts.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
    return allThoughts
  }

  async getUser({ userId }) {
    const allUsers = await this.listUsers()
    return allUsers.find(u => u._id === userId)
  }

  async getUserComplete({ userId }) {
    const user = await this.getUser({ userId })
    const followers = await this.getFollowers({ userId })
    const thoughts = await this.listUserThoughts({ userId })
    const commentsForThoughts = await Promise.all(
      thoughts.map(t => this.getComments({ thoughtId: t._id, userId: user._id }))
    )

    thoughts.forEach((thought, i) => thought.comments = commentsForThoughts[i])
    
    return { ...user, thoughts, followers }
  }

  async getComments({ thoughtId, userId }) {
    const allUsers = await this.listUsers()
    const commentsResponse = await endpoints.getCommentsForThought({ userId, thoughtId, token: this._token })
    const comments = commentsResponse.body
    comments.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
    
    const commentsWithUser = comments.map(comment => ({
      ...comment,
      user: allUsers.find(u => comment.userId === u._id)
    }))

    return commentsWithUser
  }

  async getFollowers({ userId }) {
    const followersResponse = await endpoints.getUserFollowers({ userId, token: this._token })
    if (followersResponse.response.ok) return followersResponse.body
    else return [] // fails (500) when empty
  }

  async getFollowings({ userId }) {
    const followingResponse = await endpoints.getUserFollowing({ userId, token: this._token })
    if (followingResponse.response.ok) return followingResponse.body
    else return [] // fails (500) when empty
  }

  async follow({ userId }) {
    const followResponse = await endpoints.followUser({ 
      followerId: this._user._id, 
      broadcasterId: userId, 
      token: this._token 
    })
    return followResponse.body
  }

  async unfollow({ userId }) {
    console.log(userId)
    const unfollowResponse = await endpoints.unfollowUser({ 
      followerId: this._user._id, 
      broadcasterId: userId, 
      token: this._token 
    })
    return unfollowResponse.body
  }

  async getThought({ thoughtId, userId }) {
    const allUsers = await this.listUsers()
    const user = allUsers.find(u => u._id === userId)
    const thoughts = await this.listUserThoughts({ userId })
    const thought = thoughts.find(t => t._id === thoughtId)
    const commentsResponse = await endpoints.getCommentsForThought({ userId, thoughtId, token: this._token })
    const comments = commentsResponse.body
    comments.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
    
    const commentsWithUser = comments.map(comment => ({
      ...comment,
      user: allUsers.find(u => comment.userId === u._id)
    }))

    return { ...thought, user, comments: commentsWithUser }
  }

  _commentWatchers = {}

  subscribeToComments({ userId, thoughtId, handler = () => {}, errHandler = () => {} }){

    if (!this._commentWatchers[thoughtId]) 
      this._commentWatchers[thoughtId] = {
        currentVal: undefined,
        interval: setInterval(async () => {

          const commentsResponse = await endpoints.getCommentsForThought({ 
            userId, 
            thoughtId, 
            token: this._token 
          })

          // not checking if listUsers fails, so why check at all?
          // if (commentsResponse.response.ok) {
            const allUsers = await this.listUsers()

            const comments = commentsResponse.body

            const commentsWithUser = comments.map(comment => ({
              ...comment,
              user: allUsers.find(u => comment.userId === u._id)
            }))

            const w = this._commentWatchers[thoughtId]
            commentsWithUser.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
            
            w.currentVal = commentsWithUser
            w.handlers.forEach(h => setTimeout(() => h(w.currentVal)))
          // } else {
          //   w.errHandlers.forEach(h => setTimeout(() => h(commentsResponse.response.code)))
          // }

        }, 2000),
        handlers: [],
        errHandlers: []
      }
    
    const w = this._commentWatchers[thoughtId]
    
    if (!w.handlers.includes(handler))
      w.handlers.push(handler)

    if (!w.errHandlers.includes(errHandler))
      w.errHandlers.push(errHandler)
    
    if (w.currentVal) 
      setTimeout(() => handler(w.currentVal))
  }


  async addComment({ userId, thoughtId, content }) {
    const response = await endpoints.addCommentForThought({ userId, thoughtId, content, token: this._token })
    const comment = response.body
    const user = await this.getUser({ userId })

    return {
      ...comment,
      user
    }
  }

  async addThought({ content }) {
    const response = await endpoints.addThought({ 
      userId: this._user._id, 
      content, 
      token: this._token 
    })

    console.log(response)

    const thought = response.body

    return {
      ...thought,
      user: this._user
    }
  }

  _updateAuthState(state) {
    this._authState = state
    this._authhandlers.forEach(h => setTimeout(() => h(state)))
  }

  _setUser(user) {
    localStorage.setItem('thinker-user', JSON.stringify(user))
    this._user = user
  }

  _setToken(token) {
    localStorage.setItem('thinker-token', token)
    this._token = token
  }

}