/* tslint:disable:no-unused-variable */
/* tslint:disable:all */

import { addProviders, async, inject } from '@angular/core/testing';
import SessionService  from './session.service'; 
import { StoryItem, Member } from './shared';

describe('Service: Session', () => {
    beforeEach(() => {
        addProviders([SessionService]);
    });

    it('should exists...',
        inject([SessionService], (service: SessionService) => {
            expect(service).toBeTruthy();
        }));

    it('should start with no stories',
        inject([SessionService], (service: SessionService) => {
            const stories = service.getStories();
            expect(stories.length).toBe(0);
        }));

    it('should be able to add and remove storie StoryItem',
        inject([SessionService], (service: SessionService) => {
            const s1 = new StoryItem('Write a story', 'yellow', 'Should be able to input a story', -1, ["Should be able to do list of acceptance criteria"], []);
            const s2 = new StoryItem('Order a story', 'yellow', 'Should be able to move a story up and down the backlog', -1, ["This backlog should keep its order"], []);
            service.addStory(s1);
            service.addStory(s2);
            service.addStory(new StoryItem('Assign Points', 'yellow', 'Should be able to assign points to a story', -1, ["Story should keep their points"], []));
            service.addStory(new StoryItem('Write tasks', 'yellow', 'Should be able to add sub tasks to a story', -1, ["The sub tasks should be associated with the story"], []));
            service.addStory(new StoryItem('Create team', 'yellow', 'Should be able to enter team members', -1, ["a team member should have a role - dev,po or scrum master"], []));
            service.addStory(new StoryItem('Write defintion of done', 'yellow', 'Should be able to enter dod', -1, ["This be broken down for the lifecycle of a feature"], []));

            const stories = service.getStories();
            expect(stories.length).toBe(6);

            service.remove(s1);
            service.remove(s2);
            expect(stories.length).toBe(4);
        }));
});
