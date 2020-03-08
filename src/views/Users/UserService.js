const userService = {
  userList: [
    {
      id: 1,
      name: 'dome',
      gender: 'M'
    },
    {
      id: 2,
      name: 'phumiphat',
      gender: 'M'
    }
  ],
  lastId: 3,
  addUser (user) {
    user.id = this.lastId++
    this.userList.push(user)
  },
  updateUser (user) {
    const index = this.userList.findIndex(item => item.id === user.id)
    this.userList.splice(index, 1, user)
  },
  deleteUser (user) {
    const index = this.userList.findIndex(item => item.id === user.id)
    this.userList.splice(index, 1)
  },
  getUser () {
    return [...this.userList]
  }
}

export default userService
