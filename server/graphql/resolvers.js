import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const resolvers = {
  Query: {
    pomodorotasks: () => {
      try {
        return prisma.pomodorotask.findMany({
          include: {
            by_user: true,
          },
        });
      } catch (e) {
        throw new Error("Error fetching tasks: ", e);
      }
    },
    pomodorousers: () => {
      try {
        return prisma.pomodorouser.findMany({
          include: {
            tasks: true,
          },
        });
      } catch (e) {
        throw new Error("Error fetching users: ", e);
      }
    },

    findUserID: (_r, args, _) => {
      const id = +args.id;
      return prisma.pomodorouser.findFirst({
        where: {
          id,
        },
        include: {
          tasks: true,
        },
      });
    },

    findUserUsername: (_r, args, _) => {
      return prisma.pomodorouser.findFirst({
        where: {
          username: args.username,
        },
        include: {
          tasks: true,
        },
      });
    },

    findUserEmail: (_r, args, _) => {
      try {
        return prisma.pomodorouser.findFirst({
          where: {
            email: args.email,
          },
          include: {
            tasks: true,
          },
        });
      } catch (e) {
        throw new Error("Error fetching user by email: ", e);
      }
    },

    findTask: (_r, args, _) => {
      const id = +args.id;
      try {
        return prisma.pomodorotask.findFirst({
          where: {
            id,
          },
          include: {
            by_user: true,
          },
        });
      } catch (e) {
        throw new Error("Error fetching task by id: ", e);
      }
    },
  },
  Mutation: {
    createTask: (_r, args, _) => {
      return prisma.pomodorotask.create({
        data: {
          title: args.title,
          description: args.description,
          pomodoros_required: args.pomodoros_required,
          pomodoros_completed: args.pomodoros_completed,
          date_started: args.date_started,
          due_date: args.due_date,
          priority: args.priority,
          is_complete: args.is_complete,
          by_user_id: args.by_user_id,
        },
      });
    },

    createUser: (_r, args, _) => {
      return prisma.pomodorouser.create({
        data: {
          email: args.email,
          username: args.username,
          password: args.password,
        },
      });
    },

    deleteTask: (_r, args, _) => {
      return prisma.pomodorotask.delete({
        where: {
          id: parseInt(args.id),
        },
      });
    },

    deleteUser: (_r, args, _) => {
      const id = parseInt(args.id);
      return prisma.pomodorouser.delete({
        where: {
          id,
        },
      });
    },
    updateTask: (_r, args, _) => {
      const id = parseInt(args.id);
      return prisma.pomodorotask.update({
        where: {
          id,
        },
        data: {
          pomodoros_required: args.pomodoros_required,
          pomodoros_completed: args.pomodoros_completed,
          is_complete: args.is_complete,
        },
      });
    },
    updateUser: (_r, args, _) => {
      const id = parseInt(args.id);
      return prisma.pomodorouser.update({
        where: {
          id,
        },
        data: {
          username: args.username,
        },
      });
    },
  },
};

export default resolvers;
