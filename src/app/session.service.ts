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
  Tag
} from './shared/models';

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-authentication'));

@Injectable()
export class SessionService {
  public userDB;
  public projectDB;

  public user: Member;
  public title: string;
  public lastLocation: string;
  public message: string;
  public defaults = this.getDefaults();
  public project = this.getFakeProject();

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

  login(name: string, pw: string) {
    this.loginToDB(name, pw)
      .then(() => {
        this.message = '';
      })
      .catch(() => {
        this.message = 'Incorrect Login';
      });
  }

  loginToDB(name: string, pw: string) {
    return new Promise((resolve, reject) => {
      this.setupPouch('waterbear', name, pw)
        .then(db => {
          this.setupDefaults(db);
          this.setupDB(db, name);
          resolve(true);
        })
        .catch(err => {
          console.error(err);
          reject(false);
        });
    });
  }

  setupDefaults(db) {
    db.get('defaults')
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
            .catch(this.error);
        }
      });
  }

  updateUser(name, tester) {
    return new Promise<Member>((resolve, reject) => {
      this.projectDB.getUser(name)
        .then(user => {
          console.log('Got user');
          const meta = {
            metadata: tester.user
          };
          return this.projectDB.putUser(user.name, meta);
        }).catch(err => {
          console.error(err);
          reject(err);

        }).then(ok => {
          console.log('updated user');
          return this.projectDB.getUser(name);
        }).catch(err => {
          console.error(err);
          reject(err);

        }).then(user => {
          console.log('Got updated user');
          this.user = user;
          resolve(user);
        });
    });
  }

  setupDB(db, name) {
    this.projectDB = db;
    const tester = this.testingSetup();

    this.updateUser(name, tester)
      .then(user => {
        console.log('Got updated user');
        this.user = user;
        return this.projectDB.get('' + user.currentProjectID);
      }).catch(this.error)

      .then(proj => {
        console.log('got user\'s current project');
        this.project = proj;
        return this.addMemberToTeam(this.projectDB, proj, this.user, 'Scrum Master');
      }).catch(err => {
        if (err.status === 404) {
          this.projectDB.put(tester.project).then(d => {
            console.log('New project inserted');
          }).catch(this.error);
        }

      }).then(() => {
        this.onward();
      }).catch(this.error);
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

  error(err) {
    console.log(err);
  }

  setupPouch(name, user, pw) {
    const remoteCoach = 'http://localhost:5984/' + name;
    const pouchOpts = {
      skipSetup: true,
      live: true
    };
    const db = new PouchDB(remoteCoach, pouchOpts, this.error);
    return new Promise((resolve, reject) => {
      db.login(user, pw).then(me => {
        console.log('There you are...');
        console.log(me);
        resolve(db);
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

  getColours() {
    return ['yellow', 'red', 'blue', 'orange', 'black', 'green', 'white', 'brown'];

  }
  getColoursClasses() {
    return ['yellow', 'red', 'blue', 'orange', 'black', 'green', 'white', 'brown'];
  }

  getDefaults() {
    return {
      _id: 'defaults',
      roles: this.getRoles(),
      tags: this.getTags(),
      consequences: this.getConsequences(),
      colours: this.getColours(),
      colourClasses: this.getColoursClasses()
    };
  }

  getConsequences() {
    const consequences = new Array<string>();
    consequences.push('Unusable');
    consequences.push('Unstable');
    consequences.push('Cosmetic');
    return consequences;
  }

  getTags() {
    const tags = new Array<string>();
    tags.push('Feature');
    tags.push('Technical Debt');
    tags.push('Missing Functionality');
    tags.push('MVP');
    tags.push('USP');
    tags.push('Quicker');
    tags.push('New feature');
    return tags;
  }

  getRoles() {
    const roles = new Array<string>();
    roles.push('Product Owner');
    roles.push('Scrum Master');
    roles.push('Tester');
    roles.push('Front end dev');
    roles.push('Back end dev');
    roles.push('UX');
    roles.push('Trainer');
    roles.push('Operation');
    return roles;
  }

  getFakeProject() {
     const backlogStories = new Array<StoryItem>();
    backlogStories.push(new StoryItem('Write a story', 'yellow', 'a po', 'to be able to input a story',
      'the project can get features', -1, [new Acceptance('Should be able to do list of acceptance criteria')],
      [new Tag('MVP')]));
    backlogStories.push(new StoryItem('Order a story', 'yellow', 'a po',
      'to be able to move a story up and down the backlog',
      'features are in correct order', -1, [new Acceptance('This backlog should keep its order')],
      [new Tag('MVP')]));
    backlogStories.push(new StoryItem('Assign Points', 'yellow', 'the team', 'to be able to assign points to a story',
      'velocity can be estimated', -1, [new Acceptance('Story should keep their points')],
      [new Tag('MVP')]));
    backlogStories.push(new StoryItem('Write tasks', 'yellow', 'a scrum master', 'to be able to add sub tasks to a story',
      'sprints can be planned', -1, [new Acceptance('The sub tasks should be associated with the story')],
      [new Tag('MVP')]));
    backlogStories.push(new StoryItem('Create team', 'yellow', 'the team', 'to be able to enter team members',
      'members are up to date', -1, [new Acceptance('a team member should have a role - dev,po or scrum master')],
      [new Tag('MVP')]));
    backlogStories.push(new StoryItem('Write defintion of done', 'yellow', 'the team',
      'to be able to enter dod',
      'we can have confidence the story has now fully shipable artifacts', -1,
      [new Acceptance('This be broken down for the lifecycle of a feature')], [new Tag('MVP')]));

    const backlog = new StoryGroup('backlog', backlogStories);
    const stories = new Array<StoryGroup>();
    stories.push(backlog);
    return new Project('0', 'Tardigrade', 'The best way to manage agile development', stories, null);
  }


  testingSetup() {
    const skills = new Array<Skill>();
    const fred = new Member('0', 'Fred', 'cick.marter@gmail.com', skills, 0);

    return {
      user: {
        email: fred.email,
        skils: fred.skills,
        currentProjectID: fred.currentProjectID
      },
      project: this.getFakeProject()
    };
  }
}
