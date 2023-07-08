// Code goes here!
// create class to render html element
// hold template and root div
// create copy node from content in template
// choice firstElement from content of template
// insert the form in root div

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

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleElement: HTMLInputElement;
  descriptionElement: HTMLInputElement;
  peopleElement: HTMLInputElement;
  constructor() {
    // ! here we hold the reference to the template element
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-input")!
    );
    // ! here we hold the reference to the host element
    this.hostElement = <HTMLDivElement>document.getElementById("app")!;

    // ! here we import the template content
    const importNode = document.importNode(this.templateElement.content, true);
    // ! here we select the first element of the template content (form)
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

  private clearInputs() {
    this.titleElement.value = "";
    this.descriptionElement.value = "";
    this.peopleElement.value = "";
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleElement.value;
    const enteredDescription = this.descriptionElement.value;
    const enteredPeople = this.peopleElement.value;
    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
    ) {
      alert("Not valid input, please try again");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInputs = this.gatherUserInput();
    if (Array.isArray(userInputs)) {
      const [title, des, people] = userInputs;
      console.log(title, des, people);
    }
    this.clearInputs();
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  private attach() {
    //! here we attach the element (form) to the host element (div with id app)
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projInput = new ProjectInput();
