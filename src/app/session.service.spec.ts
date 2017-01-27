/* tslint:disable:no-unused-variable */
/* tslint:disable:all */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { FakeRouter, FakeLocation, FakeDirection, FakeDB } from './fakes';

describe('Service: Session', () => {

  let fakeRouter = new FakeRouter(null);
  let fakeLocation = new FakeLocation('/team');
  let fakeDirection = new FakeDirection();
  let fakeDB = new FakeDB();

  let service: any;

  beforeEach(() => {
    console.log("Started");
    service = new SessionService(fakeRouter, fakeLocation, fakeDirection);
  });

  it('should exists...', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to tell that you are NOT logged in', () => {

    expect(service.isIn()).toBe(false);
    expect(fakeRouter.where[0]).toBe('login');
    expect(service.lastLocation).toBe('/team');
  });

  it('should be able to tell that you are logged in', () => {
    spyOn(service, "determineTitle");
    service.projectDB = fakeDB;
    expect(service.isIn()).toBe(true);
    expect(service.determineTitle).toHaveBeenCalled();
  });

  it('should be able to determine title of the screen', () => {
    const title = service.determineTitle();
    expect(title).toBe('Define the team');

    const titleDefault = service.determineTitle('default to story');
    expect(titleDefault).toBe('Story Creation');

    const titleOrder = service.determineTitle('/order');
    expect(titleOrder).toBe('Putting the stories in order');
  });


});
