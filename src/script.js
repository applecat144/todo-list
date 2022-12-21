import './style.css';
import { format } from 'date-fns';

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
        this.creationDate = format(new Date(), 'dd/MM/yyyy');
    }

    setDueDate(selectedDate) {
        this.dueDate = format(new Date(selectedDate), 'dd/MM/yyyy');
    }
}

class task extends items {
    constructor(name, description, selectedDate) {
        super(name, description, selectedDate);
        this.isPeriodic();
        this.projectList();
    }

    isPeriodic() {
        this.periodic = 0;
    }

    projectList() {
        this.projects = [];
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

const taskManager = (function () {
    let taskList = [];

    const getTaskList = function () {
        return taskList;
    }

    const getTask = function (x) {
        return taskList[x];
    }

    const newTask = function (name, description, selectedDate) {
        let addTask = new task(name, description, selectedDate);

        taskList.push(addTask);
    }

    const taskLookup = function(name) {
        
        // parse taskList and return the index of the named task, if it exists. Else returns -1

        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].name !== name) {
                if((i+1) === taskList.length) {
                    console.log(`${name} doesn't exist. Terminating.`);
                    return -1;
                }
                continue;
            } else {
                return i;
            }
        }
    }

    const assignProjectToTask = function(projectName, taskName) {

        // assign a project to a task if both exist and aren't already paired, else return -1

        if (projectManager.projectLookup(projectName) === -1) {
            return -1;
        };
        let taskIndex = taskLookup(taskName);

        if(taskList[taskIndex].projects.filter((value) => value === projectName).length) {
            console.log(`${taskName} is already assigned to ${projectName}. Terminating`);
            return -1;
        }
        
        taskList[taskIndex].addProject(projectName);
        projectManager.assignTaskToProject(projectName, taskName);
    }

    return {
        getTaskList,
        getTask,
        newTask,
        taskLookup,
        assignProjectToTask,
    };
})();

const projectManager = (function () {
    let projectList = [];

    const getProjectList = function () {
        return projectList;
    }

    const getProject = function (x) {
        return projectList[x];
    }

    const newProject = function (name, description, selectedDate) {
        let add = new project(name, description, selectedDate);

        projectList.push(add);
    }

    const projectLookup = function(name) {
        
        // parse projectList and return the index of the named project, if it exists. Else returns -1

        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].name !== name) {
                if((i+1) === projectList.length) {
                    console.log(`${name} doesn't exist. Terminating.`);
                    return -1;
                }
                continue;
            } else {
                return i;
            }
        }
    }

    const assignTaskToProject = function(projectName, taskName) {

        // assign a task to a project if both exist and aren't already paired, else return -1

        if(taskManager.taskLookup(taskName) === -1) {
            return -1;
        }
        let projectIndex = projectLookup(projectName);

        if(projectIndex === -1) {
            return -1;
        }

        if(projectList[projectIndex].tasks.filter((value) => value === taskName).length) {
            console.log(`${taskName} is already assigned to ${projectName}. Terminating.`);
            return -1;
        }

        projectList[projectIndex].addTask(taskName);
        taskManager.assignProjectToTask(projectName, taskName);
    }

    return {
        getProjectList,
        getProject,
        newProject,
        projectLookup,
        assignTaskToProject,
    };
})();
