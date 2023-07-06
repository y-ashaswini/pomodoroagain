"use client";
import { gql } from "@apollo/client";
export const get_tasks_of_user = gql`
  query q($param: ID) {
    findUserID(id: $param) {
      id
      tasks {
        id
        title
        description
        pomodoros_required
        pomodoros_completed
        date_started
        due_date
        priority
        is_complete
      }
    }
  }
`;
export const get_tasks_of_username = gql`
  query q1($param: String) {
    findUserUsername(username: $param) {
      id
      username
      email
      password
      tasks {
        id
        title
        description
        pomodoros_required
        pomodoros_completed
        date_started
        due_date
        priority
        is_complete
      }
    }
  }
`;
export const get_tasks_of_email = gql`
  query q2($param: String) {
    findUserEmail(email: $param) {
      id
      username
      email
      password
      tasks {
        id
        title
        description
        pomodoros_required
        pomodoros_completed
        date_started
        due_date
        priority
        is_complete
      }
    }
  }
`;

export const create_task_for_user = gql`
  mutation m(
    $title: String!
    $description: String!
    $pomodoros_required: Int!
    $pomodoros_completed: Int!
    $date_started: String!
    $due_date: String!
    $priority: Int!
    $is_complete: Boolean!
    $by_user_id: Int!
  ) {
    createTask(
      title: $title
      description: $description
      pomodoros_required: $pomodoros_required
      pomodoros_completed: $pomodoros_completed
      date_started: $date_started
      due_date: $due_date
      priority: $priority
      is_complete: $is_complete
      by_user_id: $by_user_id
    ) {
      title
      description
    }
  }
`;

export const create_new_user = gql`
  mutation m3($email: String!, $username: String!, $password: String!) {
    createUser(email: $email, password: $password, username: $username) {
      id
      username
      email
      password
    }
  }
`;

export const update_task_by_user = gql`
  mutation m2(
    $taskid: ID
    $pomodoros_required: Int
    $pomodoros_completed: Int
    $is_complete: Boolean
  ) {
    updateTask(
      id: $taskid
      pomodoros_completed: $pomodoros_completed
      pomodoros_required: $pomodoros_required
      is_complete: $is_complete
    ) {
      id
      title
      description
      pomodoros_required
      pomodoros_completed
      date_started
      due_date
      priority
      is_complete
      by_user_id
    }
  }
`;

export const delete_task_by_user = gql`
  mutation m1($taskid: ID) {
    deleteTask(id: $taskid) {
      id
      title
      description
    }
  }
`;
