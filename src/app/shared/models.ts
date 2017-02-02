// First building for a sprint, maybe needs Epic and brain storm

export class Project {
    constructor(public _id: string,
        public name: string,
        public description: string,
        public stories: Array<StoryGroup>,
        public team: Array<Position>) { }
}

export class Position {
    constructor(public role: string,
        public member: Member) { }
}

export class StoryGroup {
    constructor(public name: string,
        public items: Array<StoryItem>) { }
}

export class Tag {
    constructor(public name: string) { }
}

export class StoryItem {
    constructor(public title: string,
        public colour: string,
        public descriptionAs: string,
        public descriptionWant: string,
        public descriptionThat: string,
        public points: number,
        public acs: Array<Acceptance>,
        public tags: Array<Tag>) { }
}

export class Acceptance {
    constructor(public name: string,
        public done: TimeLog = null) { }
}

// Tasks with Skill, time logs
export class Task {
    constructor(public title: string,
        public description: string,
        public assigned: Member,
        public subTask: Task,
        public timeLog: Array<TimeLog>,
        public skills: Array<Skill>) { }
}

export class Skill {
    constructor(public title: string, public description) { }
}

export class TimeLog {
    constructor(public created: Date,
        public hoursLeft: number,
        public hoursSpent: number,
        public member: Member,
        public comments: string,
        public githash: string) { }
}

// Countdown to events like demos, major releases etc...
export class Countdown {
    constructor(public title: string,
        public description,
        public date: Date) { }
}

// Users with Roles, Skills and availability
export class Member {
    constructor(public _id: string,
        public name: string,
        public email: string,
        public skills: Array<Skill>,
        public currentProjectID: number) { }
}

export class Absent {
    constructor(public member: Member,
        public from: Date,
        public to: Date,
        public comments: string) { }
}

// Technical stack with associated test frameworks
// For example: angular...
export class Tech {
    constructor(public name: string, public deployment: Deployment) { }
}

export class Deployment { // Linked to a script to deploy somehow
    constructor(public name: string) { }
}

export class WorkAround {
    constructor(public name: string, public description: string) { }
}

export class Prerequisite {
    constructor(public description: string) { }
}

export class Step {
    constructor(public description: string) { }
}

export class Reproduce {
    constructor(public prerequisites: Array<Prerequisite>, public steps: Array<Step>) { }
}

export class Bug {
    constructor(public _id: string,
        public tech: Tech,
        public title: string,
        public description: string,
        public assigned: Member,
        public consequence: string,
        public workaround: WorkAround,
        public reproduce: Reproduce,
        public state: BugState) { }
}

export class BugState {
    constructor(public name: string) { }
}

export class Stack {
    constructor(public tech: Tech,
        public order: number,
        public test: Test) { }
}

export class Test { // Linked to a script to test somehow
    constructor(public name: string) { }
}

