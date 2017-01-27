import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Direction } from './direction';
import {
    Member,
    Project,
    Skill,
    StoryGroup,
    StoryItem,
    Acceptance,
    Role,
    Consequence,
    Impact
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
    public defaults: any;

    private titles = {
        '/points': 'Story Points',
        '/order': 'Putting the stories in order',
        '/team': 'Define the team'
    };

    constructor(private router: Router, private location: Location, private direction: Direction) {
        console.log('Hello from %cSession', 'font-size:300%; color:orange');
    }

    isIn() {
        console.log('Logged in?');
        if (this.projectDB) {
            this.determineTitle();
            return true;
        }
        console.log('Session has no db, logging out');
        this.lastLocation = this.location.path();
        this.router.navigate(['login']);
        return false;
    }

    onward() {
        this.direction.next(this);
    }

    logout() {
        this.projectDB = null;
        this.project = null;
        this.isIn();
    }

    login(ua: string, pw: string) {
        this.loginToDB(ua, pw)
            .then(() => {
                this.message = '';
            })
            .catch(() => {
                this.message = 'Incorrect Login';
            });
    }

    loginToDB(ua: string, pw: string) {
        return new Promise((resolve, reject) => {
            this.setupPouch('waterbear', ua, pw)
                .then(db => {
                    this.setupDB(db, ua);
                    resolve(true);
                })
                .catch(err => {
                    console.error(err);
                    reject(false);
                });
        });
    }

    setupDB(db, ua) {
        this.projectDB = db;
        const tester = this.testingSetup();

        //        this.userDB = this.setupPouch('users', ua, pw);
        //        this.userDB.get(tester.user._id + '').then(doc => {
        //            this.user = doc;
        //        }).catch(err => {
        //            if (err.status === 404) {
        //                this.userDB.put(tester.user).then(d => {
        //                    console.log('New user inserted');
        //                }).catch(err => console.log(err));
        //            }
        //        });

        this.projectDB.get('defaults')
            .then(defaults => {
                console.log('got defaults');
                this.defaults = defaults;
            }).catch(err => {
                if (err.status === 404) {
                    this.projectDB.put(this.getDefaults())
                        .then(d => {
                            this.defaults = d;
                            console.log('New defaults inserted');
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });

        this.projectDB.getUser(ua)
            .then(user => {
                console.log('Got user');
                const meta = {
                    metadata: tester.user
                };
                return this.projectDB.putUser(user.name, meta);
            }).catch(err => {
                console.log(err);

            }).then(ok => {
                console.log('updated user');
                return this.projectDB.getUser(ua);
            }).catch(err => {
                console.log(err);

            }).then(user => {
                console.log('Got updated user');
                this.user = user;
                return this.projectDB.get('' + user.currentProjectID);
            }).catch(err => {
                console.log(err);

            }).then(proj => {
                console.log('got user\'s current project');
                this.project = proj;
                return this.addMemberToTeam(this.projectDB, proj, this.user, 'Scrum Master');
            }).catch(err => {
                if (err.status === 404) {
                    this.projectDB.put(tester.project).then(d => {
                        console.log('New project inserted');
                    }).catch(error => console.log(error));
                }

            }).then(doc => {
                this.onward();
            }).catch(err => {
                console.log(err);
            });
    }

    determineTitle(where = null) {
        if (!where) {
            where = this.location.path();
        }
        const result = this.titles[where];
        if (result) {
            this.title = result;
        } else {
            this.title = 'Story Creation';
        }
        return this.title;
    }

    syncError(err) {
        console.log(err);
    }

    setupPouch(name, user, pw) {
        const remoteCoach = 'http://localhost:5984/' + name;
        const pouchOpts = {
            skipSetup: true,
            live: true
        };
        const db = new PouchDB(remoteCoach, pouchOpts, this.syncError);
        return new Promise((resolve, reject) => {
            db.login(user, pw).then(me => {
                console.log('There you are...');
                console.log(me);
                resolve(db);
                // const opts = {
                //     live: true
                // };
                // db.sync(remoteCoach, opts, syncError);
            }).catch(err => {
                reject(err);
                console.log(err);
            });
        });
    }

    addMemberToTeam(db, proj, member, role) {
        proj.team[member._id] = role;
        return db.put(proj._id, proj);
    }

    getDefaults() {
        return {
            _id: 'defaults',
            roles: this.getRoles(),
            impacts: this.getImpacts(),
            consequences: this.getConsequences()
        };
    }

    getConsequences() {
        const consequences = new Array<Consequence>();
        consequences.push(new Consequence('Unusable'));
        consequences.push(new Consequence('Unstable'));
        consequences.push(new Consequence('Cosmetic'));
        return consequences;
    }

    getImpacts() {
        const impacts = new Array<Impact>();
        impacts.push(new Impact('MVP'));
        impacts.push(new Impact('USP'));
        impacts.push(new Impact('Quicker'));
        impacts.push(new Impact('New feature'));
        return impacts;
    }

    getRoles() {
        const roles = new Array<Role>();
        roles.push(new Role('Product Owner'));
        roles.push(new Role('Scrum Master'));
        roles.push(new Role('Tester'));
        roles.push(new Role('Front end dev'));
        roles.push(new Role('Back end dev'));
        roles.push(new Role('UX'));
        roles.push(new Role('Trainer'));
        roles.push(new Role('Operation'));
        return roles;
    }

    testingSetup() {
        const skills = new Array<Skill>();
        const fred = new Member('0', 'Fred', 'cick.marter@gmail.com', skills, 0);

        const backlogStories = new Array<StoryItem>();
        backlogStories.push(new StoryItem('Write a story', 'general', 'yellow', 'a po', 'to be able to input a story',
            'the project can get features', -1, [new Acceptance('Should be able to do list of acceptance criteria')],
            [], new Impact('MVP')));
        backlogStories.push(new StoryItem('Order a story', 'general', 'yellow', 'a po',
            'to be able to move a story up and down the backlog',
            'features are in correct order', -1, [new Acceptance('This backlog should keep its order')],
            [], new Impact('MVP')));
        backlogStories.push(new StoryItem('Assign Points', 'general', 'yellow', 'the team', 'to be able to assign points to a story',
            'velocity can be estimated', -1, [new Acceptance('Story should keep their points')],
            [], new Impact('MVP')));
        backlogStories.push(new StoryItem('Write tasks', 'general', 'yellow', 'a scrum master', 'to be able to add sub tasks to a story',
            'sprints can be planned', -1, [new Acceptance('The sub tasks should be associated with the story')],
            [], new Impact('MVP')));
        backlogStories.push(new StoryItem('Create team', 'general', 'yellow', 'the team', 'to be able to enter team members',
            'members are up to date', -1, [new Acceptance('a team member should have a role - dev,po or scrum master')],
            [], new Impact('MVP')));
        backlogStories.push(new StoryItem('Write defintion of done', 'general', 'yellow', 'the team',
            'to be able to enter dod',
            'we can have confidence the story has now fully shipable artifacts', -1,
            [new Acceptance('This be broken down for the lifecycle of a feature')], [], new Impact('MVP')));

        const backlog = new StoryGroup('backlog', backlogStories);
        const stories = new Array<StoryGroup>();
        stories.push(backlog);

        const project = new Project('0', 'Tardigrade', 'The best way to manage agile development', stories, null);

        return {
            user: {
                email: fred.email,
                skils: fred.skills,
                currentProjectID: fred.currentProjectID
            },
            project
        };
    }
}
