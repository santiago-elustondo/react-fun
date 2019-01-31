# ThinkerSDK
#### `user()`
Returns currently logged in user (or `undefined`).
User has the shape:
```ts
type User = { 
  username: string
  created: string // timestamp
  _id: string
}
```

#### `subscribeToAuthState(handler)`
`handler` is a function with the shape:
```ts
type AuthState = 'LOADING' | 'LOGGED-IN' | 'LOGGED-OUT'
type Handler = AuthState => undefined
```
`handler` is called every time the authentication state changes.
<br/>
#### `async login({ username, password })`
Updates authentication state.
<br/>
#### `async signup({ username, password })`
Updates authentication state.
<br/>
#### `async logout()`
Updates authentication state.
<br/>
#### `async fetchUsers()`
Returns `Array<User>`
<br/>
#### `async fetchUser({ userId })`
Returns `User`
<br/>
#### `async fetchThoughts()`
Requires authenticated status.
Returns all thoughts from all users.
Returns `Array<ThoughtWithUserAndCommentIds>`
```ts
type Thought = {
  content: string
  created: string // timestamp
  _id: string
}

type ThoughtWithUserAndCommentIds = {
  ...Thought
  user: User // author
  comments: Array<string> // comment ids
}
```

#### `async fetchUserThoughts({ userId })`
Requires authenticated status.
Returns `Array<Comment>` (ordered newest-to-oldest)
```ts
type Comment = {
  content: string
  created: string // timestamp
  _id: string
}
```

#### `async fetchThought({ thoughtId, userId })`
Requires authenticated status.
`userId` is the id of the author.
```ts
type CommentWithUser = {
  ...Comment
  user: User // author
}

type ThoughtWithUserAndComments = {
  ...Thought
  user: User // author
  comments: Array<CommentWithUser>
}
```

#### `async addThought({ content })`
Requires authenticated status. 
`content` is the `string` content of the thought
<br/>
#### `async fetchComments({ thoughtId, userId })`
Requires authenticated status. 
`userId` is the id of the author of the thought.
Returns `Array<CommentWithUser>` (ordered newest-to-oldest)
<br/>
#### `async addComment({ userId, thoughtId, content })`
Requires authenticated status. 
`userId` is the id of the author of the thought.
`content` is the `string` content of the comment
<br/>
#### `async fetchUserComplete({ userId })`
Requires authenticated status.
Returns `UserWithCommentsWithThoughts`
```ts
type ThoughtWithComments = {
  ...Thought
  comments: Array<Comment>
}

type UserWithCommentsWithThoughts = {
  ...User
  thoughts: Array<ThoughtWithComments>
}
```

#### `subscribeToComments({ userId, thoughtId, handler })`
Requires authenticated status.
`userId` is the id of the author of the thought.
`handler` is a function with the shape `Array<CommentWithUser> => undefined`
<br/>
#### `unsubscribeToComments({ userId, thoughtId, handler })`
`handler` must be the same function reference as passed to `subscribeToComments()`
