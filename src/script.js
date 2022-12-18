import './style.css';
import {format} from 'date-fns';

class task {
    constructor(name, description, selectedDate) {
        this.setName(name);
        this.setDescription(description);
        this.setCreationDate();
        this.setDueDate(selectedDate);
        this.setIsPeriodic();
        this.setProjects();
    }

    setName (newName) {
        this.name = newName;
    }

    setDescription (newDescription) {
        this.description = newDescription;
    }

    setCreationDate() {
        this.creationDate = format(new Date(), 'dd/MM/yyyy');
    }

    setDueDate(selectedDate) {
        this.dueDate = format(new Date(selectedDate), 'dd/MM/yyyy');
    }

    setIsPeriodic() {
        this.isPeriodic = 0 ;
    }

    setProjects() {
        this.projects = {} ;
    }
}

const taskManager = (function() {
    let taskList = [];

    const getTaskList = function() {
        return taskList;
    }

    const getTask = function(x) {
        return taskList[x];
    }

    const newTask = function(name, description, selectedDate) {
        let addTask = new task(name, description, selectedDate);

        taskList.push(addTask);
    }

    return {
        getTaskList,
        getTask,
        newTask,
    };
})();


taskManager.newTask('this', 'that', '12/31/2022');

console.log(taskManager.getTask(0));