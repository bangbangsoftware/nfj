// First building for a sprint, maybe needs Epic and brain storm

export class Project {
    constructor(public _id: string,
                public name: string,
                public description: string,
                public stories: Array <StoryGroup>,
                public team: Array <Member>) {} }

export class StoryGroup {
    constructor(public name: string,
                public items: Array <StoryItem>) {} }

export class StoryItem {
    constructor(public title: string,
                public type: string,
                public colour:string,
                public descriptionAs: string,
                public descriptionWant: string,
                public descriptionThat: string,
                public points: number,
                public acs: Array < Acceptance > ,
                public tasks: Array < Task > ) {} }

export class Acceptance {
    constructor(public name: string,
               public done: TimeLog = null){}}

// Tasks with Skilli, timelogs etc
export class Task {
    constructor(public title: string,
                public description: string,
                public assigned: Member,
                public subTask: Task,
                public timeLog: Array<TimeLog>,
                public skills: Array<Skill>) {} }

export class Skill {
    constructor(public title: string, public description) {} }

export class TimeLog {
    constructor(public created:Date,
                public hoursLeft: number,
                public hoursSpent: number,
                public member:Member,
                public comments: string,
                public githash: string) {} }

// Countdown to events like demos, major releases etc...
export class Countdown {
    constructor(public title: string,
                public description,
                public date: Date) {} }

// Users with Roles, Skills and avaliablity
export class Member {
    constructor(public _id: string,
                public name: string,
                public roles: Array<string>,
                public email: string,
                public skills: Array<Skill>,
                public currentProjectID: number) {} }

export class Absent {
    constructor(public member: Member,
                public from: Date,
                public to: Date,
                public comments: string) {} }

// Technical stack with associated test frameworks
// Eg angular...
export class Tech{
    constructor(public name: string, public deployment: Deployment) {} }

export class Deployment{ // Linked to a script to deploy somehow
    constructor(public name){} }

export class Bug{
    constructor(public _id: string,
                public tech: Tech,
                public title: string, 
                public description: string, 
                public assigned: Member, 
                public state: BugState) {} }

export class BugState { 
    constructor(public name: string) {} } 

export class Stack {
    constructor(public tech:Tech,
                public order: number,
                public test: Test) {} }

export class Test{ // Linked to a script to test somehow
    constructor(public name: string){} }

// ????
export class Quote {
    constructor(public text: string) {} }
