// Project state management
// ! How do we call add project from inside our class down?
//! And how do we pass that updated list of projects whenever it changes to the project list class?
class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  addListeners(listenerFu: Function) {
    this.listeners.push(listenerFu);
  }

  addProject(title: string, description: string, noOfPeople: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: noOfPeople,
    };
    this.projects.push(newProject);
    for (const listenerFu of this.listeners) {
      listenerFu(this.projects.slice());
    }
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }
}

const projectState = ProjectState.getInstance();

interface Validateable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validateableInput: Validateable) {
  let isValid: boolean = true;
  if (
    validateableInput.required &&
    typeof validateableInput.value === "string"
  ) {
    isValid = isValid && validateableInput.value.trim().length !== 0;
  }
  if (
    validateableInput.minLength != null &&
    typeof validateableInput.value === "string"
  ) {
    isValid =
      isValid && validateableInput.value.length >= validateableInput.minLength;
  }

  if (
    validateableInput.maxLength != null &&
    typeof validateableInput.value === "string"
  ) {
    isValid =
      isValid && validateableInput.value.length <= validateableInput.maxLength;
  }

  if (
    validateableInput.min != null &&
    typeof validateableInput.value === "number"
  ) {
    isValid = isValid && validateableInput.value >= validateableInput.min;
  }

  if (
    validateableInput.max != null &&
    typeof validateableInput.value === "number"
  ) {
    isValid = isValid && validateableInput.value <= validateableInput.max;
  }
  return isValid;
}

// Decorator to bind this
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,

    get() {
      const boundFun = originalMethod.bind(this);
      return boundFun;
    },
  };

  return adjDescriptor;
}

//

// ProjectList Class
class ProjectList {
  assignedProjects: any[] = [];
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  constructor(private type: "active" | "finished") {
    // here we hold the reference to the template element
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-list")!
    );
    //  here we hold the reference to the host element
    this.hostElement = <HTMLDivElement>document.getElementById("app")!;

    //  here we import the template content
    const importNode = document.importNode(this.templateElement.content, true);
    //  here we select the first element of the template content (form)
    this.element = importNode.firstElementChild as HTMLFormElement;
    this.element.id = `${this.type}-projects`;

    projectState.addListeners((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });
    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const lisEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    for (const prjItem of this.assignedProjects) {
      const lisItem = document.createElement("li");
      lisItem.textContent = prjItem.title;
      lisEl.appendChild(lisItem);
    }
  }

  private renderContent() {
    let listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    //! here we attach the element (form) to the host element (div with id app)
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleElement: HTMLInputElement;
  descriptionElement: HTMLInputElement;
  peopleElement: HTMLInputElement;
  constructor() {
    // here we hold the reference to the template element
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-input")!
    );
    //  here we hold the reference to the host element
    this.hostElement = <HTMLDivElement>document.getElementById("app")!;

    //  here we import the template content
    const importNode = document.importNode(this.templateElement.content, true);
    //  here we select the first element of the template content (form)
    this.element = importNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";
    this.titleElement = this.element.querySelector("#title")!;
    this.descriptionElement = this.element.querySelector("#description")!;
    this.peopleElement = this.element.querySelector("#people")!;

    this.configure();
    this.attach();
  }

  // private submitHandler = (event: Event) => {
  //   event.preventDefault();
  //   console.log(this.titleElement.value);
  // };

  // method to clear the inputs
  private clearInputs() {
    this.titleElement.value = "";
    this.descriptionElement.value = "";
    this.peopleElement.value = "";
  }

  // method to gather the user input
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleElement.value;
    const enteredDescription = this.descriptionElement.value;
    const enteredPeople = this.peopleElement.value;

    const titleValidateable: Validateable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidateable: Validateable = {
      value: enteredTitle,
      required: true,
      minLength: 5,
      maxLength: 50,
    };

    const peopleValidateable: Validateable = {
      value: enteredTitle,
      required: true,
      min: 1,
      max: 5,
    };

    // validation to sure that the user input is not empty
    if (
      // enteredTitle.trim().length === 0 &&
      // enteredDescription.trim().length === 0 &&
      // enteredPeople.trim().length === 0
      !validate(titleValidateable) ||
      !validate(descriptionValidateable) ||
      !validate(peopleValidateable)
    ) {
      alert("Not valid input, please try again");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  // method to handle the submit event
  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInputs = this.gatherUserInput();
    if (Array.isArray(userInputs)) {
      const [title, des, people] = userInputs;
      console.log(title, des, people);
      projectState.addProject(title, des, people);
      this.clearInputs();
    }
  }

  // method to configure the event listener
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  // method to attach the element to the host element
  private attach() {
    //! here we attach the element (form) to the host element (div with id app)
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
