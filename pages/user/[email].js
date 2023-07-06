"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Countdown from "react-countdown";
import { useQuery, useMutation } from "@apollo/client";
import {
  create_task_for_user,
  delete_task_by_user,
  update_task_by_user,
  get_tasks_of_email,
  create_new_user,
} from "@/lib/queries";

export default function Home() {
  const router = useRouter();
  const { data: s, _ } = useSession();
  const { email: paramsemail } = router.query;

  // Setting up a template object for initial task data => to be used for every new task that the user adds
  const initial_data = {
    id: "",
    title: "",
    description: "",
    pomodoros_required: "",
    pomodoros_completed: 0,
    date_started: "",
    due_date: "",
    priority: "",
    is_complete: false,
    by_user_id: "",
  };

  // Setting global useState variables
  const [currUser, setCurrUser] = useState({ id: "", username: "", email: "" });
  const [task, setTask] = useState(initial_data);
  const [stored_data, setStored_data] = useState([]);
  const [history_data, setHistory_data] = useState([]);

  const [timerSelected, setTimerSelected] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState(0);
  const [currRunningTask, setCurrRunningTask] = useState([]);
  const [runBreak, setRunBreak] = useState(false);

  // Function for ordering tasks by due date
  function compare_due_date(a, b) {
    if (Date.parse(a.due_date) > Date.parse(b.due_date)) return 1;
    if (Date.parse(a.due_date) > Date.parse(b.due_date)) return -1;
    return 0;
  }

  // Function for ordering tasks by priority
  function compare_priority(a, b) {
    if (a.priority < b.priority) return 1;
    if (a.priority > b.priority) return -1;
    return 0;
  }

  // Function for sorting stored (incomplete) tasks by due date
  function sortStoredDate() {
    // console.log("Earlier: ", stored_data);
    const f = stored_data?.sort(compare_due_date);
    // console.log("Now: ", f);
    setStored_data(f);
  }

  // Function for sorting stored (incomplete) tasks by priority
  function sortStoredPriority() {
    // console.log("Earlier: ", stored_data);
    const f = stored_data?.sort(compare_priority);
    // console.log("Now: ", f);
    setStored_data(f);
  }

  // Function for sorting completed tasks by due date
  function sortHistoryDate() {
    const f = stored_data?.sort(compare_due_date);
    setStored_data(f);
  }

  // Function for sorting completed tasks by priority
  function sortHistoryPriority() {
    const f = stored_data?.sort(compare_priority);
    setStored_data(f);
  }

  const handleRemove = (id) => {
    deleteUserTaskFunction({
      variables: {
        taskid: parseInt(id),
      },
    });
  };

  // ------------------------------------------ Timer functions ------------------------------------------

  // Function that runs when the user marks the task as completed

  const handleMarkCompleted = () => {
    updateUserTaskFunction({
      variables: {
        taskid: parseInt(currRunningTask.id),
        pomodoros_completed: currRunningTask.pomodoros_completed,
        pomodoros_required: currRunningTask.pomodoros_required,
        is_complete: true,
      },
    });

    setCurrRunningTask([]);
    setTimerSelected(false);
  };

  // Function that runs when the timer begins

  const handleStartTimer = (thisTask) => {
    setCurrRunningTask(thisTask);
    setTimerSelected(true);
    setTimerStartTime(25 * 60 * 1000); // 25 minutes, runs as many tomatoes as mentioned.
    // setTimerStartTime(10 * 1000); // 10 seconds for testing
  };

  const timerRenderer = ({ hours, minutes, seconds, completed, api }) => {
    if (completed) {
      api.stop();
      // Check if break was running
      if (runBreak) {
        setRunBreak(false);
        setTimerStartTime(25 * 60 * 1000); // Start task again
        api.start();
      } else {
        // One tomato completed, update task data

        const update_pomodoros_completed =
          currRunningTask.pomodoros_completed + 1;
        const update_pomodoros_required =
          currRunningTask.pomodoros_required - 1;

        // Check if task is completed
        if (update_pomodoros_required < 1) {
          updateUserTaskFunction({
            variables: {
              taskid: parseInt(currRunningTask.id),
              pomodoros_completed: update_pomodoros_completed,
              pomodoros_required: update_pomodoros_required,
              is_complete: true,
            },
          });

          setCurrRunningTask([]);
          setTimerSelected(false);
        } else if (update_pomodoros_completed >= 4) {
          // 4 tomotoes completed, trigger longer break

          updateUserTaskFunction({
            variables: {
              taskid: parseInt(currRunningTask.id),
              pomodoros_completed: update_pomodoros_completed,
              pomodoros_required: update_pomodoros_required,
              is_complete: false,
            },
          });
          setCurrRunningTask({
            ...currRunningTask,
            pomodoros_completed: update_pomodoros_completed,
            pomodoros_required: update_pomodoros_required,
          });
          setRunBreak(true);
          // Triggering break for 30 minutes
          setTimerStartTime(30 * 60 * 1000);
          // setTimerStartTime(7 * 1000); // testing - break for 7 seconds
          api.start();
        } else {
          // Task incomplete, trigger break

          updateUserTaskFunction({
            variables: {
              taskid: parseInt(currRunningTask.id),
              pomodoros_completed: update_pomodoros_completed,
              pomodoros_required: update_pomodoros_required,
              is_complete: false,
            },
          });
          setCurrRunningTask({
            ...currRunningTask,
            pomodoros_completed: update_pomodoros_completed,
            pomodoros_required: update_pomodoros_required,
          });
          setRunBreak(true);
          // Triggering break for 5 minutes
          setTimerStartTime(5 * 60 * 1000);
          // setTimerStartTime(5 * 1000); // testing - break for 5 seconds
          api.start();
        }
      }
    } else {
      // Render a countdown
      return (
        <span className="flex flex-col items-center gap-4">
          <span className="flex items-center gap-2 md:font-extralight font-bold text-coral">
            <span className="md:px-8 md:py-4 p-2 border-2 border-coral md:rounded-xl rounded-md hover:bg-coral hover:text-latte md:text-5xl text-3xl duration-200 ease-in">
              {hours <= 9 ? "0" + hours : hours}
            </span>
            :
            <span className="md:px-8 md:py-4 p-2 border-2 border-coral md:rounded-xl rounded-md hover:bg-coral hover:text-latte md:text-5xl text-3xl duration-200 ease-in">
              {minutes <= 9 ? "0" + minutes : minutes}
            </span>
            :
            <span className="md:px-8 md:py-4 p-2 border-2 border-coral md:rounded-xl rounded-md hover:bg-coral hover:text-latte md:text-5xl text-3xl duration-200 ease-in">
              {seconds <= 9 ? "0" + seconds : seconds}
            </span>
          </span>
          <span className="flex gap-2 items-center flex-wrap justify-center text-sm font-bold">
            <span
              className="border-2 border-jet hover:bg-jet hover:text-latte duration-200 ease-in w-fit md:px-4 px-2 md:py-2 py-1 md:rounded-full rounded-md cursor-pointer"
              onClick={function () {
                api.isStopped() ? api.start() : api.stop();
              }}
            >
              {api.isStopped() ? "START" : "RESTART"}
            </span>

            {!api.isCompleted() && (
              <span
                className="border-2 border-jet hover:bg-jet hover:text-latte duration-200 ease-in w-fit md:px-4 px-2 md:py-2 py-1 md:rounded-full rounded-md cursor-pointer"
                onClick={function () {
                  api.isPaused() ? api.start() : api.pause();
                }}
              >
                {api.isPaused() ? "PLAY" : "PAUSE"}
              </span>
            )}
            <span
              className="border-2 border-jet hover:bg-jet hover:text-latte duration-200 ease-in w-fit md:px-4 px-2 md:py-2 py-1 md:rounded-full rounded-md cursor-pointer"
              onClick={function () {
                api.stop();
                handleMarkCompleted();
              }}
            >
              MARK AS COMPLETED
            </span>
          </span>
        </span>
      );
    }
  };

  // Function that handles submitting tasks
  const handleSubmitTask = (curr) => {
    if (
      curr.title &&
      curr.description &&
      curr.pomodoros_required &&
      curr.due_date &&
      curr.priority
    ) {
      curr.date_started = new Date().toLocaleDateString();
      curr.by_user_id = parseInt(currUser.id);
      if (curr.pomodoros_required <= 0) curr.pomodoros_required = 1;
      try {
        enterUserTaskFunction({
          variables: {
            title: curr.title,
            description: curr.description,
            pomodoros_required: curr.pomodoros_required,
            pomodoros_completed: curr.pomodoros_completed,
            due_date: curr.due_date,
            date_started: curr.date_started,
            priority: curr.priority,
            is_complete: curr.is_complete,
            by_user_id: curr.by_user_id,
          },
        });
      } catch (e) {
        console.error("error: ", e);
      }
      setTask(initial_data);
    }
  };

  const [fetchErr, setfetchErr] = useState(false);
  const [loading, setLoading] = useState(false);

  // --------------- Defining Functions to Interact with the Data ---------------

  // Fetch functions (from queries imported from lib\queries.js)

  const fetchedUserQuery = useQuery(get_tasks_of_email, {
    variables: {
      param: decodeURIComponent(paramsemail),
    },
  });

  const [enterUserTaskFunction, _e] = useMutation(create_task_for_user, {
    refetchQueries: [get_tasks_of_email],
    awaitRefetchQueries: true,
  });

  const [deleteUserTaskFunction, _d] = useMutation(delete_task_by_user, {
    refetchQueries: [get_tasks_of_email],
    awaitRefetchQueries: true,
  });

  const [createUserFunction, _c] = useMutation(create_new_user, {
    refetchQueries: [get_tasks_of_email],
    awaitRefetchQueries: true,
  });

  const [updateUserTaskFunction, _u] = useMutation(update_task_by_user, {
    refetchQueries: [get_tasks_of_email],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    // console.log(fetchedUserQuery);
    const noFound = () => {
      // console.log("running no found user: ", s);
      const username = s.user.name.split(" ").join("_");
      const password = s.expires;
      const mail = s.user.email;
      // console.log(username, password, mail);
      try {
        createUserFunction({
          variables: {
            username: username,
            email: mail,
            password: password,
          },
        });
      } catch (e) {
        console.log("error creating new user: ", e);
      }
    };

    const foundUser = (data) => {
      setfetchErr(false);
      setLoading(false);
      setStored_data(data?.tasks?.filter((e) => e.is_complete == false));
      setHistory_data(data?.tasks?.filter((e) => e.is_complete == true));
      const f = {
        id: parseInt(data?.id),
        username: data?.username,
        email: data?.email,
      };
      setCurrUser(f);
    };
    const gotError = (error) => {
      console.log("fetching error: ", error);
      setfetchErr(true);
      setLoading(false);
    };

    if (!fetchedUserQuery.loading && !fetchedUserQuery.data.findUserEmail) {
      // No user of this email is registered in the database
      noFound();
    } else if (
      !fetchedUserQuery.loading &&
      fetchedUserQuery.data.findUserEmail
    ) {
      // User is found
      foundUser(fetchedUserQuery.data.findUserEmail);
    } else if (fetchedUserQuery.loading) {
      setLoading(true);
    } else {
      // Error condition
      setfetchErr(true);
    }
  }, [fetchedUserQuery.loading, fetchedUserQuery.data, fetchedUserQuery.error]);

  return fetchErr ? (
    <div className="flex flex-col w-full h-[100vh] items-center justify-center bg-latte text-jet">
      Error fetching user's tasks
    </div>
  ) : loading ? (
    <div className="flex flex-col w-full h-[100vh] items-center justify-center bg-latte text-jet">
      Loading...
    </div>
  ) : (
    <div className="flex flex-col mx-auto  bg-latte text-jet">
      <div className="flex items-center flex-col space-y-4 md:w-1/2 w-4/5 pt-32 md:pt-32 md:p-16 mx-auto border-b-2 border-coral">
        {timerSelected ? (
          <>
            {currRunningTask !== [] && (
              <div className="flex flex-col gap-2 w-full items-center font-bold">
                <span className="md:text-5xl text-3xl">
                  {currRunningTask.title}
                </span>
                <span>{currRunningTask.description}</span>
                <span className="bg-coral px-4 py-1 rounded-full text-latte">
                  {currRunningTask.date_started}
                </span>
                <span className="flex gap-4 items-center">
                  <span className="px-2 rounded-full bg-coral text-latte font-bold">
                    {currRunningTask.pomodoros_required}
                  </span>
                  pomodoros remaining!
                </span>
              </div>
            )}
            <span className=" w-full md:text-3xl text-center p-2 bg-jet text-latte rounded-3xl">
              {runBreak ? "BREAK TIME" : "TASK RUNNING"}
            </span>
            <Countdown
              autoStart={false}
              date={Date.now() + timerStartTime}
              renderer={timerRenderer}
            />
          </>
        ) : (
          <span className="text-jet text-4xl">No timer selected.</span>
        )}
      </div>
      <div className="flex-col space-y-4 pt-8 md:p-16">
        <form className="flex flex-col p-8 border-[1px] gap-4 bg-jet text-latte rounded-3xl relative md:w-1/2 w-4/5 mx-auto">
          <span className="md:text-5xl text-3xl mx-auto font-bold">
            ADD NEW TASK
          </span>
          <input
            type="text"
            placeholder="Title"
            className="border-b-2 px-2 py-1 outline-none bg-transparent border-coral text-coral"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            className="border-b-2 px-2 py-1 outline-none bg-transparent border-coral text-coral"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />

          <input
            type="number"
            placeholder="Pomodoros Required"
            className="border-b-2 px-2 py-1 outline-none bg-transparent border-coral text-coral"
            value={task.pomodoros_required}
            onChange={(e) =>
              setTask({ ...task, pomodoros_required: parseInt(e.target.value) })
            }
          />
          <input
            type="date"
            placeholder="Due Date"
            className="border-b-2 px-2 py-1 outline-none bg-transparent border-coral text-coral"
            value={task.due_date}
            onChange={(e) => setTask({ ...task, due_date: e.target.value })}
          />
          <span className="flex gap-2 items-center flex-wrap justify-center text-coral">
            Priority
            <span
              className={
                "rounded-full px-4 py-1 border-2 border-coral " +
                (task.priority === 3
                  ? "bg-coral text-zinc-900"
                  : "cursor-pointer")
              }
              onClick={() => setTask({ ...task, priority: 1 })}
            >
              HIGH
            </span>
            <span
              className={
                "rounded-full px-4 py-1 border-2 border-coral " +
                (task.priority === 2
                  ? "bg-coral text-zinc-900"
                  : "cursor-pointer")
              }
              onClick={() => setTask({ ...task, priority: 2 })}
            >
              MEDIUM
            </span>
            <span
              className={
                "rounded-full px-4 py-1 border-2 border-coral " +
                (task.priority === 1
                  ? "bg-coral text-zinc-900"
                  : "cursor-pointer")
              }
              onClick={() => setTask({ ...task, priority: 3 })}
            >
              LOW
            </span>
          </span>

          <div
            className="border-[1px] text-latte border-latte duration-200 ease-in w-fit px-4 py-1 rounded-3xl hover:bg-latte hover:text-jet cursor-pointer"
            onClick={() => handleSubmitTask(task)}
          >
            SUBMIT
          </div>
        </form>
        <div className="grid md:grid-cols-2 flex-col md:gap-8 p-8 gap-4 w-full font-bold">
          <span className="flex flex-col gap-4">
            <span className="md:text-5xl text-3xl">PENDING TASKS</span>

            {!stored_data || (stored_data && stored_data.length !== 0) ? (
              <>
                <span className="flex flex-wrap items-center gap-2">
                  <span
                    className="border-2 border-jet hover:bg-jet hover:text-latte duration-200 ease-in w-fit md:px-4 px-2 md:py-2 py-1 md:rounded-full rounded-md cursor-pointer"
                    onClick={() => sortStoredDate()}
                  >
                    SORT | DUE DATE
                  </span>
                  <span
                    className="border-2 border-jet hover:bg-jet hover:text-latte duration-200 ease-in w-fit md:px-4 px-2 md:py-2 py-1 md:rounded-full rounded-md cursor-pointer"
                    onClick={() => sortStoredPriority()}
                  >
                    SORT | PRIORITY
                  </span>
                </span>
                {stored_data?.map((storedTask, index) => (
                  <div
                    className="bg-coral sm:text-md text-xs rounded-3xl text-jet md:p-8 p-4 flex flex-col gap-2 relative"
                    key={index}
                  >
                    <div
                      className="bg-jet text-latte duration-200 ease-in w-fit px-4 py-2 rounded-full cursor-pointer absolute md:right-8 right-4 md:top-8 top-4"
                      onClick={() => handleStartTimer(storedTask)}
                    >
                      SET TIMER
                    </div>

                    <div
                      className="bg-jet text-latte duration-200 ease-in w-fit px-4 py-2 rounded-full cursor-pointer absolute md:right-8 right-4 md:bottom-8 bottom-4"
                      onClick={() => handleRemove(storedTask.id)}
                    >
                      DELETE
                    </div>

                    <span className="border-2 border-latte text-latte px-4 py-2 w-fit rounded-3xl ">
                      TASK {index + 1}
                    </span>
                    <span className="flex gap-4 flex-wrap items-center">
                      <span className="bg-latte px-4 py-2 w-fit rounded-3xl ">
                        TITLE
                      </span>
                      <span className="text-xl">{storedTask.title}</span>
                    </span>
                    <span className="flex gap-4 flex-wrap items-center">
                      <span className="bg-latte px-4 py-2 w-fit rounded-3xl ">
                        DESCRIPTION
                      </span>
                      <span className="text-xl">{storedTask.description}</span>
                    </span>
                    <span className="flex gap-4 flex-wrap items-center">
                      <span className="bg-latte px-4 py-2 w-fit rounded-3xl ">
                        POMODOROS REQUIRED
                      </span>
                      <span className="text-xl">
                        {storedTask.pomodoros_required}
                      </span>
                    </span>
                    <span className="flex gap-4 flex-wrap items-center">
                      <span className="bg-latte px-4 py-2 w-fit rounded-3xl ">
                        DATE ADDED
                      </span>
                      <span className="text-xl">{storedTask.date_started}</span>
                    </span>
                    <span className="flex gap-4 flex-wrap items-center">
                      <span className="bg-latte px-4 py-2 w-fit rounded-3xl ">
                        DUE DATE
                      </span>
                      <span className="text-xl">{storedTask.due_date}</span>
                    </span>
                    <span className="flex gap-4 flex-wrap items-center">
                      <span className="bg-latte px-4 py-2 w-fit rounded-3xl ">
                        PRIORITY
                      </span>
                      <span className="text-xl">
                        {storedTask.priority === 3
                          ? "LOW"
                          : storedTask.priority === 2
                          ? "MEDIUM"
                          : "HIGH"}
                      </span>
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <span>Good Job! You've got no pending tasks.</span>
            )}
          </span>
          <span className="flex flex-col gap-4">
            <span className="md:text-5xl text-3xl">COMPLETED TASKS</span>

            {!history_data || (history_data && history_data.length !== 0) ? (
              <>
                <span className="flex flex-wrap items-center gap-2">
                  <span
                    className="border-2 border-jet hover:bg-jet hover:text-latte duration-200 ease-in w-fit md:px-4 px-2 md:py-2 py-1 md:rounded-full rounded-md cursor-pointer"
                    onClick={() => sortHistoryDate()}
                  >
                    SORT | DUE DATE
                  </span>
                  <span
                    className="border-2 border-jet hover:bg-jet hover:text-latte duration-200 ease-in w-fit md:px-4 px-2 md:py-2 py-1 md:rounded-full rounded-md cursor-pointer"
                    onClick={() => sortHistoryPriority()}
                  >
                    SORT | PRIORITY
                  </span>
                </span>
                {history_data?.map((storedTask, index) => (
                  <div
                    className="md:border-2 border-2 border-jet rounded-3xl text-jet md:p-8 p-4 flex flex-col gap-2 relative sm:text-md text-xs "
                    key={index}
                  >
                    <div className="bg-jet text-latte duration-200 ease-in w-fit px-4 py-2 rounded-full absolute md:right-8 right-4 md:bottom-8 bottom-4">
                      COMPLETED
                    </div>
                    <span className="flex md:gap-4 gap-2 flex-wrap items-center">
                      <span className="border-jet border-2 px-4 py-2 w-fit rounded-3xl ">
                        TITLE
                      </span>
                      <span className="text-xl">{storedTask.title}</span>
                    </span>

                    <span className="flex  md:gap-4 gap-2 flex-wrap items-center">
                      <span className="border-jet border-2 px-4 py-2 w-fit rounded-3xl ">
                        DESCRIPTION
                      </span>
                      <span className="text-xl">{storedTask.description}</span>
                    </span>

                    <span className="flex md:gap-4 gap-2 flex-wrap items-center">
                      <span className="border-jet border-2 px-4 py-2 w-fit rounded-3xl ">
                        DATE ADDED
                      </span>
                      <span className="text-xl">{storedTask.date_started}</span>
                    </span>
                    <span className="flex md:gap-4 gap-2 flex-wrap items-center">
                      <span className="border-jet border-2 px-4 py-2 w-fit rounded-3xl ">
                        DUE DATE
                      </span>
                      <span className="text-xl">{storedTask.due_date}</span>
                    </span>
                    <span className="flex md:gap-4 gap-2 flex-wrap items-center">
                      <span className="border-jet border-2 px-4 py-2 w-fit rounded-3xl ">
                        POMODOROS USED
                      </span>
                      <span className="text-xl">
                        {storedTask.pomodoros_completed}
                      </span>
                    </span>
                    <span className="flex md:gap-4 gap-2 flex-wrap items-center">
                      <span className="border-jet border-2 px-4 py-2 w-fit rounded-3xl ">
                        PRIORITY
                      </span>
                      <span className="text-xl">
                        {storedTask.priority === 3
                          ? "LOW"
                          : storedTask.priority === 2
                          ? "MEDIUM"
                          : "HIGH"}
                      </span>
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <span>No completed tasks yet!</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
