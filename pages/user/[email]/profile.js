"use client";
import { get_tasks_of_email } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const light = "#D5D5D5";
const medium = "#FF8360";
const dark = "#363636";

// Function for fetching user data through params

const [createUserFunction, _c] = useMutation(create_new_user, {
  refetchQueries: [get_tasks_of_email],
  awaitRefetchQueries: true,
});

export default function fetchData() {
  const mail = s.user.email;
  const { loading, error, data } = useQuery(get_tasks_of_email, {
    variables: {
      param: decodeURIComponent(mail),
    },
  });

  if (loading) {
    return (
      <div className="flex flex-col w-full h-[100vh] items-center justify-center bg-latte text-jet">
        Loading...
      </div>
    );
  }
  if (error) {
    console.error(error);
    // await disconnectPrisma();
    return (
      <div className="flex flex-col w-full h-[100vh] items-center justify-center bg-latte text-jet">
        Error fetching user's tasks
      </div>
    );
  }
  if (!loading && !data.findUserEmail) {
    return (
      <div className="flex flex-col w-full h-[100vh] items-center justify-center bg-latte text-jet">
        User doesn't exist in database! Please go to the Home Page.
      </div>
    );
  }

  const h = data?.findUserEmail?.tasks;
  const f = data?.findUserEmail?.tasks?.filter((e) => e.is_complete == true);

  return (
    <div className="pt-32 bg-latte text-jet grid grid-cols-2 gap-4 p-8">
      <span className="grid col-span-1 gap-4">
        <DonutGraph2 props={h} />
        <span className="flex gap-2 justify-center flex-wrap items-center">
          <span className="bg-jet text-latte px-4 py-1 text-sm font-bold rounded-sm">
            COMPLETE
          </span>

          <span className="bg-steal text-latte px-4 py-1 text-sm font-bold rounded-sm">
            INCOMPLETE
          </span>
        </span>
        <span className="text-3xl font-bold text-coral h-fit w-fit mx-auto">
          YOUR COMPLETED TASKS
        </span>
        <PastTasks props={f} />
      </span>
      <span className="grid col-span-1">
        <BarGraph1 props={f} />
        <BarGraph2 props={f} />
        <DonutGraph1 props={f} />
        <span className="flex gap-2 justify-center flex-wrap items-center">
          <span className="bg-jet text-latte px-4 py-1 text-sm font-bold rounded-sm">
            HIGH
          </span>
          <span className="bg-coral text-latte px-4 py-1 text-sm font-bold rounded-sm">
            MEDIUM
          </span>
          <span className="bg-steal text-latte px-4 py-1 text-sm font-bold rounded-sm">
            LOW
          </span>
        </span>
      </span>
    </div>
  );
}

// Function for rendering the user's completed tasks

function PastTasks({ props }) {
  return (
    <>
      {props &&
        props.map((storedTask, index) => (
          <div
            className="md:border-2 border-2 border-jet rounded-3xl text-jet p-4 flex flex-col gap-2 relative w-5/6 mx-auto sm:text-md text-xs h-fit"
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
              <span className="text-xl">{storedTask.pomodoros_completed}</span>
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
  );
}

// Function for rendering the user's tasks according to priority -- doughnut graph

function DonutGraph1({ props }) {
  let priority_data_points = [0, 0, 0];
  const priority_label = ["High", "Medium", "Low"];
  const priority_color = [];

  props.map((e) => {
    priority_data_points[parseInt(e.priority) - 1]++;
    if (e.priority == 1) priority_color.push(dark);
    if (e.priority == 2) priority_color.push(medium);
    if (e.priority == 3) priority_color.push(light);
  });
  const priority_data = {
    label: priority_label,
    datasets: [
      {
        label: "Priority",
        data: priority_data_points,
        backgroundColor: priority_color,
      },
    ],
  };

  const priority_options = {
    legend: {
      display: true,
    },
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Tasks completed - Priority wise",
      },
    },
  };
  return (
    <div className="w-4/5 mx-auto my-4">
      <Doughnut options={priority_options} data={priority_data} />
    </div>
  );
}

// Function for rendering the user's tasks according to completion state -- doughnut graph

function DonutGraph2({ props }) {
  let data_points = [0, 0];
  const label = ["Complete", "Incomplete"];
  const color = [dark, light];

  props.map((e) => {
    if (e.is_complete == true) data_points[0]++;
    if (e.is_complete == true) data_points[1]++;
  });
  const data = {
    label: label,
    datasets: [
      {
        labels: label,
        data: data_points,
        backgroundColor: color,
      },
    ],
  };

  const options = {
    legend: {
      display: true,
    },
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Tasks Complete vs Incomplete",
      },
    },
  };
  return (
    <div className="w-4/5 mx-auto mt-2">
      <Doughnut options={options} data={data} />
    </div>
  );
}

// Function for rendering the user's tasks according to pomodoros used / remaining -- bar graph
// For the tasks that took up all the pomodoros they assigned themselves

function BarGraph1({ props }) {
  let title = [];
  let pomodoros_used = [];
  props.map((e) => {
    if (e.pomodoros_required <= 0) {
      // Task took up all the time
      title.push(e.title);
      pomodoros_used.push(e.pomodoros_completed);
    }
  });

  const pomodoros_data = {
    labels: title,
    datasets: [
      {
        label: "Used Up all Pomodoros",
        data: pomodoros_used,
        backgroundColor: light,
      },
    ],
  };

  const pomodoros_options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Number of Pomodoros used for each Task",
      },
    },
  };

  return (
    <div className="h-fit my-4">
      <Bar options={pomodoros_options} data={pomodoros_data} />
    </div>
  );
}
// Function for rendering the user's tasks according to pomodoros used / remaining -- bar graph
// For the tasks that were finished before time

function BarGraph2({ props }) {
  let title = [];
  let pomodoros_used = [];
  props.map((e) => {
    if (e.pomodoros_required > 0) {
      // finished early
      title.push(e.title);
      pomodoros_used.push(e.pomodoros_completed);
    }
  });
  const pomodoros_data = {
    labels: title,
    datasets: [
      {
        label: "Finished Early!",
        data: pomodoros_used,
        backgroundColor: dark,
      },
    ],
  };

  const pomodoros_options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Number of Pomodoros used for each Task",
      },
    },
  };

  return (
    <div className="h-fit my-4">
      <Bar options={pomodoros_options} data={pomodoros_data} />
    </div>
  );
}
