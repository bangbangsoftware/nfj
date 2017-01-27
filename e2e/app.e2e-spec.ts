import { NfjPage } from './app.po';

describe('nfj App', function() {
  let page: NfjPage;

  beforeEach(() => {
    page = new NfjPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
