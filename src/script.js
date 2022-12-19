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

    const assignToProject = function (parentProject, assignTo) {

        let projectList = projectManager.getProjectList();

        for (let i = 0; i < projectList.length; i++) {

            if (projectList[i].name !== parentProject) {
                if ((i + 1) === projectList.length) {
                    console.log(`${parentProject} doesn't exist, terminating assignToProject`);
                    return 0;
                }
                continue;
            } else {
                console.log(`${parentProject} does exist, assignToProject proceeds`);

                for (let j = 0; j < taskList.length; j++) {

                    if (taskList[j].name !== assignTo) {
                        if ((j + 1) === taskList.length) {
                            console.log(`${assignTo} doesn't exist, terminating assignToProject`);
                            return 0;
                        }
                        continue;
                    } else {

                        if(taskList[j].projects.filter((value) => value === parentProject).length) {
                            console.log(`${assignTo} is already assigned to ${parentProject}. Aborting assignToProject`);
                            return 0;
                        }
                        taskList[j].addProject(parentProject);
                        console.log(`${assignTo} assigned to ${parentProject} successfully`);
                        projectManager.assignTask(assignTo, parentProject);
                        return 1;
                    }
                }
            }
        }
    }

    return {
        getTaskList,
        getTask,
        newTask,
        assignToProject,
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

    const assignTask = function (taskToAssign, assignTo) {

        let taskList = taskManager.getTaskList();

        for (let i = 0; i < taskList.length; i++) {

            if (taskList[i].name !== taskToAssign) {
                if ((i + 1) === taskList.length) {
                    console.log(`${taskToAssign} doesn't exist, terminating assignTask`);
                    return 0;
                }
                continue;
            } else {
                console.log(`${taskToAssign} does exist, assignTask proceeds`);

                for (let j = 0; j < projectList.length; j++) {
                    
                    if (projectList[j].name !== assignTo) {
                        if ((j + 1) === taskList.length) {
                            console.log(`${assignTo} doesn't exist, terminating assignTask`);
                            return 0;
                        }
                        continue;
                    } else {

                        if(projectList[j].tasks.filter((value) => value === taskToAssign).length) {
                            console.log(`${taskToAssign} already assigned to ${assignTo}. Aborting assignTask.`);
                            return 0;
                        }
                        projectList[j].addTask(taskToAssign);
                        console.log(`${taskToAssign} assigned to ${assignTo} successfully`);
                        taskManager.assignToProject(assignTo, taskToAssign);
                        return 1;
                    }
                }
            }
        }
    }

    return {
        getProjectList,
        getProject,
        newProject,
        assignTask
    };
})();


taskManager.newTask('this', 'that', '12/31/2022');



projectManager.newProject('a', 'b', '03/31/2022');
taskManager.assignToProject('a', 'this');

console.log(projectManager.getProject(0));
console.log(taskManager.getTask(0));
