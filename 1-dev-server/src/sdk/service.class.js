import * as endpoints from './endpoints.functions'

export class ThinkerSDK {

  constructor() {
    this._user = JSON.parse(localStorage.getItem('thinker-user'))
    this.token = localStorage.getItem('thinker-token')
    this.authState = 'LOADING'
    this.authHandlers = []
    if (this.token)
      this.tokenIsValid().then(isValid => {
        if (isValid) this._updateAuthState('LOGGED-IN')
        else this.logout()
      })
    else this.logout()
  }

  subscribeToAuthState(handler) {
    this.authHandlers.push(handler)
    setTimeout(() => handler(this.authState))
  }

  user() {
    return this._user
  }

  _updateAuthState(state) {
    this.authState = state
    this.authHandlers.forEach(h => setTimeout(() => h(state)))
  }

  _setUser(user) {
    localStorage.setItem('thinker-user', JSON.stringify(user))
    this._user = user
  }

  _setToken(token) {
    localStorage.setItem('thinker-token', token)
    this.token = token
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

  async tokenIsValid() {
    if (!this.token) return false
    const validateResponse = await endpoints.validateToken({ token: this.token })
    return (
      validateResponse.response.status === 200 &&
      validateResponse.body._id === this._user._id 
    )
  }

  async listUsers() {
    const response = await endpoints.listUsers()
    return response.body
  }

  async listUserThoughts({ userId }) {
    const response = await endpoints.listUserThoughts({ userId, token: this.token })
    const thoughts = response.body
    thoughts.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
    return thoughts
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
    const commentsResponse = await endpoints.getCommentsForThought({ userId, thoughtId, token: this.token })
    const comments = commentsResponse.body
    comments.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
    
    const commentsWithUser = comments.map(comment => ({
      ...comment,
      user: allUsers.find(u => comment.userId === u._id)
    }))

    return commentsWithUser
  }

  async getFollowers({ userId }) {
    const followersResponse = await endpoints.getUserFollowers({ userId, token: this.token })
    if (followersResponse.response.ok) return followersResponse.body
    else return [] // fails (500) when empty
  }

  async getFollowings({ userId }) {
    const followingResponse = await endpoints.getUserFollowing({ userId, token: this.token })
    if (followingResponse.response.ok) return followingResponse.body
    else return [] // fails (500) when empty
  }

  async follow({ userId }) {
    const followResponse = await endpoints.followUser({ 
      followerId: this._user._id, 
      broadcasterId: userId, 
      token: this.token 
    })
    return followResponse.body
  }

  async unfollow({ userId }) {
    console.log(userId)
    const unfollowResponse = await endpoints.unfollowUser({ 
      followerId: this._user._id, 
      broadcasterId: userId, 
      token: this.token 
    })
    return unfollowResponse.body
  }

  async getThought({ thoughtId, userId }) {
    const allUsers = await this.listUsers()
    const user = allUsers.find(u => u._id === userId)
    const thoughts = await this.listUserThoughts({ userId })
    const thought = thoughts.find(t => t._id === thoughtId)
    const commentsResponse = await endpoints.getCommentsForThought({ userId, thoughtId, token: this.token })
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
            token: this.token 
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
    const response = await endpoints.addCommentForThought({ userId, thoughtId, content, token: this.token })
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
      token: this.token 
    })

    console.log(response)

    const thought = response.body

    return {
      ...thought,
      user: this._user
    }
  }

}