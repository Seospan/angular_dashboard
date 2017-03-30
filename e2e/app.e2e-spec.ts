import { BlizzarddashboardPage } from './app.po';

describe('blizzarddashboard App', () => {
  let page: BlizzarddashboardPage;

  beforeEach(() => {
    page = new BlizzarddashboardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
