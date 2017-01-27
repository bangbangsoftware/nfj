import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    Member,
    Project,
    Skill,
    StoryGroup,
    StoryItem,
    Acceptance,
    Task
} from './shared/models';

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-authentication'));

@Injectable()
export class SessionService {
    public userDB;
    public projectDB;

    public project: Project;
    public user: Member;
    public title: string;
    public lastLocation: string;
    public message: string;
    constructor(private router: Router, private location: Location) {
        console.log("Hello from %cSession", "font-size:300%; color:orange");
    }

    isIn() {
        console.log("Logged in?")
        if (this.projectDB) {
            this.determineTitle();
            return true;
        }
        console.log("Session has no db, logging out");
        this.router.navigate(['login']);
        this.lastLocation = this.location.path();
        return false;
    }

    onward() {
        if (this.lastLocation && this.projectDB) {
            this.router.navigate([this.lastLocation]);
        } else {
            // @TODO needs to do it based on user    
            this.router.navigate(['/story']);
        }
    }

    logout() {
        this.projectDB = null;
        this.project = null;
        this.isIn();
    }

    login(ua: string, pw: string) {
        this.loginToDB(ua, pw)
            .then(() => {
                this.message = "";
            })
            .catch(() => {
                this.message = "Incorrect Login";
            });
    }

    loginToDB(ua: string, pw: string) {
        return new Promise((resolve, reject) => {
            this.setupPouch("waterbear", ua, pw)
                .then(db => {
                    this.setupDB(db, ua);
                    resolve(true);
                })
                .catch(err => {
                    console.error(err);
                    reject(false);
                })
        });
    }

    setupDB(db, ua) {
        this.projectDB = db;
        const tester = this.testingSetup();

        //        this.userDB = this.setupPouch("users", ua, pw);
        //        this.userDB.get(tester.user._id + "").then(doc => {
        //            this.user = doc;
        //        }).catch(err => {
        //            if (err.status === 404) {
        //                this.userDB.put(tester.user).then(d => {
        //                    console.log("New user inserted");
        //                }).catch(err => console.log(err));
        //            }
        //        });

        this.projectDB.getUser(ua)
            .then(user => {
                console.log("Got user");
                this.projectDB.putUser(user.name, {
                    metadata: tester.user
                }).then(doc => {
                    console.log("Updated user");
                }).catch(err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });

        this.projectDB.get(tester.project._id + "").then(doc => {
            this.project = doc;
            this.onward();
        }).catch(err => {
            if (err.status === 404) {
                this.projectDB.put(tester.project).then(d => {
                    console.log("New project inserted");
                    this.onward();
                }).catch(err => console.log(err));
            }
        });
    }

    titles = {
        '/points': "Story Points",
        '/order': "Putting the stories in order",
        '/team': "Define the team"
    };
    determineTitle(where = null) {
        if (!where) {
            where = this.location.path();
        }
        const result = this.titles[where];
        if (result) {
            this.title = result;
        } else {
            this.title = "Story Creation";
        }
        return this.title;
    }

    syncError(err) {
        console.log(err);
    }

    setupPouch(name, user, pw) {
        const remoteCoach = "http://localhost:5984/" + name;
        var pouchOpts = {
            skipSetup: true,
            live: true
        };
        var db = new PouchDB(remoteCoach, pouchOpts, this.syncError);
        return new Promise((resolve, reject) => {
            db.login(user, pw).then(me => {
                console.log("There you are...");
                console.log(me);
                resolve(db);
                // const opts = {
                //     live: true
                // };
                //db.sync(remoteCoach, opts, syncError);
            }).catch(err => {
                reject(err);
                console.log(err)
            });
        });
    }

    testingSetup() {
        const scrumMaster = "Scrum Master";
        const roles = new Array<string>();
        roles.push(scrumMaster);

        const skills = new Array < Skill > ();
        const fred = new Member("0", "Fred", roles, "cick.marter@gmail.com", skills, 0);

        const backlogStories = new Array < StoryItem > ();
        backlogStories.push(new StoryItem('Write a story', 'general', 'yellow', 'a po', 'to be able to input a story', 'the project can get features', -1, [new Acceptance("Should be able to do list of acceptance criteria")], []));
        backlogStories.push(new StoryItem('Order a story', 'general', 'yellow', 'a po', 'to be able to move a story up and down the backlog', 'features are in correct order', -1, [new Acceptance("This backlog should keep its order")], []));
        backlogStories.push(new StoryItem('Assign Points', 'general', 'yellow', 'the team', 'to be able to assign points to a story', 'velocity can be estimated', -1, [new Acceptance("Story should keep their points")], []));
        backlogStories.push(new StoryItem('Write tasks', 'general', 'yellow', 'a scrum master', 'to be able to add sub tasks to a story', 'sprints can be planned', -1, [new Acceptance("The sub tasks should be associated with the story")], []));
        backlogStories.push(new StoryItem('Create team', 'general', 'yellow', 'the team', 'to be able to enter team members', 'members are up to date', -1, [new Acceptance("a team member should have a role - dev,po or scrum master")], []));
        backlogStories.push(new StoryItem('Write defintion of done', 'general', 'yellow', 'the team', 'to be able to enter dod', 'we can have confidence the story has now fully shipable artifacts', -1, [new Acceptance("This be broken down for the lifecycle of a feature")], []));

        const backlog = new StoryGroup("backlog", backlogStories);
        const stories = new Array < StoryGroup > ();
        const team = new Array < Member > ();
        team.push(fred);
        stories.push(backlog);

        const project = new Project("0", "Tardigrade", "The best way to manage agile development", stories, team);

        return {
            user: {
                roles: fred.roles,
                email: fred.email,
                skils: fred.skills,
                currentProjectID: fred.currentProjectID
            },
            project
        };
    }
}
