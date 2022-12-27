import './style.css';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { hoursToMilliseconds } from 'date-fns';

window.foo = (function() {


class items {
    constructor(name, description, selectedDate) {
        this.setName(name);
        this.setDescription(description);
        this.setCreationDate();
        this.setDueDate(selectedDate);
    }

    setName(newName) {
        this.name = newName;
    }

    setDescription(newDescription) {
        this.description = newDescription;
    }

    setCreationDate() {
        this.creationDate = new Date();
    }

    setDueDate(selectedDate) {
        this.dueDate = new Date(selectedDate);
    }

    getTimeLeft() {
        let currDate = new Date();
        let dueDate = this.dueDate;

        if (Date.parse(currDate) >= (Date.parse(dueDate) + 86400000)) {
            console.log(`time's up`);
            return -1;
        }

        if (currDate.getFullYear() === dueDate.getFullYear() && currDate.getMonth() === dueDate.getMonth() && currDate.getDate() === dueDate.getDate()) {
            console.log('last day to complete ! Hurry up !');
            return differenceInCalendarDays(dueDate, currDate);
        }

        console.log(`You have ${differenceInCalendarDays(dueDate, currDate)} day(s) to complete this task ! You can do it !`);
        return differenceInCalendarDays(dueDate, currDate);
    }
}

class task extends items {
    constructor(name, description, selectedDate) {
        super(name, description, selectedDate);
        this.isPeriodic();
        this.projectList();
        this.isCompleted();
    }

    isPeriodic() {
        this.periodic = 0;
    }

    projectList() {
        this.projects = [];
    }

    isCompleted() {
        this.complete = 0;
    }

    toggleComplete() {
        if (this.complete === 0) {
            this.complete = 1;
        } else {
            this.complete = 0;
        }
    }

    addProject(x) {
        this.projects.push(x);
    }
}

class project extends items {
    constructor(name, description, selectedDate) {
        super(name, description, selectedDate);
        this.taskList();
    }

    taskList() {
        this.tasks = [];
    }

    addTask(x) {
        this.tasks.push(x);
    }
}

const timeManager = (function () {

    let date = new Date();

    const clock = function () {
        date = new Date();

        return date;
    }

    return {
        clock
    }
})();

const taskManager = (function () {
    let taskList = [];

    const getTaskList = function () {
        return taskList;
    }

    const getTask = function (x) {
        return taskList[x];
    }

    const getTaskByName = function (name) {
        return getTask(taskLookup(name));
    }

    const newTask = function (name, description, selectedDate) {

        if (taskLookup(name) !== -1) {
            console.log(`There's already a task named ${name}. Please pick a new name`);
            return;
        }

        let addTask = new task(name, description, selectedDate);

        console.log(`${name} successfully created.`)

        taskList.push(addTask);
    }

    const removeTask = function (x) {
        taskList.splice(x, 1);

        projectManager.clearTaskFromAll(taskList[x].name);
    }

    const removeCompleted = function () {
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].complete === 1) {
                taskList.splice(i, 1);
            }
        }
    }

    const sortAlphaUp = function () {
        taskList.sort(function (a, b) {
            if (a.name > b.name) {
                return +1;
            } else if (a.name < b.name) {
                return -1;
            } else {
                return 0;
            }
        })
    }

    const sortAlphaDown = function () {
        taskList.sort(function (a, b) {
            if (a.name > b.name) {
                return -1;
            } else if (a.name < b.name) {
                return +1;
            } else {
                return 0;
            }
        })
    }

    const sortAscDueDate = function () {
        taskList.sort(function (a, b) {
            return Date.parse(a.dueDate) - Date.parse(b.dueDate);
        })
    }

    const sortDescDueDate = function () {
        taskList.sort(function (a, b) {
            return Date.parse(b.dueDate) - Date.parse(a.dueDate);
        })
        console.log('?');
    }

    const sortCompletion = function () {
        taskList.sort(function (a, b) {
            return a.complete - b.complete;
        })
    }

    const taskLookup = function (name) {

        // parse taskList and return the index of the named task, if it exists. Else returns -1

        if (taskList.length === 0) {
            console.log('no tasks stored yet');
            return -1;
        }

        for (let i = 0; i < taskList.length; i++) {

            if (taskList[i].name !== name) {
                if ((i + 1) === taskList.length) {
                    console.log(`${name} doesn't exist. Terminating.`);
                    return -1;
                }
                continue;
            } else {
                return i;
            }
        }
    }

    const assignProjectToTask = function (projectName, taskName) {

        // assign a project to a task if both exist and aren't already paired, else return -1

        if (projectManager.projectLookup(projectName) === -1) {
            return -1;
        };
        let taskIndex = taskLookup(taskName);

        if (taskList[taskIndex].projects.filter((value) => value === projectName).length) {
            console.log(`${taskName} is already assigned to ${projectName}. Terminating`);
            return -1;
        }

        taskList[taskIndex].addProject(projectName);
        projectManager.assignTaskToProject(projectName, taskName);
    }

    const rmProjectFromTask = function (projectName, taskName) {
        let rmIndex = taskLookup(taskName);

        if(rmIndex === -1) {
            console.log(`${taskName} doesn't exist.`);
        }

        if(!taskList[rmIndex].projects.filter((item) => item === projectName)) {
            return -1;
        } else {
            for(let i = 0; i < taskList[rmIndex].projects.length; i++) {
                if(taskList[rmIndex].projects[i] !== projectName) {
                    continue;
                }

                taskList[rmIndex].projects.splice(i, 1);
                break;
            }
        }
    }

    const clearProjectFromAll = function(projectName) {

        console.log(projectName);
        taskList.forEach((taskk) => {
            rmProjectFromTask(projectName, taskk.name);
        })
    }

    return {
        getTaskList,
        getTask,
        getTaskByName,
        newTask,
        removeTask,
        removeCompleted,
        sortAlphaUp,
        sortAlphaDown,
        sortAscDueDate,
        sortDescDueDate,
        sortCompletion,
        taskLookup,
        assignProjectToTask,
        rmProjectFromTask,
        clearProjectFromAll,
    };
})();

const projectManager = (function () {
    let projectList = [];

    const removeProject = function (x) {
        projectList.splice(x, 1);

        taskManager.clearProjectFromAll(projectList[x].name);
    }

    const newProject = function (name, description, selectedDate) {

        if (projectLookup(name) !== -1) {
            console.log(`There's already a project named ${name}. Please pick a new name.`);
        }
        let add = new project(name, description, selectedDate);

        projectList.push(add);
    }

    const getProjectList = function () {
        return projectList;
    }

    const getProject = function (x) {
        return projectList[x];
    }

    const getProjectByName = function (name) {
        return getProject(projectLookup(name));
    }

    const sortAlphaUp = function () {
        projectList.sort(function (a, b) {
            if (a.name > b.name) {
                return +1;
            } else if (a.name < b.name) {
                return -1;
            } else {
                return 0;
            }
        })
    }

    const sortAlphaDown = function () {
        projectList.sort(function (a, b) {
            if (a.name > b.name) {
                return -1;
            } else if (a.name < b.name) {
                return +1;
            } else {
                return 0;
            }
        })
    }

    const sortAscDueDate = function () {
        projectList.sort(function (a, b) {
            return Date.parse(a.dueDate) - Date.parse(b.dueDate);
        })
    }

    const sortDescDueDate = function () {
        projectList.sort(function (a, b) {
            return Date.parse(b.dueDate) - Date.parse(a.dueDate);
        })
        console.log('?');
    }

    

    const projectLookup = function (name) {

        // parse projectList and return the index of the named project, if it exists. Else returns -1

        if (projectList.length === 0) {
            console.log('no tasks stored yet');
            return -1;
        }

        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].name !== name) {
                if ((i + 1) === projectList.length) {
                    console.log(`${name} doesn't exist. Terminating.`);
                    return -1;
                }
                continue;
            } else {
                return i;
            }
        }
    }

    const assignTaskToProject = function (projectName, taskName) {

        // assign a task to a project if both exist and aren't already paired, else return -1

        if (taskManager.taskLookup(taskName) === -1) {
            return -1;
        }
        let projectIndex = projectLookup(projectName);

        if (projectIndex === -1) {
            return -1;
        }

        if (projectList[projectIndex].tasks.filter((value) => value === taskName).length) {
            console.log(`${taskName} is already assigned to ${projectName}. Terminating.`);
            return -1;
        }

        projectList[projectIndex].addTask(taskName);
        taskManager.assignProjectToTask(projectName, taskName);
    }

    const rmTaskFromProject = function (taskName, projectName) {
        let rmIndex = projectLookup(projectName);

        if(rmIndex === -1) {
            console.log(`${projectName} doesn't exist.`);
        }

        if(!projectList[rmIndex].tasks.filter((item) => item === taskName)) {
            return -1;
        } else {
            for(let i = 0; i < projectList[rmIndex].tasks.length; i++) {
                if(projectList[rmIndex].tasks[i] !== taskName) {
                    continue;
                }

                projectList[rmIndex].tasks.splice(i, 1);
                break;
            }
        }
    }

    const clearTaskFromAll = function(taskName) {
        projectList.forEach((project) => {
            rmTaskFromProject(taskName, project.name);
        })
    }

    return {
        removeProject,
        newProject,
        getProjectList,
        getProject,
        getProjectByName,
        sortAlphaUp,
        sortAlphaDown,
        sortAscDueDate,
        sortDescDueDate,
        projectLookup,
        assignTaskToProject,
        rmTaskFromProject,
        clearTaskFromAll,
    };
})();

return{
    items,
    task,
    project,
    taskManager,
    projectManager,
}


})();