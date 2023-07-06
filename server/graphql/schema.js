const typeDefs = `
      type Query {
        pomodorotasks: [Pomodorotask]
        pomodorousers: [Pomodorouser]
                
        findUserID(id: ID): Pomodorouser
        findUserUsername(username: String): Pomodorouser
        findUserEmail(email: String): Pomodorouser
        findTask(id: ID): Pomodorotask
      }

      type Pomodorotask {
        id: ID
        title: String!
        description: String!
        pomodoros_required: Int!
        pomodoros_completed: Int!
        date_started: String!
        due_date: String!
        priority: Int!
        is_complete: Boolean!
        by_user_id: Int!
        by_user: Pomodorouser
      }

      type Pomodorouser {
        id: ID
        email: String!
        username: String!
        password: String!
        tasks: [Pomodorotask]
      }     
      
      
      type Mutation {
        
        createUser(
          email: String!
          username: String!
          password: String!
        ): Pomodorouser

        createTask(
          title: String!
          description: String!
          pomodoros_required: Int!
          pomodoros_completed: Int!
          date_started: String!
          due_date: String!
          priority: Int!
          is_complete: Boolean!
          by_user_id: Int!
        ): Pomodorotask

        updateTask(
          id: ID
          title: String
          description: String
          pomodoros_required: Int
          pomodoros_completed: Int
          date_started: String
          due_date: String
          priority: Int
          is_complete: Boolean
          by_user_id: Int
        ): Pomodorotask  

        updateUser(
          id: ID
          email: String
          username: String
          password: String
        ): Pomodorouser

        deleteTask(id: ID): Pomodorotask
        
        deleteUser(id: ID): Pomodorouser

      }

    `;

export default typeDefs;
